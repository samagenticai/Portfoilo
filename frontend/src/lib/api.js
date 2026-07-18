const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

const TOKEN_KEY = 'portfolio_admin_token'
const REMEMBER_KEY = 'portfolio_admin_remember'

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

export function persistToken(token, rememberMe) {
  clearToken()
  if (!token) return
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(REMEMBER_KEY, '1')
  } else {
    sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.removeItem(REMEMBER_KEY)
  }
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REMEMBER_KEY)
}

export async function api(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  }

  const token = getStoredToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: 'include',
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text || 'Unexpected response' }
  }

  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export function resolveAssetUrl(path) {
  if (!path) return ''
  // Cloudinary and other absolute URLs are stored as-is in MongoDB
  if (/^https?:\/\//i.test(path)) return path
  return buildUrl(path)
}
