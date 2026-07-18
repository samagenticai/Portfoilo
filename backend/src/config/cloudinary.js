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

function authOptions() {
  assertCloudinaryConfigured()
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
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

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))]
}

function isPdfBuffer(buffer) {
  return (
    Buffer.isBuffer(buffer) &&
    buffer.length >= 4 &&
    buffer.subarray(0, 4).toString('ascii') === '%PDF'
  )
}

function buildPrivateDownloadUrl(publicId, format, resourceType) {
  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType,
    ...authOptions(),
  })
}

async function fetchPdfFromPrivateDownload(publicId, format, resourceType) {
  const downloadUrl = buildPrivateDownloadUrl(publicId, format, resourceType)
  const response = await fetch(downloadUrl, { redirect: 'manual' })

  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Cloudinary download redirected (HTTP ${response.status})`)
  }
  if (!response.ok) {
    throw new Error(`Cloudinary download failed with HTTP ${response.status}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (!isPdfBuffer(buffer)) {
    throw new Error('Cloudinary download did not return a valid PDF')
  }

  return buffer
}

async function resolvePdfResource({ storedUrl = '', publicId = '', resourceType = '' }) {
  assertCloudinaryConfigured()

  const baseId = extractPublicIdFromUrl(storedUrl)
  const candidates = uniqueValues([publicId, baseId, baseId ? `${baseId}.pdf` : ''])
  const resourceTypes = uniqueValues([resourceType, 'raw', 'image'])

  for (const type of resourceTypes) {
    for (const candidate of candidates) {
      try {
        const meta = await cloudinary.api.resource(candidate, { resource_type: type })
        if (meta?.public_id) {
          return {
            publicId: meta.public_id,
            format: meta.format || 'pdf',
            resourceType: meta.resource_type || type,
          }
        }
      } catch {
        // try next candidate
      }
    }
  }

  const list = await cloudinary.api.resources({
    resource_type: 'raw',
    type: 'upload',
    prefix: cloudinaryFolder('resume'),
    max_results: 10,
  })

  const latest = (list?.resources || []).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )[0]

  if (!latest?.public_id) {
    throw new Error('Cloudinary PDF resource not found')
  }

  return {
    publicId: latest.public_id,
    format: latest.format || 'pdf',
    resourceType: latest.resource_type || 'raw',
  }
}

export async function downloadPdfFromCloudinary({
  storedUrl = '',
  publicId = '',
  resourceType = '',
  format = 'pdf',
} = {}) {
  const resolved = await resolvePdfResource({ storedUrl, publicId, resourceType })
  const formats = uniqueValues([format, resolved.format, 'pdf', null])

  let lastError
  for (const candidateFormat of formats) {
    try {
      return await fetchPdfFromPrivateDownload(
        resolved.publicId,
        candidateFormat,
        resolved.resourceType,
      )
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Unable to download PDF from Cloudinary')
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
