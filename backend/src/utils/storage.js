import cloudinary, {
  assertCloudinaryConfigured,
  cloudinaryFolder,
  deleteCloudinaryAsset,
} from '../config/cloudinary.js'

function sanitizeFilename(name) {
  return String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80)
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

  const buffer = file?.buffer
  if (!buffer) throw new Error('Upload buffer missing')

  const folderPath = cloudinaryFolder(folder)
  const publicId = `${folderPath}/${Date.now()}-${Math.round(Math.random() * 1e6)}-${sanitizeFilename(file.originalname)}`

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: publicId,
        format: 'pdf',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}

export async function deleteStoredFile(urlOrPath) {
  if (!urlOrPath) return

  if (String(urlOrPath).includes('cloudinary.com')) {
    const resourceType = String(urlOrPath).includes('/raw/upload/') ? 'raw' : 'image'
    await deleteCloudinaryAsset(urlOrPath, resourceType)
  }
}
