import { toPublicResume } from './cmsMapper.js'

function sanitizeDownloadFileName(name) {
  const base = String(name || 'resume.pdf').trim()
  const withExt = base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`
  return withExt.replace(/[^\w.\- ()[\]]+/g, '_').slice(0, 120) || 'resume.pdf'
}

export function buildContentDisposition(fileName) {
  const safe = sanitizeDownloadFileName(fileName)
  const encoded = encodeURIComponent(safe)
  return `attachment; filename="${safe}"; filename*=UTF-8''${encoded}`
}

export async function streamResumePdf(resumeDoc, res) {
  const publicResume = toPublicResume(resumeDoc)
  if (!publicResume?.url) {
    res.status(404).json({ message: 'Resume not found' })
    return false
  }

  const upstream = await fetch(publicResume.url, { redirect: 'follow' })
  if (!upstream.ok) {
    console.error('Resume fetch failed:', upstream.status, publicResume.url)
    res.status(502).json({ message: 'Failed to retrieve resume file' })
    return false
  }

  const contentType = upstream.headers.get('content-type') || ''
  if (contentType.includes('text/html') || contentType.includes('application/json')) {
    console.error('Resume fetch returned non-PDF content:', contentType, publicResume.url)
    res.status(502).json({ message: 'Resume file is unavailable' })
    return false
  }

  const buffer = Buffer.from(await upstream.arrayBuffer())
  if (buffer.length < 4 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
    console.error('Resume fetch did not return a PDF signature:', publicResume.url)
    res.status(502).json({ message: 'Resume file is corrupted or unavailable' })
    return false
  }

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', buildContentDisposition(publicResume.fileName))
  res.setHeader('Content-Length', String(buffer.length))
  res.setHeader('Cache-Control', 'private, no-cache')
  res.send(buffer)
  return true
}
