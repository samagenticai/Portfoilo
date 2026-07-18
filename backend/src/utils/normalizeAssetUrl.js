/** Accept only absolute remote URLs (Cloudinary, etc.). Legacy /uploads paths are rejected. */
export function normalizePublicAssetUrl(value) {
  const url = String(value || '').trim()
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return ''
}

export function isPublicAssetUrl(value) {
  return Boolean(normalizePublicAssetUrl(value))
}
