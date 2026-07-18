/** Normalize external URLs for portfolio project links */
export function normalizeExternalUrl(raw) {
  if (raw == null) return ''
  const value = String(raw).trim()
  if (!value || value === '#') return ''

  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`

  return `https://${value.replace(/^\/+/, '')}`
}

export function getProjectLiveUrl(project) {
  return normalizeExternalUrl(project?.liveUrl || project?.liveDemoUrl)
}

export function getProjectGithubUrl(project) {
  return normalizeExternalUrl(project?.githubUrl)
}
