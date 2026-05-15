import { create } from 'zustand'

const EVENT_TYPES = ['flight', 'food', 'shopping', 'activity', 'accommodation']

const SAMPLE_TRIP = {
  id: 'trip-1',
  title: 'Tokyo Adventure',
  days: [
    {
      id: 'day-1',
      label: 'Day 1',
      date: '2026-06-01',
      events: [
        {
          id: 'evt-1',
          type: 'flight',
          title: 'Arrive at Haneda Airport',
          time: '09:30',
          location: 'Haneda Airport',
          coords: [35.5494, 139.7798],
        },
        {
          id: 'evt-2',
          type: 'accommodation',
          title: 'Check-in: Park Hyatt Tokyo',
          time: '15:00',
          location: 'Park Hyatt Tokyo, Shinjuku',
          coords: [35.6858, 139.6921],
        },
        {
          id: 'evt-3',
          type: 'food',
          title: 'Dinner at Ichiran Ramen',
          time: '19:00',
          location: 'Ichiran Ramen Shinjuku',
          coords: [35.6896, 139.7006],
        },
      ],
    },
    {
      id: 'day-2',
      label: 'Day 2',
      date: '2026-06-02',
      events: [
        {
          id: 'evt-4',
          type: 'activity',
          title: 'Senso-ji Temple',
          time: '09:00',
          location: 'Senso-ji, Asakusa',
          coords: [35.7148, 139.7967],
        },
        {
          id: 'evt-5',
          type: 'shopping',
          title: 'Akihabara Electronics',
          time: '13:00',
          location: 'Akihabara, Tokyo',
          coords: [35.7022, 139.7741],
        },
        {
          id: 'evt-6',
          type: 'food',
          title: 'Sushi at Tsukiji Market',
          time: '17:30',
          location: 'Tsukiji Outer Market',
          coords: [35.6654, 139.7707],
        },
      ],
    },
  ],
}

export const useTripStore = create((set, get) => ({
  trip: SAMPLE_TRIP,
  activeDayId: SAMPLE_TRIP.days[0].id,
  activeEventId: null,
  hoveredEventId: null,
  isAddEventModalOpen: false,

  setActiveDay: (dayId) => set({ activeDayId: dayId, activeEventId: null }),

  setActiveEvent: (eventId) => set({ activeEventId: eventId }),

  setHoveredEvent: (eventId) => set({ hoveredEventId: eventId }),

  openAddEventModal: () => set({ isAddEventModalOpen: true }),
  closeAddEventModal: () => set({ isAddEventModalOpen: false }),

  addEvent: (event) =>
    set((state) => ({
      trip: {
        ...state.trip,
        days: state.trip.days.map((day) =>
          day.id === state.activeDayId
            ? { ...day, events: [...day.events, { ...event, id: `evt-${Date.now()}` }] }
            : day
        ),
      },
    })),

  addDay: () =>
    set((state) => {
      const days = state.trip.days
      const lastDate = days[days.length - 1]?.date
      const nextDate = lastDate
        ? new Date(new Date(lastDate).getTime() + 86400000).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
      const newDay = {
        id: `day-${Date.now()}`,
        label: `Day ${days.length + 1}`,
        date: nextDate,
        events: [],
      }
      return {
        trip: { ...state.trip, days: [...days, newDay] },
        activeDayId: newDay.id,
      }
    }),

  removeEvent: (eventId) =>
    set((state) => ({
      trip: {
        ...state.trip,
        days: state.trip.days.map((day) => ({
          ...day,
          events: day.events.filter((e) => e.id !== eventId),
        })),
      },
      activeEventId: state.activeEventId === eventId ? null : state.activeEventId,
    })),

  updateTitle: (title) =>
    set((state) => ({ trip: { ...state.trip, title } })),
}))

export { EVENT_TYPES }
