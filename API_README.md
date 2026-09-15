# SIH Railway Demo API - Frontend Usage Guide

This document provides details on how the backend APIs can be used in the frontend application. 

## Base URL
All API requests should be prefixed with the base API URL:
```javascript
const BASE_URL = 'http://localhost:5000/api/v1'; // Change this to your deployed backend URL in production
```

## How to use in the Frontend

It is recommended to use `fetch` or a library like `axios` to make API requests. Example using `fetch`:

```javascript
// Example: Fetching details for a specific train
async function fetchTrainDetails(trainId) {
  try {
    const response = await fetch(`${BASE_URL}/trains/${trainId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching train details:', error);
  }
}
```

## API Endpoints

### 1. General
| Endpoint | Method | Description | Frontend Usage Scenario |
|----------|--------|-------------|-------------------------|
| `/` | `GET` | Root API Endpoint. Returns a welcome message. | Verify API connectivity. |
| `/health` | `GET` | Health Check. Returns DB connection status. | Display backend health status on an admin dashboard. |

### 2. Dashboard
| Endpoint | Method | Description | Frontend Usage Scenario |
|----------|--------|-------------|-------------------------|
| `/dashboard/summary` | `GET` | Gets overall summary statistics. | Show high-level metrics (total trains, delays, etc.) on the main dashboard. |
| `/dashboard/trains` | `GET` | Gets a list of trains for the dashboard. | Populate a data table of active trains on the dashboard. |

### 3. Routes
| Endpoint | Method | Description | Frontend Usage Scenario |
|----------|--------|-------------|-------------------------|
| `/routes/` | `GET` | Gets a list of all routes. | Populate a dropdown to let users select a specific route. |
| `/routes/:routeId` | `GET` | Gets details for a specific route. | Show route details on a route-specific page. |
| `/routes/:routeId/trains` | `GET` | Gets all trains on a specific route. | Display a list of trains currently running on a selected route. |
| `/routes/:routeId/sections/status`| `GET` | Gets the status of sections on a route. | Visualize which sections of a route are clear, blocked, or under maintenance. |
| `/routes/:routeId/occupancy` | `GET` | Gets occupancy details for a route. | Show traffic density or occupancy heatmaps for a route. |

### 4. Sections
| Endpoint | Method | Description | Frontend Usage Scenario |
|----------|--------|-------------|-------------------------|
| `/sections/:sectionId` | `GET` | Gets details for a specific section. | Display details when a user clicks on a track section on a map. |
| `/sections/:sectionId/maintenance` | `GET` | Gets maintenance blocks for a section. | Show active or scheduled maintenance alerts for a specific track section. |
| `/sections/:sectionId/speed-restrictions` | `GET` | Gets speed restrictions for a section. | Warn drivers or operators about speed limits on a section. |
| `/sections/:sectionId/weather` | `GET` | Gets weather data for a section. | Display current weather conditions affecting a specific track area. |
| `/sections/:sectionId/block-events` | `GET` | Gets block events for a section. | Show history or current active blockages on a track. |
| `/sections/:sectionId/occupancy` | `GET` | Gets occupancy data for a section. | Indicate if a specific track section is currently occupied by a train. |

### 5. Trains
| Endpoint | Method | Description | Frontend Usage Scenario |
|----------|--------|-------------|-------------------------|
| `/trains/:trainId` | `GET` | Gets detailed info for a specific train. | Populate a "Train Details" modal or page. |
| `/trains/:trainId/route` | `GET` | Gets the assigned route for a train. | Draw the train's path on a map visualization. |
| `/trains/:trainId/position` | `GET` | Gets the current GPS/track position. | Plot the live location of the train on a map. |
| `/trains/:trainId/status` | `GET` | Gets the live status (running, halted, etc.). | Show a live status badge (e.g., "On Time", "Delayed") next to a train. |
| `/trains/:trainId/schedule` | `GET` | Gets the planned schedule for the train. | Display a timetable of upcoming stations and expected times. |
| `/trains/:trainId/eta` | `GET` | Gets the calculated Estimated Time of Arrival. | Show predicted arrival times to passengers or operators. |
| `/trains/:trainId/delays` | `GET` | Gets active delays for a train. | Notify users about specific delays affecting the train. |
| `/trains/:trainId/delay-analysis` | `GET` | Gets analytical data on delays. | Show charts explaining why a train is delayed. |
| `/trains/:trainId/alerts` | `GET` | Gets critical alerts for a train. | Display urgent notifications (e.g., "Emergency Brake Applied"). |

### 6. Passenger
| Endpoint | Method | Description | Frontend Usage Scenario |
|----------|--------|-------------|-------------------------|
| `/passenger/trains/search` | `GET` | Search for trains between stations. | Implement a "Search Trains" feature for passengers. |
| `/passenger/trains/:trainId/status` | `GET` | Gets public-facing train status. | Show simplified live tracking for passengers. |
| `/passenger/trains/:trainId/stations`| `GET` | Gets a list of upcoming stations. | Show the stops a train will make for a passenger itinerary. |
