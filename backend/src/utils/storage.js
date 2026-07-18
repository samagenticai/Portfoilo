import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads')

export function useRemoteStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export function useMemoryUploads() {
  return useRemoteStorage() || Boolean(process.env.VERCEL)
}

function sanitizeFilename(name) {
  return String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 120)
}

function buildFilename(originalName) {
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}-${sanitizeFilename(originalName)}`
}

function ensureLocalDir(folder) {
  const dest = path.join(UPLOADS_ROOT, folder)
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  return dest
}

async function uploadToBlob(buffer, folder, filename, contentType) {
  const { put } = await import('@vercel/blob')
  const pathname = `${folder}/${filename}`
  const blob = await put(pathname, buffer, {
    access: 'public',
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
  return blob.url
}

export async function saveUploadedFile(file, folder) {
  if (!file) throw new Error('No file provided')

  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('File uploads require BLOB_READ_WRITE_TOKEN on Vercel. Create a Blob store in your Vercel project.')
  }

  const filename = buildFilename(file.originalname)
  const contentType = file.mimetype || 'application/octet-stream'

  if (useRemoteStorage()) {
    const buffer = file.buffer || (file.path ? fs.readFileSync(file.path) : null)
    if (!buffer) throw new Error('Upload buffer missing')
    return uploadToBlob(buffer, folder, filename, contentType)
  }

  if (file.path && file.filename) {
    return `/uploads/${folder}/${file.filename}`
  }

  const buffer = file.buffer
  if (!buffer) throw new Error('Upload buffer missing')

  const dest = ensureLocalDir(folder)
  fs.writeFileSync(path.join(dest, filename), buffer)
  return `/uploads/${folder}/${filename}`
}

export async function saveUploadedFiles(files, folder) {
  const list = Array.isArray(files) ? files : [files]
  return Promise.all(list.filter(Boolean).map((file) => saveUploadedFile(file, folder)))
}

export async function deleteStoredFile(urlOrPath) {
  if (!urlOrPath) return

  if (/^https?:\/\//i.test(urlOrPath)) {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { del } = await import('@vercel/blob')
        await del(urlOrPath, { token: process.env.BLOB_READ_WRITE_TOKEN })
      } catch (err) {
        console.warn('Failed to delete remote file:', err.message)
      }
    }
    return
  }

  const relative = urlOrPath.replace(/^\/uploads\//, '')
  const full = path.join(UPLOADS_ROOT, relative)
  if (fs.existsSync(full)) fs.unlinkSync(full)
}
