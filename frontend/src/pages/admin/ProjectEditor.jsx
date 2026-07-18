import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import ImageUploader from '../../components/admin/projects/ImageUploader'
import {
  EMPTY_PROJECT_FORM,
  PROJECT_BADGES,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  TECH_OPTIONS,
  slugifyTitle,
} from '../../constants/projectCms'
import { cn } from '../../lib/cn'

const STEPS = [
  'Basic Information',
  'Project Images',
  'Project Details',
  'Portfolio Settings',
  'SEO',
]

export default function ProjectEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_PROJECT_FORM)
  const [slugManual, setSlugManual] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    ;(async () => {
      try {
        const data = await api(`/api/admin/projects/${id}`)
        if (cancelled) return
        const p = data.project
        setForm({
          ...EMPTY_PROJECT_FORM,
          ...p,
          seo: { ...EMPTY_PROJECT_FORM.seo, ...(p.seo || {}) },
          galleryImages: p.galleryImages || [],
          techStack: p.techStack || [],
        })
        setSlugManual(true)
      } catch (err) {
        setError(err.message || 'Failed to load project')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const setField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !slugManual) {
        next.slug = slugifyTitle(value)
      }
      return next
    })
  }

  const toggleTech = (tech) => {
    setForm((prev) => {
      const has = prev.techStack.includes(tech)
      return {
        ...prev,
        techStack: has
          ? prev.techStack.filter((t) => t !== tech)
          : [...prev.techStack, tech],
      }
    })
  }

  const canNext = useMemo(() => {
    if (step === 0) {
      return form.title.trim().length >= 2 && form.shortDescription.trim().length >= 10
    }
    return true
  }, [step, form.title, form.shortDescription])

  const onSave = async () => {
    if (!form.title.trim() || !form.shortDescription.trim()) {
      setError('Title and short description are required')
      setStep(0)
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        slug: form.slug || slugifyTitle(form.title),
        seo: {
          metaTitle: form.seo.metaTitle || form.title,
          metaDescription: form.seo.metaDescription || form.shortDescription,
          keywords: form.seo.keywords || '',
        },
      }

      if (isEdit) {
        await api(`/api/admin/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await api('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      navigate('/admin/projects')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading project…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/projects" className="text-sm text-secondary hover:underline">
            ← Back to Projects
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h1>
        </div>
        <div className="text-sm text-muted">
          Step {step + 1} / {STEPS.length}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition',
              i === step
                ? 'bg-primary/25 text-text'
                : i < step
                  ? 'bg-white/10 text-muted'
                  : 'bg-white/[0.03] text-muted/70',
            )}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-7">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Project Title">
              <input
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                className="admin-input"
                placeholder="Cricket Tournament System"
              />
            </Field>
            <Field label="Slug (auto-generated)">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true)
                  setField('slug', slugifyTitle(e.target.value))
                }}
                className="admin-input font-mono text-sm"
                placeholder="cricket-tournament-system"
              />
            </Field>
            <Field label="Short Description">
              <textarea
                value={form.shortDescription}
                onChange={(e) => setField('shortDescription', e.target.value)}
                className="admin-input min-h-24"
                placeholder="One or two sentences for project cards"
              />
            </Field>
            <Field label="Full Description">
              <textarea
                value={form.fullDescription}
                onChange={(e) => setField('fullDescription', e.target.value)}
                className="admin-input min-h-36"
                placeholder="Detailed project story for the portfolio"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <ImageUploader
            coverImage={form.coverImage}
            galleryImages={form.galleryImages}
            onCoverChange={(url) => setField('coverImage', url)}
            onGalleryChange={(urls) => setField('galleryImages', urls)}
          />
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className="admin-input"
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tech Stack">
              <div className="flex flex-wrap gap-2">
                {TECH_OPTIONS.map((tech) => {
                  const active = form.techStack.includes(tech)
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                        active
                          ? 'border-secondary/40 bg-secondary/15 text-secondary'
                          : 'border-white/10 text-muted hover:border-white/20',
                      )}
                    >
                      {tech}
                    </button>
                  )
                })}
              </div>
            </Field>
            <Field label="GitHub URL">
              <input
                value={form.githubUrl}
                onChange={(e) => setField('githubUrl', e.target.value)}
                className="admin-input"
                placeholder="https://github.com/..."
              />
            </Field>
            <Field label="Live Demo URL">
              <input
                value={form.liveUrl}
                onChange={(e) => setField('liveUrl', e.target.value)}
                className="admin-input"
                placeholder="https://..."
              />
            </Field>
            <Field label="Project Status">
              <div className="flex flex-wrap gap-2">
                {PROJECT_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setField('projectStatus', status)}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-sm transition',
                      form.projectStatus === status
                        ? 'border-primary/40 bg-primary/20 text-text'
                        : 'border-white/10 text-muted',
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3">
              <span>
                <span className="block text-sm font-medium text-text">Featured Project</span>
                <span className="text-xs text-muted">Show on homepage featured section</span>
              </span>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField('featured', e.target.checked)}
                className="h-5 w-5 rounded"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3">
              <span>
                <span className="block text-sm font-medium text-text">Publish</span>
                <span className="text-xs text-muted">Draft projects stay hidden on the portfolio</span>
              </span>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setField('published', e.target.checked)}
                className="h-5 w-5 rounded"
              />
            </label>
            <Field label="Display Order">
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setField('displayOrder', Number(e.target.value) || 0)}
                className="admin-input"
              />
            </Field>
            <Field label="Project Badge">
              <select
                value={form.badge}
                onChange={(e) => setField('badge', e.target.value)}
                className="admin-input"
              >
                {PROJECT_BADGES.map((b) => (
                  <option key={b.label} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Field label="Meta Title">
              <input
                value={form.seo.metaTitle}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: e.target.value },
                  }))
                }
                className="admin-input"
                placeholder={form.title || 'SEO title'}
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                value={form.seo.metaDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: e.target.value },
                  }))
                }
                className="admin-input min-h-28"
                placeholder={form.shortDescription || 'SEO description'}
              />
            </Field>
            <Field label="Keywords">
              <input
                value={form.seo.keywords}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, keywords: e.target.value },
                  }))
                }
                className="admin-input"
                placeholder="react, mern, portfolio"
              />
            </Field>
          </div>
        )}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted disabled:opacity-40"
          >
            Back
          </button>
          <div className="flex flex-wrap gap-2">
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={onSave}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Project'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
        {label}
      </span>
      {children}
    </label>
  )
}
