export function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max)
}

export function round(value, precision = 3) {
  return Number(Number(value).toFixed(precision))
}

export function adjust(value, fromMin, fromMax, toMin, toMax) {
  return round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin))
}

export function pickWeighted(entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0)
  let roll = Math.random() * total
  for (const entry of entries) {
    roll -= entry.weight
    if (roll <= 0) return entry
  }
  return entries[entries.length - 1]
}
