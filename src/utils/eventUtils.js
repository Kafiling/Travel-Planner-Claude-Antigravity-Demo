const EVENT_META = {
  flight:        { color: '#6366f1', emoji: '✈️', label: 'Flight' },
  food:          { color: '#f59e0b', emoji: '🍜', label: 'Food & Dining' },
  shopping:      { color: '#ec4899', emoji: '🛍️', label: 'Shopping' },
  activity:      { color: '#10b981', emoji: '🗺️', label: 'Activity' },
  accommodation: { color: '#8b5cf6', emoji: '🏨', label: 'Accommodation' },
}

export const getEventColor = (type) => EVENT_META[type]?.color ?? '#4F8EF7'
export const getEventEmoji = (type) => EVENT_META[type]?.emoji ?? '📍'
export const getEventLabel = (type) => EVENT_META[type]?.label ?? type
export const ALL_EVENT_TYPES = Object.keys(EVENT_META)
export { EVENT_META }
