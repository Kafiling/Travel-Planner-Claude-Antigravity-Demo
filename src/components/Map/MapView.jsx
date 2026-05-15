import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useTripStore } from '../../store/useTripStore'
import { getEventColor, getEventEmoji } from '../../utils/eventUtils'
import styles from './MapView.module.css'

function createCustomIcon(type, isActive, isHovered) {
  const color = getEventColor(type)
  const emoji = getEventEmoji(type)
  const size = isActive ? 44 : isHovered ? 40 : 36
  const border = isActive ? '3px solid white' : '2px solid white'
  const boxShadow = isActive
    ? `0 4px 20px ${color}80, 0 2px 8px rgba(0,0,0,0.3)`
    : `0 2px 8px rgba(0,0,0,0.2)`

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: ${border};
        box-shadow: ${boxShadow};
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: ${size * 0.42}px; line-height: 1;">
          ${emoji}
        </span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

function FlyToEvent({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, Math.max(map.getZoom(), 14), { duration: 1.2 })
    }
  }, [coords, map])
  return null
}

function BoundsController({ eventKey, events }) {
  const map = useMap()
  useEffect(() => {
    if (events.length === 0) return
    const bounds = L.latLngBounds(events.map((e) => e.coords))
    map.fitBounds(bounds, { padding: [60, 60] })
  }, [eventKey]) // eslint-disable-line
  return null
}

// Fixes gray tile areas when switching days
function MapResizer({ activeDayId }) {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [activeDayId, map])
  return null
}

export default function MapView() {
  // Reactive selector: re-renders whenever activeDayId or trip.days changes
  const activeDay = useTripStore((s) =>
    s.trip.days.find((d) => d.id === s.activeDayId) ?? s.trip.days[0]
  )
  const activeDayId = useTripStore((s) => s.activeDayId)
  const activeEventId = useTripStore((s) => s.activeEventId)
  const hoveredEventId = useTripStore((s) => s.hoveredEventId)
  const setActiveEvent = useTripStore((s) => s.setActiveEvent)

  const events = activeDay?.events ?? []
  const activeEvent = events.find((e) => e.id === activeEventId)
  const routeCoords = events.map((e) => e.coords)
  const eventKey = events.map((e) => e.id).join(',')

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[35.6762, 139.6503]}
        zoom={12}
        zoomControl={false}
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapResizer activeDayId={activeDayId} />
        <BoundsController eventKey={eventKey} events={events} />
        {activeEvent && <FlyToEvent coords={activeEvent.coords} />}

        {routeCoords.length > 1 && (
          <Polyline
            key={eventKey}
            positions={routeCoords}
            pathOptions={{
              color: '#4F8EF7',
              weight: 3,
              opacity: 0.55,
              dashArray: '8 6',
            }}
          />
        )}

        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.coords}
            icon={createCustomIcon(
              event.type,
              activeEventId === event.id,
              hoveredEventId === event.id
            )}
            eventHandlers={{ click: () => setActiveEvent(event.id) }}
            zIndexOffset={activeEventId === event.id ? 1000 : 0}
          >
            <Popup>
              <div className={styles.popup}>
                <span className={styles.popupTime}>{event.time}</span>
                <span className={styles.popupTitle}>{event.title}</span>
                <span className={styles.popupLoc}>{event.location}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
