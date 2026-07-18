import { useCallback, useEffect, useState } from 'react'
import { buildUrl } from '../lib/api'

async function fetchProjects(url) {
  const res = await fetch(buildUrl(url), {
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to load projects')
  return data.projects || []
}

/**
 * Portfolio source of truth — published projects from the API only.
 * Never falls back to hardcoded demo data.
 */
export function usePublicProjects({ featuredOnly = false } = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const url = featuredOnly
        ? '/api/projects/featured'
        : '/api/projects'
      const list = await fetchProjects(url)
      setProjects(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err.message || 'Could not load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [featuredOnly])

  useEffect(() => {
    reload()
  }, [reload])

  return { projects, loading, error, reload }
}
