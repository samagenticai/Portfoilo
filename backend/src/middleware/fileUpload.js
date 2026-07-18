import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary, { assertCloudinaryConfigured, cloudinaryFolder } from '../config/cloudinary.js'

function sanitizeFilename(name) {
  return String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80)
}

function buildPublicId(originalName) {
  return `${Date.now()}-${Math.round(Math.random() * 1e6)}-${sanitizeFilename(originalName)}`
}

function createImageUpload({ folder, allowedMimes, formats, maxSize = 5 * 1024 * 1024, maxFiles = 1 }) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      assertCloudinaryConfigured()
      return {
        folder: cloudinaryFolder(folder),
        public_id: buildPublicId(file.originalname),
        allowed_formats: formats,
        resource_type: 'image',
      }
    },
  })

  return multer({
    storage,
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

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const IMAGE_FORMATS = ['jpg', 'png', 'webp', 'gif']

export const projectImageUpload = createImageUpload({
  folder: 'projects',
  allowedMimes: IMAGE_MIMES,
  formats: IMAGE_FORMATS,
  maxFiles: 12,
})

export const skillIconUpload = createImageUpload({
  folder: 'skills',
  allowedMimes: [...IMAGE_MIMES, 'image/svg+xml'],
  formats: [...IMAGE_FORMATS, 'svg'],
})

export const profileImageUpload = createImageUpload({
  folder: 'profile',
  allowedMimes: IMAGE_MIMES,
  formats: IMAGE_FORMATS,
})

export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'))
      return
    }
    cb(null, true)
  },
})

/** @deprecated Use projectImageUpload */
export const imageUpload = projectImageUpload
