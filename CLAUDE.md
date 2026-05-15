# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is in the **planning phase**. No code has been written yet. The source of truth for requirements is [PRD.md](PRD.md) and the architecture decisions are in [Master-Plan.md](Master-Plan.md).

## Planned Tech Stack

- **Framework:** Vite + React (SPA)
- **Styling:** Vanilla CSS / CSS Modules — no Tailwind or utility frameworks
- **Map:** Leaflet.js + React-Leaflet with OpenStreetMap tiles
- **State:** Zustand store for global itinerary state
- **Routing API:** OpenRouteService or Mapbox Directions (mock first for MVP)
- **Typography:** Inter or Outfit via Google Fonts

## Commands (once initialized)

```bash
npm create vite@latest . -- --template react
npm install
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview production build
```

## Architecture

**Layout:** Full-viewport split screen (`100vh`, no body scroll).
- **Sidebar** — fixed `400px` wide, internally scrollable; contains trip header, day tabs, and timeline of events + travel segments
- **Map area** — fills `calc(100vw - 400px)`; Leaflet map with custom markers per event type

**Data model hierarchy:** `Trip → Day[] → Event[]`

Each `Event` has: time, location name, coordinates, and category (`flight` | `food` | `shopping` | `activity` | `accommodation`).

**State:** Single Zustand store manages the full trip state. No server — all client-side.

**Interactivity:** Clicking a sidebar event pans/zooms the map to that location. Hover on timeline highlights the corresponding map pin (and vice versa).

**Travel segments:** Displayed inline between consecutive events in the sidebar, showing mode (walking / transit / taxi) and estimated travel time. Visualized as a route line on the map.

**Modals/Drawers:** "Add Event" form opens as a modal/drawer to keep the main layout uncluttered.

## Design System

Theme name: "Wanderlust Modern" — light mode, glassmorphism accents over the map, rounded corners, vibrant coral or ocean-blue accent color.

CSS variables drive the color palette and spacing. Micro-animations: sidebar day collapse/expand, map fly-to on selection, hover states on timeline items.

## Implementation Order

Follow the phases in [Master-Plan.md](Master-Plan.md): Foundation → Map Integration → State & Data Models → Interactivity & Forms → Routing & Polish.
