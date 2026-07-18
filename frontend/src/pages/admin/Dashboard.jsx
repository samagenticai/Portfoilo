import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../lib/api'

function StatCard({ label, value, hint, to }) {
  const inner = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition hover:border-secondary/30">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-text">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function Dashboard() {
  const { admin } = useAuth()
  const [stats, setStats] = useState({ total: '—', published: '—', featured: '—', draft: '—', unread: '—' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [all, published, featured, draft, messages] = await Promise.all([
          api('/api/admin/projects?filter=all&limit=1'),
          api('/api/admin/projects?filter=published&limit=1'),
          api('/api/admin/projects?filter=featured&limit=1'),
          api('/api/admin/projects?filter=draft&limit=1'),
          api('/api/admin/messages?filter=unread&limit=1'),
        ])
        if (cancelled) return
        setStats({
          total: all.pagination?.total ?? 0,
          published: published.pagination?.total ?? 0,
          featured: featured.pagination?.total ?? 0,
          draft: draft.pagination?.total ?? 0,
          unread: messages.unread ?? 0,
        })
      } catch {
        // leave placeholders
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-muted">
          Signed in as <span className="text-text">{admin?.email}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Projects" value={stats.total} hint="All CMS projects" to="/admin/projects" />
        <StatCard label="Published" value={stats.published} hint="Live on portfolio" to="/admin/projects" />
        <StatCard label="Featured" value={stats.featured} hint="Homepage highlights" to="/admin/projects" />
        <StatCard label="Drafts" value={stats.draft} hint="Hidden from public" to="/admin/projects" />
        <StatCard label="Unread Messages" value={stats.unread} hint="Contact inbox" to="/admin/messages" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <h2 className="text-lg font-semibold">Projects CMS</h2>
          <p className="mt-2 text-sm text-muted">
            Add, edit, feature, and publish projects from the admin panel.
          </p>
          <Link to="/admin/projects/new" className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text">
            + Add New Project
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
          <h2 className="text-lg font-semibold">Portfolio CMS</h2>
          <p className="mt-2 text-sm text-muted">
            Manage skills, profile, resume, and contact messages. Changes appear on the public site after refresh.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/admin/skills" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text hover:border-secondary/30">Skills</Link>
            <Link to="/admin/profile" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text hover:border-secondary/30">Profile</Link>
            <Link to="/admin/resume" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text hover:border-secondary/30">Resume</Link>
            <Link to="/admin/messages" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-text hover:border-secondary/30">Messages</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
