import { useState, useRef, useEffect } from 'react'
import { useTripStore } from '../../store/useTripStore'
import { ALL_EVENT_TYPES, getEventEmoji, getEventLabel, getEventColor } from '../../utils/eventUtils'
import styles from './AddEventModal.module.css'

function useNominatimSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setResults(data.map((r) => ({
          label: r.display_name,
          coords: [parseFloat(r.lat), parseFloat(r.lon)],
        })))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  return { results, loading }
}

export default function AddEventModal() {
  const closeAddEventModal = useTripStore((s) => s.closeAddEventModal)
  const addEvent = useTripStore((s) => s.addEvent)

  const [form, setForm] = useState({
    type: 'activity',
    title: '',
    time: '',
    locationQuery: '',
    location: '',
    coords: null,
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [errors, setErrors] = useState({})
  const { results, loading } = useNominatimSearch(form.locationQuery)

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const pickLocation = (result) => {
    const shortName = result.label.split(',').slice(0, 2).join(',').trim()
    setForm((f) => ({ ...f, locationQuery: shortName, location: shortName, coords: result.coords }))
    setShowSuggestions(false)
    setErrors((e) => ({ ...e, location: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.time) errs.time = 'Please enter a time.'
    if (!form.coords) errs.location = 'Select a location from the suggestions below.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    addEvent({
      type: form.type,
      title: form.title || form.location,
      time: form.time,
      location: form.location,
      coords: form.coords,
    })
    closeAddEventModal()
  }

  const showList = showSuggestions && results.length > 0

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeAddEventModal()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add Event</h2>
          <button className={styles.closeBtn} onClick={closeAddEventModal}>×</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Type */}
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <div className={styles.typePicker}>
              {ALL_EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeBtn} ${form.type === type ? styles.typeActive : ''}`}
                  style={{ '--type-color': getEventColor(type) }}
                  onClick={() => set('type', type)}
                >
                  <span>{getEventEmoji(type)}</span>
                  <span>{getEventLabel(type)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="evt-title">
              Title <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="evt-title"
              className={styles.input}
              type="text"
              placeholder="e.g. Lunch at Nobu"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          {/* Time */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="evt-time">Time *</label>
            <input
              id="evt-time"
              className={`${styles.input} ${errors.time ? styles.inputError : ''}`}
              type="time"
              value={form.time}
              onChange={(e) => { set('time', e.target.value); setErrors((x) => ({ ...x, time: null })) }}
            />
            {errors.time && <p className={styles.errorMsg}>{errors.time}</p>}
          </div>

          {/* Location — suggestions render inline, never clipped */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="evt-location">Location *</label>
            <div className={styles.locationInputRow}>
              <input
                id="evt-location"
                className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                type="text"
                placeholder="Search for a place…"
                value={form.locationQuery}
                autoComplete="off"
                onChange={(e) => {
                  set('locationQuery', e.target.value)
                  set('coords', null)
                  setShowSuggestions(true)
                  setErrors((x) => ({ ...x, location: null }))
                }}
                onFocus={() => results.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {loading && <span className={styles.loadingDot} />}
            </div>

            {/* Inline suggestions list — normal flow, not absolute positioned */}
            {showList && (
              <ul className={styles.suggestions}>
                {results.map((r, i) => (
                  <li key={i} className={styles.suggestion} onMouseDown={() => pickLocation(r)}>
                    <span className={styles.suggestionPin}>📍</span>
                    <span className={styles.suggestionLabel}>{r.label}</span>
                  </li>
                ))}
              </ul>
            )}

            {form.coords
              ? <p className={styles.coordsConfirm}>✓ Location confirmed</p>
              : form.locationQuery.length >= 3 && !loading && !showList
                ? <p className={styles.hintMsg}>Pick a result from the list above to pin it on the map.</p>
                : null
            }
            {errors.location && <p className={styles.errorMsg}>{errors.location}</p>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Add to Itinerary
          </button>
        </form>
      </div>
    </div>
  )
}
