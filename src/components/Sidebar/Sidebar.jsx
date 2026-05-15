import { useState, useRef, useEffect } from 'react'
import { useTripStore } from '../../store/useTripStore'
import DayTabs from './DayTabs'
import Timeline from './Timeline'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const trip = useTripStore((s) => s.trip)
  const openAddEventModal = useTripStore((s) => s.openAddEventModal)
  const updateTitle = useTripStore((s) => s.updateTitle)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(trip.title)
  const titleInputRef = useRef(null)

  // Keep draft in sync if title changes externally
  useEffect(() => { setTitleDraft(trip.title) }, [trip.title])

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.select()
  }, [editingTitle])

  const commitTitle = () => {
    const trimmed = titleDraft.trim()
    if (trimmed) updateTitle(trimmed)
    else setTitleDraft(trip.title)
    setEditingTitle(false)
  }

  const startDate = trip.days[0]?.date
  const endDate = trip.days[trip.days.length - 1]?.date
  const formatDate = (d) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.globe}>🌏</div>
          <div className={styles.tripInfo}>
            {editingTitle ? (
              <input
                ref={titleInputRef}
                className={styles.titleInput}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitTitle()
                  if (e.key === 'Escape') { setTitleDraft(trip.title); setEditingTitle(false) }
                }}
              />
            ) : (
              <h1
                className={styles.tripTitle}
                title="Click to edit"
                onClick={() => setEditingTitle(true)}
              >
                {trip.title}
              </h1>
            )}
            <p className={styles.tripDates}>
              {formatDate(startDate)} – {formatDate(endDate)} · {trip.days.length} days
            </p>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      <DayTabs />

      {/* Timeline */}
      <div className={styles.timelineArea}>
        <Timeline />
      </div>

      {/* Footer action */}
      <div className={styles.footer}>
        <button className={styles.addBtn} onClick={openAddEventModal}>
          <span className={styles.addIcon}>+</span>
          Add Event
        </button>
      </div>
    </aside>
  )
}
