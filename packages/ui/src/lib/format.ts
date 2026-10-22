// How figures read across the panels: always in English, with tabular
// numbers from the stylesheet.

const number = new Intl.NumberFormat("en")

export function formatNumber(n: number): string {
  return number.format(n)
}

/** Splits a byte count into a value and its unit, for figures. */
export function bytesParts(n: number): [string, string] {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return [
    n >= 10 || i === 0 ? Math.round(n).toString() : n.toFixed(1),
    units[i]!,
  ]
}

export function formatBytes(n: number): string {
  return bytesParts(n).join(" ")
}

/** "2h ago", from Unix milliseconds. */
export function timeAgo(ms: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ms) / 1000))
  if (s < 60) return "just now"
  let v = s / 60
  for (const [size, unit] of [
    [60, "m"],
    [24, "h"],
    [30, "d"],
    [12, "mo"],
  ] as const) {
    if (v < size) return `${Math.floor(v)}${unit} ago`
    v /= size
  }
  return `${Math.floor(v)}y ago`
}

/** "19:42:03", local time, from Unix milliseconds. */
export function clock(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-GB", { hour12: false })
}

/** "2026-10-22", from Unix milliseconds. */
export function day(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}
