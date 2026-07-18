/** Origins always permitted (local dev + primary Vercel deployment). */
const BUILTIN_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://portfoilo-nine-lyart.vercel.app',
]

function normalizeOrigin(value) {
  if (!value?.trim()) return null

  let origin = value.trim().replace(/\/$/, '')

  if (!/^https?:\/\//i.test(origin)) {
    origin = `https://${origin}`
  }

  return origin
}

function addOrigin(origins, value) {
  const normalized = normalizeOrigin(value)
  if (normalized) origins.add(normalized)
}

function addOriginsFromList(origins, value) {
  if (!value?.trim()) return

  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => addOrigin(origins, part))
}

export function parseAllowedOrigins() {
  const origins = new Set()

  BUILTIN_ORIGINS.forEach((origin) => origins.add(origin))

  addOrigin(origins, process.env.CLIENT_URL)
  addOrigin(origins, process.env.FRONTEND_URL)

  addOriginsFromList(origins, process.env.CORS_ORIGIN)
  addOriginsFromList(origins, process.env.ALLOWED_ORIGINS)

  if (process.env.VERCEL_URL?.trim()) {
    addOrigin(origins, process.env.VERCEL_URL)
  }

  if (process.env.VERCEL_BRANCH_URL?.trim()) {
    addOrigin(origins, process.env.VERCEL_BRANCH_URL)
  }

  return [...origins]
}

export function createCorsOptions() {
  const allowedOrigins = parseAllowedOrigins()
  const allowedSet = new Set(allowedOrigins)

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true)

      const normalized = origin.replace(/\/$/, '')
      if (allowedSet.has(normalized)) {
        return callback(null, true)
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`))
    },
    credentials: true,
  }
}
