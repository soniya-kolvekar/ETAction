# ETAction System Architecture

## 1. System Overview & Domain Context
**ETAction** (Indian Railways Dynamic ETA Prediction & Track Monitoring System) is a ground-truth-based operations and monitoring platform designed to provide accurate, dynamic Estimated Time of Arrival (ETA) predictions, real-time track telemetry, and delay analysis for railway operations.

### Ground-Truth Sensing vs. Unreliable GPS
Traditional train tracking relies heavily on onboard GPS or manual station reports, both of which suffer from severe limitations: signal loss in tunnels/rural expanses, high latency, battery exhaustion, or onboard device failure. ETAction replaces reliance on GPS with physical track-side infrastructure:
- **Axle Counters & Track Circuits**: Hardware deployed along the rail line that detects wheel flanges or electrical shunting, determining definitively whether a block section is occupied or clear.
- **Block Section Network Graph**: Real-time aggregation of discrete block section occupancies into an interconnected network topology representing a station, section, or railway division.
- **Custom Model Identification**: A machine learning / heuristic pipeline that correlates chronological block occupancy sequences with the official Working Time Table (WTT), train schedules, and historical transit run profiles to identify specific trains traversing the network.
- **Speed Calculation**:
  - *Single Axle Counter*: Instantaneous speed derived from pulse frequencies (axles per second) given known coach axle distances.
  - *Two-Point / Block Transit*: Average transit speed calculated across known block section lengths using entry and exit timestamps ($v = d / \Delta t$).

### Primary Target Role: Section Admin Dashboard
The web application is tailored primarily as a **Section Admin Dashboard** for section controllers, station masters, and divisional engineers who oversee a localized railway network or series of block sections. It gives them situational awareness over precedence, track occupancy, headway conflicts, active caution orders, and dynamic ETAs.

Unlike naive distance/speed ETA estimates, ETAction calculates deterministic ETAs by dynamically compounding:
- Ground-truth block occupancy events and section entry/exit timestamps.
- Scheduled timetables, dwell times, and operational precedence.
- Track segment geometry and maximum permissible speeds.
- Active Temporary Caution Orders (TCO) and speed restrictions.
- Scheduled or emergency maintenance blocks.
- Real-time weather impediments (e.g. fog, heavy rainfall).
- Downstream block section congestion and red-signal hold-ups.


---

## 2. Monorepo & Deployment Architecture
The repository is managed as a unified monorepo deployed on Vercel via [vercel.json](./vercel.json).

```
ETAction/
├── backend/                  # Node.js / Express API Service
│   ├── src/
│   │   ├── config/           # Database and environment configurations
│   │   ├── controllers/      # Express route controllers
│   │   ├── middleware/       # Error handling, 404 middleware
│   │   ├── models/           # Mongoose schemas (12 collections)
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic (ETA engine, alerts, routes)
│   │   ├── app.js            # Express application entry & middleware
│   │   └── server.js         # Server runner & database connector
│   └── package.json
├── frontend/                 # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (passenger & admin views)
│   │   └── services/         # Client API client & Firebase authentication
│   └── package.json
├── vercel.json               # Multi-service routing rules
├── ARCHITECTURE.md           # This document
├── API_README.md             # API consumer documentation
└── .gitignore                # Git ignore patterns
```

### Vercel Routing Configuration
- `/api/backend(/.*)?` $\rightarrow$ Dispatched to the `backend` service (`src/server.js`).
- `/(.*)` $\rightarrow$ Dispatched to the `frontend` service (Next.js App Router).

---

## 3. Backend Architecture (`/backend`)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB via Mongoose 9.9.4
- **Auth Verification**: Firebase Admin / Client Auth tokens

### Core Mongoose Models (`backend/src/models/`)
| Model | Collection | Description |
|---|---|---|
| `Train` | `trains` | Static train details: number, name, type (Express/Passenger), source station, destination station. |
| `DailyTrainState` | `daily_train_states` | Real-time state of a train for a specific date: current section, status, current speed, accumulated delay, last updated timestamp. |
| `TrainRoute` | `train_routes` | Sequence of track sections and intermediate station stops connecting origin to destination. |
| `Section` | `sections` | Physical rail block/segment: section ID, start/end stations, distance (km), max permissible speed (km/h). |
| `Station` | `stations` | Station metadata: code, name, coordinates (lat/lng), platforms. |
| `Schedule` | `schedules` | Planned arrival, departure, and dwell times per station for each train. |
| `DelayEvent` | `delay_events` | Granular delay logs attributing delays to causes (traffic, signal failure, maintenance, weather). |
| `BlockEvent` | `block_events` | Track signal block occupancy and clearance events. |
| `MaintenanceBlock` | `maintenance_blocks` | Scheduled or active maintenance occupations restricting movement on sections. |
| `SpeedRestriction` | `speed_restrictions` | Active Temporary Caution Orders (TCO) imposing speed ceilings on specific sections. |
| `WeatherCondition` | `weather_conditions` | Section-level weather hazards (visibility drop, track conditions). |
| `HistoricalSectionRun` | `historical_section_runs` | Historical transit run records used for analytical benchmarking. |

