import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { useAdminSkills } from '../../hooks/useAdminCms'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'hidden', label: 'Hidden' },
]

export default function SkillsManage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState('')
  const { skills, loading, error, reload } = useAdminSkills()

  const filtered = skills.filter((skill) => {
    if (filter === 'published' && !skill.published) return false
    if (filter === 'hidden' && skill.published) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return skill.name.toLowerCase().includes(q) || skill.category.toLowerCase().includes(q)
  })

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete “${name}”?`)) return
    setBusyId(id)
    try {
      await api(`/api/admin/skills/${id}`, { method: 'DELETE' })
      await reload({ filter, search })
    } catch (err) {
      alert(err.message || 'Delete failed')
    } finally {
      setBusyId('')
    }
  }

  const onTogglePublish = async (skill) => {
    setBusyId(skill._id)
    try {
      await api(`/api/admin/skills/${skill._id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !skill.published }),
      })
      await reload({ filter, search })
    } catch (err) {
      alert(err.message || 'Update failed')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Skills</h1>
          <p className="mt-1 text-sm text-muted">Manage tech stack shown on the portfolio · {skills.length} total</p>
        </div>
        <Link
          to="/admin/skills/new"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-text shadow-lg shadow-primary/25"
        >
          + Add Skill
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills…"
          className="admin-input max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                filter === f.id ? 'bg-secondary/20 text-secondary' : 'bg-white/[0.04] text-muted hover:text-text',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-muted">Loading skills…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
          <p className="text-lg font-semibold text-text">No skills found</p>
          <p className="mt-2 text-sm text-muted">Add your first skill to populate the portfolio tech section.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((skill) => (
            <div
              key={skill._id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition hover:border-secondary/25"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-text">{skill.name}</h3>
                  <p className="mt-1 text-xs text-muted">{skill.category}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                    skill.published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-muted',
                  )}
                >
                  {skill.published ? 'Published' : 'Hidden'}
                </span>
              </div>
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>Proficiency</span>
                  <span className="font-semibold text-secondary">{skill.percentage}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${skill.percentage}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/admin/skills/${skill._id}/edit`}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-text hover:border-secondary/30"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={busyId === skill._id}
                  onClick={() => onTogglePublish(skill)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
                >
                  {skill.published ? 'Hide' : 'Publish'}
                </button>
                <button
                  type="button"
                  disabled={busyId === skill._id}
                  onClick={() => onDelete(skill._id, skill.name)}
                  className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
