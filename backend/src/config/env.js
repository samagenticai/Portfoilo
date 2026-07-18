import { isCloudinaryConfigured } from './cloudinary.js'

const REQUIRED = ['MONGO_URI', 'JWT_SECRET']

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim())

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  const uri = process.env.MONGO_URI.trim()
  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    throw new Error('MONGO_URI must be a valid MongoDB Atlas connection string')
  }

  if (process.env.NODE_ENV === 'production') {
    const hasFrontendOrigin =
      process.env.CLIENT_URL?.trim() ||
      process.env.FRONTEND_URL?.trim() ||
      process.env.CORS_ORIGIN?.trim() ||
      process.env.ALLOWED_ORIGINS?.trim() ||
      process.env.VERCEL_URL?.trim()

    if (!hasFrontendOrigin) {
      console.warn(
        'No frontend origin env set (CLIENT_URL, FRONTEND_URL, CORS_ORIGIN, ALLOWED_ORIGINS) — relying on built-in + VERCEL_* CORS defaults',
      )
    }
  }

  if (process.env.NODE_ENV === 'production' && !isCloudinaryConfigured()) {
    console.warn(
      'Cloudinary env vars are missing — image and resume uploads will fail until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.',
    )
  }
}
