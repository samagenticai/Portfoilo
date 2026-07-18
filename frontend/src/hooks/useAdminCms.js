import { useCallback, useEffect, useState } from 'react'
import { api, buildUrl, getStoredToken } from '../lib/api'
import { validateResumePdf } from '../lib/resumeValidation'

export function useAdminSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams(params).toString()
      const data = await api(`/api/admin/skills${qs ? `?${qs}` : ''}`)
      setSkills(data.skills || [])
    } catch (err) {
      setError(err.message || 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { skills, loading, error, reload: load }
}

export async function uploadSkillIcon(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(buildUrl('/api/admin/skills/upload-icon'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${getStoredToken()}` },
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data.url
}

export async function uploadProfileImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(buildUrl('/api/admin/profile/upload-image'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${getStoredToken()}` },
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data.url
}

export async function uploadResumePdf(file) {
  const validationError = validateResumePdf(file)
  if (validationError) throw new Error(validationError)

  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(buildUrl('/api/admin/resume/upload'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${getStoredToken()}` },
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data.resume
}
