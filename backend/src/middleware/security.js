import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.API_RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
})

function sanitizeValue(value) {
  if (value == null) return value

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (typeof value === 'object') {
    const clean = {}
    for (const [key, nested] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue
      clean[key] = sanitizeValue(nested)
    }
    return clean
  }

  return value
}

export function sanitizeRequestBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body)
  }
  next()
}

export function applySecurityMiddleware(app) {
  app.disable('x-powered-by')

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )

  app.use(sanitizeRequestBody)
  app.use('/api', apiLimiter)
}

export function registerProcessHandlers() {
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason)
  })

  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err)
  })
}
