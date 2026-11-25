# Tour Booking & Summary Interface (SCRUM-8)

This repo contains a minimal baseline app for a Tour Booking & Summary Interface, with a React (V) frontend and a node/Express API macked by SQLite persistence.

## Stack
- Web: React (Vite)
- API: Express
- DB (persistence): SQLite (powered by better-sqlite3)

## Run locally
In two terminals:

1) Start the API
```bash
npm i
npm --workspace api run dev
# API runs on http://localhost:5173
```

2) Start the web app
```bash
npm -workspace web run dev
# Web runs on http://localhost:5174
```

The web deve server proxies requests for `/api` -> `http://localhost:5173`.

## API endpoints
- `GET /api/bookings`: returns all bookings from SQLite
- ``POST /api/bookings``: creates a booking and persists it to SQLite

## Download Brochure (Demo)
The Web UI includes a "Download Brochure" card that:
- Generates a demo `tour-brochure.pdf` in-browser using `Blob` + `URL.createObjectURL`
- Shows helper text: `Demo file generated in-browser`
- Revokes the object URL after triggering the download to avoid memory leaks
- Supports `?simulate_error=true` to show an inline error: `Unable to generate brochure (demo)`

## Test Ids
 All `data-testid` attributes are canonical kebab-case (e.g. `booking-form`, `download-brochure-button`).
