import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB, getDbStatus, isDbConnected } from './config/db.js'
import { validateEnv } from './config/env.js'
import { createCorsOptions } from './config/cors.js'
import { applySecurityMiddleware, registerProcessHandlers } from './middleware/security.js'
import { useRemoteStorage } from './utils/storage.js'
import authRoutes from './routes/auth.js'
import publicProjectRoutes from './routes/publicProjects.js'
import adminProjectRoutes from './routes/adminProjects.js'
import publicCmsRoutes from './routes/publicCms.js'
import contactRoutes from './routes/contact.js'
import adminSkillsRoutes from './routes/adminSkills.js'
import adminProfileRoutes from './routes/adminProfile.js'
import adminResumeRoutes from './routes/adminResume.js'
import adminMessagesRoutes from './routes/adminMessages.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

validateEnv()
registerProcessHandlers()

const app = express()

app.set('trust proxy', 1)

app.use(cors(createCorsOptions()))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(cookieParser())
applySecurityMiddleware(app)

if (!useRemoteStorage() && !process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
}

app.use(async (req, res, next) => {
  const connected = await connectDB()
  if (!connected || !isDbConnected()) {
    return res.status(503).json({
      message: 'Database temporarily unavailable. Please try again shortly.',
      database: getDbStatus(),
    })
  }
  next()
})

app.get('/api/health', (_req, res) => {
  const database = getDbStatus()
  res.status(database.connected ? 200 : 503).json({
    status: database.connected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    storage: useRemoteStorage() ? 'blob' : 'local',
    database,
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', publicProjectRoutes)
app.use('/api/admin/projects', adminProjectRoutes)
app.use('/api', publicCmsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin/skills', adminSkillsRoutes)
app.use('/api/admin/profile', adminProfileRoutes)
app.use('/api/admin/resume', adminResumeRoutes)
app.use('/api/admin/messages', adminMessagesRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)

  if (err?.message?.includes('CORS')) {
    return res.status(403).json({ message: 'Origin not allowed' })
  }

  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' })
  }

  if (err instanceof Error && /Unsupported file type|Only JPG|PDF/i.test(err.message)) {
    return res.status(400).json({ message: err.message })
  }

  const status = err.status || err.statusCode || 500
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error'

  res.status(status).json({ message })
})

export default app
