# SHIELD_R Copilot Instructions

## Project Overview

SHIELD_R is a personal safety & emergency response platform with:

- **Frontend**: React 18 + React Router (Vite dev server, no build artifacts in repo)
- **Backend**: Node.js Express with in-memory data store (no database)
- **Architecture**: Client polls backend APIs; data is ephemeral per session

## Key Development Workflows

### Running the Application

- **Backend**: `cd backend && npm run dev` (http://localhost:5000, uses nodemon for auto-reload)
- **Frontend**: `cd frontend && npm run dev` (http://localhost:5173, Vite default)
- **Environment**: Set `VITE_API_URL` environment variable to override API base URL (defaults to http://localhost:5000)

### API Layer Pattern

- **Location**: [frontend/src/services/api.js](frontend/src/services/api.js) — Single `request()` helper with `Content-Type: application/json` headers
- All API functions use this wrapper; error handling extracts backend error messages
- Backend CORS enabled; no auth/token validation

## Code Patterns & Conventions

### React Component Structure

- **Page Components** ([frontend/src/pages/](frontend/src/pages/)): Manage state, API calls, geolocation integration
  - Use `useEffect` + `useState` for data fetching and UI state
  - Example: Dashboard fetches location, SOS status, contacts, zones in parallel with `Promise.all()`
- **Reusable Components** ([frontend/src/components/](frontend/src/components/)): SOSButton, StatusCard, Navbar, Footer
  - Keep components simple; pass data and callbacks via props

### Backend Route Structure

- **File Pattern**: [backend/routes/](backend/routes/) contains modular routers (sos.js, location.js, contacts.js, zones.js)
- **Data Store**: Accessed via `req.app.locals.store` (in-memory, shared across requests)
- **Validation**: Basic input validation (e.g., contacts require `name` and `phone`)
- **Response Format**: `{ status: "...", message: "...", time: "..." }` for actions; direct data for GETs

### Data Models

- **SOS**: `{ active: boolean, time: ISO string, lat: number|null, lng: number|null }`
- **Location**: `{ lat: number|null, lng: number|null, updatedAt: ISO string|null }`
- **Contact**: `{ id: string, name: string, phone: string, priority: number|null }`
- **Zone**: `{ id: number, type: "safe"|"avoid", name: string, category: string, lat: number, lng: number }`

### Geolocation Integration

- Dashboard uses `navigator.geolocation.getCurrentPosition()` to capture device coordinates
- Updates sent to backend `/location` endpoint; data persists in-memory until app restart
- No real-time location tracking; polling-based sync

## API Endpoints Reference

```
GET  /health              — Backend health check
POST /sos                 — Trigger SOS (payload: {lat, lng})
POST /sos/resolve         — Clear SOS state
GET  /sos                 — Get current SOS state
POST /location            — Update device location
GET  /location            — Get stored location
POST /contacts            — Create contact (body: {name, phone, priority?})
PUT  /contacts/:id        — Update contact
DELETE /contacts/:id      — Delete contact
GET  /contacts            — Get all contacts (sorted by priority)
GET  /zones               — Get all predefined safe/avoid zones
```

## Critical Implementation Notes

- **Contacts sorting**: Backend sorts by priority (lower numbers first; null treated as 99)
- **Zone lookup**: Dashboard attempts `getNearbyZones()` if location available, falls back to all zones
- **Error handling**: Backend errors returned as JSON; frontend catches and displays messages
- **No persistence**: All data (SOS, location, contacts) resets on backend restart
- **Mobile-first UI**: CSS assumes small screen layout; test on mobile dimensions

## File Structure Mapping

```
frontend/src/
├── services/api.js        ← All API calls (DO NOT modify endpoint URLs here for testing; use VITE_API_URL)
├── pages/                 ← Route-driven page components (call APIs, manage page state)
├── components/            ← Shared UI components (minimal logic)
└── App.jsx                ← Router setup with 6 routes

backend/routes/            ← Each file handles one resource (sos, location, contacts, zones)
```

## Development Notes

- No TypeScript; no build step for backend
- No authentication/authorization
- Contacts prioritized by numeric value; zones pre-seeded with Telangana locations
- Frontend can trigger SOS even without location; location is optional but recommended for emergency response
