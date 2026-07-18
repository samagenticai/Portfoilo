import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { EMPTY_PROFILE_FORM } from '../../constants/cmsForms'
import { uploadProfileImage } from '../../hooks/useAdminCms'

export default function ProfileManage() {
  const [form, setForm] = useState(EMPTY_PROFILE_FORM)
  const [titlesInput, setTitlesInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api('/api/admin/profile')
        if (cancelled) return
        const p = data.profile || {}
        setForm({ ...EMPTY_PROFILE_FORM, ...p })
        setTitlesInput((p.animatedTitles || []).join('\n'))
      } catch (err) {
        setError(err.message || 'Failed to load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const onImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProfileImage(file)
      setField('profileImage', url)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const animatedTitles = titlesInput
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
      await api('/api/admin/profile', {
        method: 'PUT',
        body: JSON.stringify({ ...form, animatedTitles }),
      })
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-muted">Loading profile…</div>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
      <p className="mt-1 text-sm text-muted">Updates Hero, Contact, Footer and About content on the portfolio.</p>

      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-7">
        <Field label="Full Name"><input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} className="admin-input" /></Field>
        <Field label="Professional Title"><input value={form.professionalTitle} onChange={(e) => setField('professionalTitle', e.target.value)} className="admin-input" /></Field>
        <Field label="Animated Titles (one per line)">
          <textarea value={titlesInput} onChange={(e) => setTitlesInput(e.target.value)} className="admin-input min-h-28" />
        </Field>
        <Field label="Short Bio"><textarea value={form.shortBio} onChange={(e) => setField('shortBio', e.target.value)} className="admin-input min-h-24" /></Field>
        <Field label="Hero Description"><textarea value={form.heroDescription} onChange={(e) => setField('heroDescription', e.target.value)} className="admin-input min-h-28" /></Field>

        <Field label="Profile Image">
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text hover:border-secondary/30">
              {uploading ? 'Uploading…' : 'Upload Image'}
              <input type="file" accept="image/*" className="sr-only" onChange={onImageUpload} disabled={uploading} />
            </label>
            {form.profileImage ? <img src={form.profileImage} alt="" className="h-16 w-16 rounded-xl border border-white/10 object-cover" /> : null}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location"><input value={form.location} onChange={(e) => setField('location', e.target.value)} className="admin-input" /></Field>
          <Field label="Years of Experience"><input type="number" value={form.yearsOfExperience} onChange={(e) => setField('yearsOfExperience', Number(e.target.value) || 0)} className="admin-input" /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="admin-input" /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="admin-input" /></Field>
          <Field label="Phone E164 (WhatsApp)"><input value={form.phoneE164} onChange={(e) => setField('phoneE164', e.target.value)} className="admin-input" placeholder="923137363725" /></Field>
          <Field label="Website"><input value={form.website} onChange={(e) => setField('website', e.target.value)} className="admin-input" /></Field>
        </div>

        <Field label="GitHub URL"><input value={form.githubUrl} onChange={(e) => setField('githubUrl', e.target.value)} className="admin-input" /></Field>
        <Field label="GitHub Display"><input value={form.githubDisplay} onChange={(e) => setField('githubDisplay', e.target.value)} className="admin-input" /></Field>
        <Field label="LinkedIn URL"><input value={form.linkedinUrl} onChange={(e) => setField('linkedinUrl', e.target.value)} className="admin-input" /></Field>
        <Field label="LinkedIn Display"><input value={form.linkedinDisplay} onChange={(e) => setField('linkedinDisplay', e.target.value)} className="admin-input" /></Field>
        <Field label="Availability"><input value={form.availability} onChange={(e) => setField('availability', e.target.value)} className="admin-input" /></Field>

        <Field label="Skills Section Heading"><input value={form.skillsHeading} onChange={(e) => setField('skillsHeading', e.target.value)} className="admin-input" /></Field>
        <Field label="Skills Description"><textarea value={form.skillsDescription} onChange={(e) => setField('skillsDescription', e.target.value)} className="admin-input min-h-24" /></Field>
        <Field label="Skills Description (Line 2)"><textarea value={form.skillsDescription2} onChange={(e) => setField('skillsDescription2', e.target.value)} className="admin-input min-h-24" /></Field>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {saved ? <p className="text-sm text-emerald-300">Profile saved. Refresh the portfolio to see updates.</p> : null}

        <div className="flex justify-end border-t border-white/10 pt-5">
          <button type="button" disabled={saving} onClick={onSave} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Profile'}
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
