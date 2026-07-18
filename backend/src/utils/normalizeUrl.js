/** Normalize external URLs for portfolio links (live demo, GitHub, etc.) */
export function normalizeExternalUrl(raw) {
  if (raw == null) return ''
  const value = String(raw).trim()
  if (!value || value === '#') return ''

  if (/^https?:\/\//i.test(value)) return value

  // Protocol-relative URLs
  if (value.startsWith('//')) return `https:${value}`

  return `https://${value.replace(/^\/+/, '')}`
}

export function resolveLiveUrl(doc) {
  return doc?.liveUrl || doc?.liveDemoUrl || ''
}
