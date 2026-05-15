function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getTravelSegment(fromEvent, toEvent) {
  const km = haversineKm(fromEvent.coords, toEvent.coords)

  if (km < 0.8) {
    return { mode: 'Walk', icon: '🚶', minutes: Math.round((km / 5) * 60) }
  } else if (km < 5) {
    return { mode: 'Transit', icon: '🚇', minutes: Math.round((km / 20) * 60 + 5) }
  } else {
    return { mode: 'Taxi', icon: '🚕', minutes: Math.round((km / 30) * 60 + 5) }
  }
}
