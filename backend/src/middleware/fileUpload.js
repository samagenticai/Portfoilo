import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { useMemoryUploads, useRemoteStorage } from '../utils/storage.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function createStorage(subdir) {
  if (useMemoryUploads()) {
    return multer.memoryStorage()
  }

  const dest = path.join(UPLOADS_ROOT, subdir)
  ensureDir(dest)
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}-${safe}`)
    },
  })
}

function makeUpload({ subdir, allowedMimes, maxSize = 5 * 1024 * 1024, maxFiles = 1 }) {
  return multer({
    storage: createStorage(subdir),
    limits: { fileSize: maxSize, files: maxFiles },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimes.includes(file.mimetype)) {
        cb(new Error(`Unsupported file type: ${file.mimetype}`))
        return
      }
      cb(null, true)
    },
  })
}

export const imageUpload = makeUpload({
  subdir: 'projects',
  allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFiles: 12,
})

export const skillIconUpload = makeUpload({
  subdir: 'skills',
  allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
})

export const profileImageUpload = makeUpload({
  subdir: 'profile',
  allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
})

export const resumeUpload = makeUpload({
  subdir: 'resume',
  allowedMimes: ['application/pdf'],
  maxSize: 5 * 1024 * 1024,
})

if (!useMemoryUploads()) {
  ensureDir(path.join(UPLOADS_ROOT, 'projects'))
  ensureDir(path.join(UPLOADS_ROOT, 'skills'))
  ensureDir(path.join(UPLOADS_ROOT, 'profile'))
  ensureDir(path.join(UPLOADS_ROOT, 'resume'))
}
