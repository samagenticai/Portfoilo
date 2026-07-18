import { useCallback, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import { buildUrl, getStoredToken } from '../../../lib/api'

async function uploadFiles(files) {
  const form = new FormData()
  Array.from(files).forEach((file) => form.append('images', file))

  const headers = {}
  const token = getStoredToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(buildUrl('/api/admin/projects/upload'), {
    method: 'POST',
    headers,
    credentials: 'include',
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data.urls || []
}

function ImageThumb({ url, onRemove, onReplace, label }) {
  const inputRef = useRef(null)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <img src={url} alt={label || 'Project image'} className="h-32 w-full object-cover sm:h-36" />
      <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium text-text backdrop-blur"
        >
          Replace
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-rose-500/20 px-2 py-1 text-[11px] font-medium text-rose-200"
        >
          Remove
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const urls = await uploadFiles([file])
          if (urls[0]) onReplace(urls[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default function ImageUploader({
  coverImage,
  galleryImages = [],
  onCoverChange,
  onGalleryChange,
  className,
}) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    async (fileList, mode = 'gallery') => {
      const files = Array.from(fileList || [])
      if (!files.length) return

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed')
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('Each image must be under 5MB')
          return
        }
      }

      setError('')
      setUploading(true)
      try {
        const urls = await uploadFiles(files)
        if (mode === 'cover' || (!coverImage && urls[0])) {
          onCoverChange(urls[0])
          if (urls.length > 1) onGalleryChange([...(galleryImages || []), ...urls.slice(1)])
        } else {
          onGalleryChange([...(galleryImages || []), ...urls])
        }
      } catch (err) {
        setError(err.message || 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [coverImage, galleryImages, onCoverChange, onGalleryChange],
  )

  return (
    <div className={cn('space-y-5', className)}>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
          Cover Image
        </p>
        {coverImage ? (
          <ImageThumb
            url={coverImage}
            label="Cover"
            onRemove={() => onCoverChange('')}
            onReplace={(url) => onCoverChange(url)}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              inputRef.current?.setAttribute('data-mode', 'cover')
              inputRef.current?.click()
            }}
            className="flex h-36 w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-muted transition hover:border-secondary/40 hover:text-text"
          >
            Upload cover image
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
          Gallery Images
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files, 'gallery')
          }}
          className={cn(
            'rounded-2xl border border-dashed px-4 py-8 text-center transition',
            dragOver
              ? 'border-secondary/50 bg-secondary/10'
              : 'border-white/15 bg-white/[0.02]',
          )}
        >
          <p className="text-sm text-muted">
            {uploading ? 'Uploading…' : 'Drag & drop images here, or'}
          </p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => {
              inputRef.current?.setAttribute('data-mode', 'gallery')
              inputRef.current?.click()
            }}
            className="mt-3 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text hover:border-secondary/40"
          >
            Browse files
          </button>
          <p className="mt-2 text-[11px] text-muted">PNG, JPG, WEBP, GIF · max 5MB each</p>
        </div>

        {galleryImages?.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryImages.map((url) => (
              <ImageThumb
                key={url}
                url={url}
                onRemove={() => onGalleryChange(galleryImages.filter((u) => u !== url))}
                onReplace={(next) =>
                  onGalleryChange(galleryImages.map((u) => (u === url ? next : u)))
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          const mode = inputRef.current?.getAttribute('data-mode') || 'gallery'
          handleFiles(e.target.files, mode)
          e.target.value = ''
        }}
      />
    </div>
  )
}
