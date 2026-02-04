# SHIELD_R

Personal Safety & Emergency Response Platform (Simple Version)

## Features

- SOS triggering (one-tap)
- Live location update and retrieval
- Emergency contacts CRUD
- Safe/Danger/Avoid zones
- Calm, mobile-first UI

## Tech Stack

- Frontend: React (JSX), React Router, Fetch API, Vite
- Backend: Node.js, Express, in-memory data

## Run Backend

1. Install dependencies:
   - `cd backend`
   - `npm install`
2. Start server:
   - `npm run dev`

Backend runs on http://localhost:5000

## Run Frontend

1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Start dev server:
   - `npm run dev`

Frontend runs on http://localhost:5173

## Environment

- Frontend API base URL can be set with `VITE_API_URL`.
  Example: `VITE_API_URL=http://localhost:5000`

## API Summary

- `GET /health`
- `POST /sos` | `GET /sos` | `POST /sos/resolve`
- `POST /location` | `GET /location`
- `GET /contacts` | `POST /contacts` | `PUT /contacts/:id` | `DELETE /contacts/:id`
- `GET /zones`
