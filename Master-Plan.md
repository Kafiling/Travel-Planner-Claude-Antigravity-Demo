# Master Plan & Design Decisions

## 1. Technology Stack
*   **Core Framework:** Vite + React (Fast development, optimal for single-page web apps).
*   **Styling:** Vanilla CSS / CSS Modules. *Decision:* Per system guidelines, we will use Vanilla CSS to ensure maximum control over the premium design aesthetic, avoiding utility frameworks like Tailwind unless later requested.
*   **Map Integration:** Leaflet.js with React-Leaflet. *Decision:* Leaflet is open-source, highly customizable, and doesn't require immediate API billing setup like Google Maps, making it ideal for rapid development. We can use OpenStreetMap tiles.
*   **Routing/Travel Calculation:** OpenRouteService API or Mapbox Directions API. *Decision:* We will start with a mock calculation or a free routing API for MVP to demonstrate the transit suggestions (Taxi, Train, Walk) before needing a paid API key.
*   **State Management:** React Context + `useReducer` or Zustand. *Decision:* Zustand is lightweight and perfect for managing the global itinerary state without boilerplate.

## 2. Design Aesthetics & UI System
*   **Theme:** "Wanderlust Modern" – A clean, light-mode interface with plenty of whitespace, rounded corners (glassmorphism accents over the map), and a vibrant accent color (e.g., a dynamic coral or ocean blue) for interactive elements.
*   **Typography:** 'Inter' or 'Outfit' (Google Fonts) for a sleek, highly legible, premium feel.
*   **Micro-animations:** 
    *   Smooth expansion/collapse of daily itineraries.
    *   Hover effects on timeline items that highlight the corresponding map pin.
    *   Map fly-to animations when selecting a location.

## 3. Architecture & Layout
*   **Main App Shell:** Full viewport height (`100vh`). No scrolling on the body.
*   **Sidebar (Left/Right):** Fixed width (e.g., `400px`), internally scrollable. Contains:
    *   Trip Header (Title, Dates).
    *   Day Tabs/Selector.
    *   Timeline View of Events + Travel Time segments.
*   **Map Area:** Takes up the remaining space `calc(100vw - 400px)`.
*   **Modals/Drawers:** Used for the "Add New Event" form to keep the main interface clean.

## 4. Implementation Phases

### Phase 1: Foundation & Project Setup
*   Initialize Vite React project.
*   Set up global CSS (typography, CSS variables for theme).
*   Build the basic layout structure (Sidebar + Map placeholders).

### Phase 2: Map Integration
*   Integrate Leaflet map into the main view.
*   Implement custom map markers.

### Phase 3: State & Data Models
*   Define the data structure for `Trip`, `Day`, and `Event`.
*   Setup Zustand store.
*   Create the UI for the Timeline in the sidebar.

### Phase 4: Interactivity & Forms
*   Build the "Add Event" form with a location picker (geocoding).
*   Link sidebar items to map pins (hover/click synchronization).

### Phase 5: Routing & Polish
*   Implement the travel calculation between consecutive points.
*   Refine animations, CSS transitions, and ensure the "premium feel" is achieved.
