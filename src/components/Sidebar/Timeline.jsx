import { useEffect, useRef } from 'react'
import { useTripStore } from '../../store/useTripStore'
import { getEventColor, getEventEmoji, getEventLabel } from '../../utils/eventUtils'
import { getTravelSegment } from '../../utils/travelUtils'
import styles from './Timeline.module.css'

function TravelSegment({ from, to }) {
  const segment = getTravelSegment(from, to)
  return (
    <div className={styles.segment}>
      <div className={styles.segmentLine} />
      <div className={styles.segmentInfo}>
        <span className={styles.segmentIcon}>{segment.icon}</span>
        <span className={styles.segmentText}>{segment.mode} · ~{segment.minutes} min</span>
      </div>
      <div className={styles.segmentLine} />
    </div>
  )
}

function EventCard({ event, isActive, isHovered, cardRef }) {
  const setActiveEvent = useTripStore((s) => s.setActiveEvent)
  const setHoveredEvent = useTripStore((s) => s.setHoveredEvent)
  const removeEvent = useTripStore((s) => s.removeEvent)
  const color = getEventColor(event.type)

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isActive ? styles.active : ''} ${isHovered ? styles.hovered : ''}`}
      style={{ '--event-color': color }}
      onClick={() => setActiveEvent(isActive ? null : event.id)}
      onMouseEnter={() => setHoveredEvent(event.id)}
      onMouseLeave={() => setHoveredEvent(null)}
    >
      <div className={styles.cardAccent} />
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.cardEmoji}>{getEventEmoji(event.type)}</span>
          <div className={styles.cardMeta}>
            <span className={styles.cardType}>{getEventLabel(event.type)}</span>
            <span className={styles.cardTime}>{event.time}</span>
          </div>
          <button
            className={styles.removeBtn}
            onClick={(e) => { e.stopPropagation(); removeEvent(event.id) }}
            title="Remove event"
          >
            ×
          </button>
        </div>
        <p className={styles.cardTitle}>{event.title}</p>
        <p className={styles.cardLocation}>📍 {event.location}</p>
      </div>
    </div>
  )
}

export default function Timeline() {
  // Reactive selector: re-renders on activeDayId change, event add/remove
  const activeDay = useTripStore((s) =>
    s.trip.days.find((d) => d.id === s.activeDayId) ?? s.trip.days[0]
  )
  const activeEventId = useTripStore((s) => s.activeEventId)
  const hoveredEventId = useTripStore((s) => s.hoveredEventId)

  const events = activeDay?.events ?? []
  const cardRefs = useRef({})

  // Auto-scroll the sidebar to whichever card is activated (e.g. via map click)
  useEffect(() => {
    if (activeEventId && cardRefs.current[activeEventId]) {
      cardRefs.current[activeEventId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [activeEventId])

  if (events.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🗺️</span>
        <p>No events yet for this day.</p>
        <p>Click <strong>Add Event</strong> to get started.</p>
      </div>
    )
  }

  return (
    <div className={styles.timeline}>
      {events.map((event, i) => (
        <div key={event.id}>
          <EventCard
            event={event}
            isActive={activeEventId === event.id}
            isHovered={hoveredEventId === event.id}
            cardRef={(el) => { cardRefs.current[event.id] = el }}
          />
          {i < events.length - 1 && (
            <TravelSegment from={event} to={events[i + 1]} />
          )}
        </div>
      ))}
    </div>
  )
}
