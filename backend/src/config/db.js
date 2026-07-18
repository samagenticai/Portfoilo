import mongoose from 'mongoose'

const globalCache = globalThis

if (!globalCache._mongooseCache) {
  globalCache._mongooseCache = { conn: null, promise: null, handlersRegistered: false }
}

function getUri() {
  const uri = process.env.MONGO_URI?.trim()
  if (!uri) {
    throw new Error(
      'MONGO_URI is not configured. Add MONGO_URI=your_mongodb_atlas_connection_string to backend/.env',
    )
  }

  if (/^mongodb(\+srv)?:\/\//i.test(uri)) return uri

  throw new Error('MONGO_URI must be a valid MongoDB connection string (mongodb:// or mongodb+srv://)')
}

function registerConnectionHandlers() {
  const cache = globalCache._mongooseCache
  if (cache.handlersRegistered) return
  cache.handlersRegistered = true

  const conn = mongoose.connection

  conn.on('disconnected', () => {
    console.warn('⚠️ MongoDB Atlas disconnected — reconnecting on next request')
    cache.conn = null
    cache.promise = null
  })

  conn.on('error', (err) => {
    console.error('❌ MongoDB Atlas connection error:', err.message)
    cache.conn = null
    cache.promise = null
  })
}

async function connectWithRetry(uri, options, attempts = 5) {
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      registerConnectionHandlers()
      await mongoose.connect(uri, options)
      await mongoose.connection.db.admin().command({ ping: 1 })
      return mongoose.connection
    } catch (err) {
      lastError = err
      console.error(`MongoDB Atlas connection attempt ${attempt}/${attempts} failed:`, err.message)
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      }
    }
  }

  throw lastError
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

export function getDbStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  return {
    connected: isDbConnected(),
    readyState: mongoose.connection.readyState,
    state: states[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  }
}

export async function connectDB() {
  const cache = globalCache._mongooseCache

  if (cache.conn && isDbConnected()) return true

  if (cache.conn && !isDbConnected()) {
    cache.conn = null
    cache.promise = null
  }

  if (!cache.promise) {
    const uri = getUri()
    mongoose.set('strictQuery', true)

    const options = {
      maxPoolSize: Number(process.env.MONGO_POOL_SIZE || 10),
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 1),
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT || 10000),
      socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT || 45000),
      retryWrites: true,
      autoIndex: process.env.NODE_ENV !== 'production',
    }

    cache.promise = connectWithRetry(uri, options)
      .then((conn) => {
        cache.conn = conn
        return true
      })
      .catch((err) => {
        cache.conn = null
        cache.promise = null
        console.error('❌ MongoDB Atlas connection failed:', err.message)
        return false
      })
  }

  return cache.promise
}

export async function disconnectDB() {
  const cache = globalCache._mongooseCache
  if (cache.conn || isDbConnected()) {
    await mongoose.disconnect()
    cache.conn = null
    cache.promise = null
  }
}
