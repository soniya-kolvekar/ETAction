# Indian Railways Dynamic ETA Prediction System - Backend

## Setup and Run
1. `npm install`
2. Create `.env` based on `.env.example`
3. Start the server: `npm run dev`

## API Endpoints Overview

| METHOD | ENDPOINT | PURPOSE | DB COLLECTIONS USED |
|---|---|---|---|
| GET | `/api/v1/health` | Health Check | System |
| GET | `/api/v1/dashboard/summary` | Main dashboard stats | `daily_train_state`, `delay_events` |
| GET | `/api/v1/dashboard/trains` | List all trains & state | `daily_train_state`, `trains` |
| GET | `/api/v1/routes` | Available routes | `trains`, `stations` |
| GET | `/api/v1/routes/:routeId` | Route stations/sections | `trains`, `train_routes`, `stations`, `sections` |
| GET | `/api/v1/routes/:routeId/trains` | Trains on route | `trains`, `daily_train_state` |
| GET | `/api/v1/routes/:routeId/sections/status` | Route intelligence | `block_events`, `speed_restrictions`, `maintenance_blocks`, `weather_condition` |
| GET | `/api/v1/routes/:routeId/occupancy` | Occupancy for route | `block_events` |
| GET | `/api/v1/trains/:trainId` | Train metadata | `trains` |
| GET | `/api/v1/trains/:trainId/route` | Train route sequence | `train_routes` |
| GET | `/api/v1/trains/:trainId/position` | Current position | `daily_train_state` |
| GET | `/api/v1/trains/:trainId/status` | Concise status | `daily_train_state` |
| GET | `/api/v1/trains/:trainId/schedule` | Schedule | `schedules` |
| GET | `/api/v1/trains/:trainId/eta` | Dynamic deterministic ETA | `daily_train_state`, `train_routes`, `sections`, `stations`, etc. |
| GET | `/api/v1/trains/:trainId/delays` | Train delays | `delay_events` |
| GET | `/api/v1/trains/:trainId/delay-analysis` | Aggregated delay reasons | `delay_events` |
| GET | `/api/v1/trains/:trainId/alerts` | Predictive alerts | `daily_train_state`, `train_routes`, `speed_restrictions`, etc. |
| GET | `/api/v1/sections/:sectionId` | Section metadata | `sections` |
| GET | `/api/v1/sections/:sectionId/occupancy` | Occupancy status | `block_events` |
| GET | `/api/v1/sections/:sectionId/block-events` | Block event history | `block_events` |
| GET | `/api/v1/sections/:sectionId/maintenance` | Maintenance blocks | `maintenance_blocks` |
| GET | `/api/v1/sections/:sectionId/speed-restrictions`| Speed restrictions | `speed_restrictions` |
| GET | `/api/v1/sections/:sectionId/weather` | Weather condition | `weather_condition` |
| GET | `/api/v1/passenger/trains/search` | Passenger search | `trains` |
| GET | `/api/v1/passenger/trains/:trainId/status` | Passenger status | `trains`, `daily_train_state` |
| GET | `/api/v1/passenger/trains/:trainId/stations` | Passenger upcoming ETAs | ETA service |

**Note**: All routes accept a `?date=YYYY-MM-DD` query parameter for simulated testing where applicable.
