import { useTripStore } from '../../store/useTripStore'
import styles from './DayTabs.module.css'

export default function DayTabs() {
  const days = useTripStore((s) => s.trip.days)
  const activeDayId = useTripStore((s) => s.activeDayId)
  const setActiveDay = useTripStore((s) => s.setActiveDay)
  const addDay = useTripStore((s) => s.addDay)

  const formatShort = (d) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {days.map((day) => (
          <button
            key={day.id}
            className={`${styles.tab} ${activeDayId === day.id ? styles.active : ''}`}
            onClick={() => setActiveDay(day.id)}
          >
            <span className={styles.dayLabel}>{day.label}</span>
            <span className={styles.dayDate}>{formatShort(day.date)}</span>
          </button>
        ))}
        <button className={styles.addDayBtn} onClick={addDay} title="Add day">
          +
        </button>
      </div>
    </div>
  )
}
