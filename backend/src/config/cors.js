function parseOrigins() {
  const origins = new Set()

  if (process.env.CLIENT_URL?.trim()) {
    origins.add(process.env.CLIENT_URL.trim().replace(/\/$/, ''))
  }

  if (process.env.VERCEL_URL?.trim()) {
    origins.add(`https://${process.env.VERCEL_URL.trim()}`)
  }

  if (process.env.VERCEL_BRANCH_URL?.trim()) {
    origins.add(`https://${process.env.VERCEL_BRANCH_URL.trim()}`)
  }

  if (process.env.ALLOWED_ORIGINS?.trim()) {
    process.env.ALLOWED_ORIGINS.split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .forEach((o) => origins.add(o))
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:5173')
    origins.add('http://127.0.0.1:5173')
  }

  return [...origins]
}

export function createCorsOptions() {
  const allowedOrigins = parseOrigins()

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      const normalized = origin.replace(/\/$/, '')
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true)
      }
      return callback(new Error(`Origin not allowed by CORS: ${origin}`))
    },
    credentials: true,
  }
}
