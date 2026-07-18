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

  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL?.trim()) {
    console.warn('CLIENT_URL is not set — CORS may block browser requests from your frontend domain')
  }

  if (process.env.NODE_ENV === 'production' && !process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL) {
    console.warn(
      'BLOB_READ_WRITE_TOKEN is not set — file uploads will not persist on Vercel. Create a Blob store in the Vercel dashboard.',
    )
  }
}
