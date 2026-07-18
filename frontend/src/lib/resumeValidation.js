export const RESUME_MAX_BYTES = 5 * 1024 * 1024

export function validateResumePdf(file) {
  if (!file) return 'Please select a PDF file.'
  if (file.type !== 'application/pdf') return 'Only PDF files are allowed.'
  if (!file.name.toLowerCase().endsWith('.pdf')) return 'Only PDF files are allowed.'
  if (file.size > RESUME_MAX_BYTES) return 'Maximum file size is 5MB.'
  return ''
}

export function formatFileSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
