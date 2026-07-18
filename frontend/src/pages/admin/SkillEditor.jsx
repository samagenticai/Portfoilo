import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { EMPTY_SKILL_FORM, LUCIDE_ICON_OPTIONS, SKILL_CATEGORIES } from '../../constants/cmsForms'
import { uploadSkillIcon } from '../../hooks/useAdminCms'

export default function SkillEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_SKILL_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    ;(async () => {
      try {
        const data = await api(`/api/admin/skills/${id}`)
        if (cancelled) return
        setForm({ ...EMPTY_SKILL_FORM, ...data.skill })
      } catch (err) {
        setError(err.message || 'Failed to load skill')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const onIconUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadSkillIcon(file)
      setForm((prev) => ({ ...prev, iconType: 'upload', iconUrl: url }))
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const onSave = async () => {
    if (!form.name.trim()) {
      setError('Skill name is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api(`/api/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(form) })
      } else {
        await api('/api/admin/skills', { method: 'POST', body: JSON.stringify(form) })
      }
      navigate('/admin/skills')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-muted">Loading skill…</div>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/skills" className="text-sm text-secondary hover:underline">← Back to Skills</Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{isEdit ? 'Edit Skill' : 'Add Skill'}</h1>

      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-7">
        <Field label="Skill Name">
          <input value={form.name} onChange={(e) => setField('name', e.target.value)} className="admin-input" />
        </Field>

        <Field label="Category">
          <select value={form.category} onChange={(e) => setField('category', e.target.value)} className="admin-input">
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label={`Skill Percentage (${form.percentage}%)`}>
          <input
            type="range"
            min={0}
            max={100}
            value={form.percentage}
            onChange={(e) => setField('percentage', Number(e.target.value))}
            className="w-full accent-primary"
          />
        </Field>

        <Field label="Display Order">
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => setField('displayOrder', Number(e.target.value) || 0)}
            className="admin-input"
          />
        </Field>

        <Field label="Icon Type">
          <div className="flex flex-wrap gap-2">
            {['lucide', 'upload'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setField('iconType', type)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm capitalize transition',
                  form.iconType === type ? 'border-primary/40 bg-primary/20 text-text' : 'border-white/10 text-muted',
                )}
              >
                {type === 'lucide' ? 'Lucide Icon' : 'Upload Icon'}
              </button>
            ))}
          </div>
        </Field>

        {form.iconType === 'lucide' ? (
          <Field label="Lucide Icon">
            <select value={form.lucideIcon} onChange={(e) => setField('lucideIcon', e.target.value)} className="admin-input">
              {LUCIDE_ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="Upload Icon">
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text hover:border-secondary/30">
                {uploading ? 'Uploading…' : 'Choose Image'}
                <input type="file" accept="image/*" className="sr-only" onChange={onIconUpload} disabled={uploading} />
              </label>
              {form.iconUrl ? <img src={form.iconUrl} alt="" className="h-10 w-10 rounded-lg border border-white/10 object-cover" /> : null}
            </div>
          </Field>
        )}

        <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-text">Publish on Portfolio</span>
            <span className="text-xs text-muted">Hidden skills stay out of the public site</span>
          </span>
          <input type="checkbox" checked={form.published} onChange={(e) => setField('published', e.target.checked)} className="h-5 w-5 rounded" />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex justify-end gap-2 border-t border-white/10 pt-5">
          <Link to="/admin/skills" className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted">Cancel</Link>
          <button type="button" disabled={saving} onClick={onSave} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Skill'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{label}</span>
      {children}
    </label>
  )
}
