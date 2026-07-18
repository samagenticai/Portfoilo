import { fetchRawPdfBufferFromCloudinary } from '../config/cloudinary.js'
import { toPublicResume } from './cmsMapper.js'

function sanitizeDownloadFileName(name) {
  const base = String(name || 'resume.pdf').trim()
  const withExt = base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`
  return withExt.replace(/[^\w.\- ()[\]]+/g, '_').slice(0, 120) || 'resume.pdf'
}

export function buildContentDisposition(fileName, { inline = false } = {}) {
  const safe = sanitizeDownloadFileName(fileName)
  const encoded = encodeURIComponent(safe)
  const disposition = inline ? 'inline' : 'attachment'
  return `${disposition}; filename="${safe}"; filename*=UTF-8''${encoded}`
}

export async function streamResumePdf(resumeDoc, res, { inline = false } = {}) {
  const publicResume = toPublicResume(resumeDoc)
  if (!publicResume?.url) {
    res.status(404).json({ message: 'Resume not found' })
    return false
  }

  try {
    const buffer = await fetchRawPdfBufferFromCloudinary(publicResume.url)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', buildContentDisposition(publicResume.fileName, { inline }))
    res.setHeader('Content-Length', String(buffer.length))
    res.setHeader('Cache-Control', 'private, no-cache')
    res.send(buffer)
    return true
  } catch (err) {
    console.error('Resume fetch failed:', err.message, publicResume.url)
    res.status(502).json({ message: 'Failed to retrieve resume file' })
    return false
  }
}
