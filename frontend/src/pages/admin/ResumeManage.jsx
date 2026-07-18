import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { formatFileSize, validateResumePdf } from '../../lib/resumeValidation'
import { uploadResumePdf } from '../../hooks/useAdminCms'
import AppIcon from '../../components/ui/AppIcon'

export default function ResumeManage() {
  const inputRef = useRef(null)
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const hasResume = Boolean(resume?.url)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/admin/resume')
      setResume(data.resume?.url ? data.resume : null)
    } catch (err) {
      setError(err.message || 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const processFile = async (file) => {
    const validationError = validateResumePdf(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    setError('')
    setMessage('')
    try {
      const next = await uploadResumePdf(file)
      setResume(next)
      setMessage(hasResume ? 'Resume replaced successfully.' : 'Resume uploaded successfully.')
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) await processFile(file)
    e.target.value = ''
  }

  const onDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await processFile(file)
  }

  const onDelete = async () => {
    if (!window.confirm('Delete the current resume? Download buttons on the portfolio will be disabled.')) {
      return
    }
    setDeleting(true)
    setError('')
    setMessage('')
    try {
      await api('/api/admin/resume', { method: 'DELETE' })
      setResume(null)
      setMessage('Resume deleted successfully.')
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const previewUrl = hasResume ? resume.url : ''
  const downloadUrl = previewUrl

  const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleString()
  }

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-muted">Loading resume…</div>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Resume Management</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Upload a PDF resume once — every Download Resume button across the portfolio updates automatically from
            MongoDB. No code changes required.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              hasResume ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400',
            )}
          />
          {hasResume ? 'Live on portfolio' : 'No resume published'}
        </div>
      </div>

      <div className="feature-card-border overflow-hidden rounded-[1.25rem] p-px">
        <div className="glass-card overflow-hidden rounded-[calc(1.25rem-1px)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <AppIcon name="download" size={16} className="text-secondary" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">Resume File</p>
            </div>
            <p className="text-[0.6875rem] text-muted">PDF only · Max 5MB</p>
          </div>

          {hasResume ? (
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="border-b border-white/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
                <p className="text-base font-semibold text-text">{resume.fileName || resume.originalName}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Last updated</dt>
                    <dd className="text-right text-text">{formatDate(resume.updatedAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">File size</dt>
                    <dd className="text-right text-text">{formatFileSize(resume.fileSize)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Stored URL</dt>
                    <dd className="max-w-[12rem] truncate text-right font-mono text-xs text-secondary">{resume.url}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text transition hover:border-secondary/30 hover:bg-white/[0.03]"
                  >
                    <AppIcon name="eye" size={15} />
                    Preview
                  </a>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                  >
                    <AppIcon name="download" size={15} className="!text-inherit" />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text transition hover:border-secondary/30 disabled:opacity-60"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 px-4 py-2.5 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="bg-black/25 p-3 sm:p-4">
                <iframe
                  title="Resume preview"
                  src={previewUrl}
                  className="h-[min(70vh,32rem)] w-full rounded-xl border border-white/10 bg-white"
                />
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                'm-4 rounded-2xl border border-dashed p-8 text-center transition sm:m-5 sm:p-10',
                dragOver
                  ? 'border-secondary/50 bg-primary/10'
                  : 'border-white/15 bg-black/20 hover:border-white/25',
              )}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <AppIcon name="download" size={22} className="text-secondary" />
              </div>
              <p className="text-base font-semibold text-text">Upload your resume PDF</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Drag and drop a PDF here, or choose a file. Portfolio download buttons stay disabled until a resume is
                uploaded.
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text shadow-lg shadow-primary/25 disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Choose PDF File'}
              </button>
            </div>
          )}

          {!hasResume ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="border-t border-white/10 px-4 py-3 sm:px-5"
            >
              <p className="text-xs text-muted">Supported format: PDF · Maximum size: 5MB</p>
            </div>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={onFileChange}
        disabled={uploading}
      />

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
    </div>
  )
}
