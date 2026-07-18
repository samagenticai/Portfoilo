import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { buildUrl, resolveAssetUrl } from '../lib/api'

const PortfolioContext = createContext(null)

async function fetchJson(url) {
  const res = await fetch(buildUrl(url), {
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [resume, setResume] = useState(null)
  const [skills, setSkills] = useState(null)
  const [orbit, setOrbit] = useState([])
  const [proficiency, setProficiency] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [profileData, resumeData, skillsData] = await Promise.all([
        fetchJson('/api/profile'),
        fetchJson('/api/resume'),
        fetchJson('/api/skills'),
      ])
      setProfile(profileData.profile || null)
      setResume(resumeData.resume || null)
      setSkills(skillsData.skills || [])
      setOrbit(skillsData.orbit || [])
      setProficiency(skillsData.proficiency || [])
    } catch (err) {
      setError(err.message || 'Failed to load portfolio content')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const value = useMemo(
    () => ({
      profile,
      resume,
      skills,
      orbit,
      proficiency,
      loading,
      error,
      reload,
      resumeUrl: resolveAssetUrl(resume?.url || ''),
      resumeFileName: resume?.fileName || 'resume.pdf',
      hasResume: Boolean(resume?.url),
      mailtoHref: profile?.email ? `mailto:${profile.email}` : '',
      whatsappHref: profile?.phoneE164 ? `https://wa.me/${profile.phoneE164}` : '',
    }),
    [profile, resume, skills, orbit, proficiency, loading, error, reload],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