### Business Logic Services (`backend/src/services/`)
- **`eta.service.js`**: Calculates step-by-step dynamic travel times across downstream sections by factoring base section runtime, caution order penalties, weather friction, and scheduled station dwell.
- **`alert.service.js`**: Scans downstream sections of active trains to detect impending caution orders, maintenance closures, or safety hazards and produce actionable alerts.
- **`route.service.js`**: Resolves route topology, station sequences, and section occupancy statuses.
- **`firebase.js`**: Handles authentication integration.

### REST API Endpoints (`backend/src/routes/`)
All endpoints are prefixed with `/api/v1`:
- **General & Health**:
  - `GET /api/v1`: Root welcome info.
  - `GET /api/v1/health`: Checks MongoDB connection status (`connected` / `disconnected`).
- **Dashboard (`/api/v1/dashboard`)**:
  - `GET /summary`: Network-level operational metrics (active trains, delayed trains, on-time percentage).
  - `GET /trains`: Current state listing of all active trains.
- **Routes (`/api/v1/routes`)**:
  - `GET /`: List of configured railway routes.
  - `GET /:routeId`: Route details with station and section sequences.
  - `GET /:routeId/trains`: All trains currently traversing the route.
  - `GET /:routeId/sections/status`: Section-by-section health, restrictions, and maintenance state.
  - `GET /:routeId/occupancy`: Real-time section occupancy on the route.
- **Sections (`/api/v1/sections`)**:
  - `GET /:sectionId`: Section details.
  - `GET /:sectionId/occupancy`: Live occupancy status.
  - `GET /:sectionId/block-events`: History of block occupancy events.
  - `GET /:sectionId/maintenance`: Scheduled and active maintenance windows.
  - `GET /:sectionId/speed-restrictions`: Active speed restrictions.
  - `GET /:sectionId/weather`: Weather conditions impacting the section.
- **Trains (`/api/v1/trains`)**:
  - `GET /:trainId`: Train metadata.
  - `GET /:trainId/route`: Ordered route path.
  - `GET /:trainId/position`: Live GPS and track section position.
  - `GET /:trainId/status`: Concise status (Running, Delayed, Halted).
  - `GET /:trainId/schedule`: Timetable and scheduled arrival/departure.
  - `GET /:trainId/eta`: Dynamic deterministic ETA calculation for upcoming stops.
  - `GET /:trainId/delays`: Granular delay events.
  - `GET /:trainId/delay-analysis`: Categorized root cause delay analysis.
  - `GET /:trainId/alerts`: Safety alerts and restriction notices.
- **Passenger (`/api/v1/passenger`)**:
  - `GET /trains/search`: Search trains between origin and destination stations.
  - `GET /trains/:trainId/status`: Simplified public tracking view.
  - `GET /trains/:trainId/stations`: Station timeline with predicted dynamic arrival times.

---

## 4. Frontend Architecture (`/frontend`)

### Technology Stack
- **Framework**: Next.js 16.3.3 (App Router)
- **UI Library**: React 19.2.8
- **Styling**: Tailwind CSS v4, PostCSS
- **Icons**: Lucide React
- **Auth**: Firebase Client SDK

### Application Routes & Views
- **Root Landing**:
  - `/`: Configured via `src/app/page.js` and `next.config.mjs` to automatically redirect to `/admin/network` as the primary operational landing view.
- **Public Passenger Interface**:
  - `/train/[trainNumber]`: Live passenger status page showing station progress, delays, and dynamic ETAs.
  - `/login`: Passenger login interface.
- **Admin & Controller Portal**:
  - `/admin`: Operations control dashboard displaying fleet KPIs, active trains list, and delay metrics.
  - `/admin/network`: Ground-truth Section Admin Command Center ("AreWeThereYet") featuring a light-themed Shopeers-inspired dashboard aesthetic, an interactive 2D railway network topology powered by React Flow (`@xyflow/react`) with custom station nodes, smoothstep track edges, passing loop sidings, dual speed derivations (axles/sec vs block transit), 3-step custom train identification pipeline, and an automated real-time train movement and operational scenario engine.
  - `/admin/routes`: Interactive route viewer displaying section health, caution orders, and track occupancy.
  - `/admin/train/[trainNumber]`: Deep telemetry view for individual trains with caution orders, delay cause diagnostics, and predictive alerts.
  - `/admin/login`: Controller/admin authentication interface.

### Client Services
- [`frontend/src/services/api.js`](./frontend/src/services/api.js): Centralized `fetchApi` client that resolves the base backend API URL and transparently injects the Firebase Auth ID token into the `Authorization: Bearer <token>` header when authenticated.
- [`frontend/src/services/firebase.js`](./frontend/src/services/firebase.js): Initializes the Firebase app, authentication, and Google Auth Provider.

---

## 5. Operating Guidelines & Rules
All modifications and automated tasks within this repository are governed by the guidelines in [GEMINI.md](./GEMINI.md):
1. **Never run the project**: The user runs the project.
2. **Mandatory implementation plan**: Every request requires an implementation plan before touching code.
3. **No autonomous terminal commands**: Explicit permission is required for any terminal execution.
4. **Always update ARCHITECTURE.md**: This document must remain continuously synchronized with any architectural changes.

