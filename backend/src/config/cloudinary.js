import { v2 as cloudinary } from 'cloudinary'

const ROOT_FOLDER = 'ahmad-stack-portfolio'

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  )
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) return false

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  })

  return true
}

configureCloudinary()

export default cloudinary

export function cloudinaryFolder(name) {
  return `${ROOT_FOLDER}/${name}`
}

export function assertCloudinaryConfigured() {
  if (!configureCloudinary()) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
    )
  }
}

export function extractPublicIdFromUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return null

  try {
    const afterUpload = url.split('/upload/')[1]
    if (!afterUpload) return null
    const withoutVersion = afterUpload.replace(/^v\d+\//, '')
    const withoutExt = withoutVersion.replace(/\.[a-zA-Z0-9]+$/i, '')
    return decodeURIComponent(withoutExt)
  } catch {
    return null
  }
}

/** Signed URL that retrieves the exact raw PDF bytes (works even when public PDF delivery is restricted). */
export function buildPrivateRawPdfUrl(publicId, format = null, options = {}) {
  assertCloudinaryConfigured()
  if (!publicId) throw new Error('Cloudinary public ID is required')

  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: 'raw',
    ...options,
  })
}

export function buildPrivateRawPdfUrlFromStoredUrl(storedUrl, options = {}) {
  const publicId = extractPublicIdFromUrl(storedUrl)
  if (!publicId) return storedUrl
  return buildPrivateRawPdfUrl(publicId, 'pdf', options)
}

async function resolveRawPdfResource(storedUrl) {
  assertCloudinaryConfigured()

  const baseId = extractPublicIdFromUrl(storedUrl)
  const candidates = []
  if (baseId) candidates.push(baseId)
  if (baseId && storedUrl.split('/').pop()?.endsWith('.pdf')) {
    candidates.push(`${baseId}.pdf`)
  }

  for (const candidate of [...new Set(candidates)]) {
    try {
      const meta = await cloudinary.api.resource(candidate, { resource_type: 'raw' })
      if (meta?.public_id) return meta
    } catch {
      // try next candidate
    }
  }

  throw new Error('Cloudinary raw PDF resource not found')
}

export async function fetchRawPdfBufferFromCloudinary(storedUrl) {
  const meta = await resolveRawPdfResource(storedUrl)
  const format = meta.format || null
  const downloadUrl = buildPrivateRawPdfUrl(meta.public_id, format)

  const response = await fetch(downloadUrl, { redirect: 'follow' })
  if (!response.ok) {
    throw new Error(`Cloudinary download failed with HTTP ${response.status}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length < 4 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
    throw new Error('Cloudinary download did not return a valid PDF')
  }

  return buffer
}

export async function deleteCloudinaryAsset(url, resourceType = 'image') {
  if (!url || !isCloudinaryConfigured()) return

  const publicId = extractPublicIdFromUrl(url)
  if (!publicId) return

  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type: resourceType })
  } catch (err) {
    console.warn('Failed to delete Cloudinary asset:', err.message)
  }
}
