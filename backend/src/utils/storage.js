import { createHash } from 'crypto'
import cloudinary, {
  assertCloudinaryConfigured,
  cloudinaryFolder,
  deleteCloudinaryAsset,
  fetchRawPdfBufferFromCloudinary,
} from '../config/cloudinary.js'

function sanitizeFilename(name) {
  return String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80)
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

export function validatePdfUploadFile(file) {
  const buffer = file?.buffer
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('Invalid PDF file: upload buffer is missing')
  }
  if (file.mimetype !== 'application/pdf') {
    throw new Error('Only PDF files are allowed')
  }
  if (!String(file.originalname || '').toLowerCase().endsWith('.pdf')) {
    throw new Error('Only PDF files are allowed')
  }
  if (buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
    throw new Error('Invalid PDF file: file is not a valid PDF document')
  }
  return buffer
}

async function verifyUploadedPdfMatchesOriginal(uploadResult, originalBuffer) {
  const publicId = uploadResult?.public_id
  if (!publicId) throw new Error('Cloudinary upload did not return a public ID')

  const secureUrl = uploadResult?.secure_url
  if (!secureUrl) throw new Error('Cloudinary upload did not return a secure URL')

  const downloaded = await fetchRawPdfBufferFromCloudinary(secureUrl, publicId)
  if (sha256(downloaded) !== sha256(originalBuffer)) {
    throw new Error('PDF upload verification failed: stored file does not match the original upload')
  }
}

/** secure_url from multer-storage-cloudinary (stored on req.file.path). */
export function getCloudinarySecureUrl(file) {
  if (!file) return null
  return file.path || file.secure_url || null
}

export function getCloudinarySecureUrls(files) {
  return (Array.isArray(files) ? files : [])
    .map(getCloudinarySecureUrl)
    .filter(Boolean)
}

export async function uploadPdfToCloudinary(file, folder = 'resume') {
  assertCloudinaryConfigured()

  const buffer = validatePdfUploadFile(file)
  const folderPath = cloudinaryFolder(folder)
  const baseName = sanitizeFilename(file.originalname).replace(/\.pdf$/i, '') || 'resume'
  const publicId = `${Date.now()}-${Math.round(Math.random() * 1e6)}-${baseName}`

  // Upload the PDF bytes as-is (raw). Never set `format` — that applies an incoming
  // transformation and corrupts binary PDF data.
  const result = await cloudinary.uploader.upload(
    `data:application/pdf;base64,${buffer.toString('base64')}`,
    {
      folder: folderPath,
      resource_type: 'raw',
      type: 'upload',
      public_id: publicId,
      access_mode: 'public',
      overwrite: true,
    },
  )

  const secureUrl = result?.secure_url
  if (!secureUrl || !secureUrl.includes('/raw/upload/')) {
    throw new Error('Cloudinary did not return a valid raw PDF URL')
  }

  await verifyUploadedPdfMatchesOriginal(result, buffer)

  return { secureUrl, publicId: result.public_id }
}

export async function deleteStoredFile(urlOrPath) {
  if (!urlOrPath) return

  if (String(urlOrPath).includes('cloudinary.com')) {
    const resourceType = String(urlOrPath).includes('/raw/upload/') ? 'raw' : 'image'
    await deleteCloudinaryAsset(urlOrPath, resourceType)
  }
}
