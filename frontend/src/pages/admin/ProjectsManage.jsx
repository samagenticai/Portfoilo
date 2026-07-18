import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Draft' },
]

export default function ProjectsManage() {
  const [projects, setProjects] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        search,
        filter,
        page: String(page),
        limit: '9',
      })
      const data = await api(`/api/admin/projects?${params}`)
      setProjects(data.projects || [])
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) {
      setError(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [search, filter, page])

  useEffect(() => {
    const t = window.setTimeout(load, search ? 250 : 0)
    return () => window.clearTimeout(t)
  }, [load, search])

  const onDelete = async (id, title) => {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return
    setBusyId(id)
    try {
      await api(`/api/admin/projects/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setBusyId('')
    }
  }

  const onDuplicate = async (id) => {
    setBusyId(id)
    try {
      await api(`/api/admin/projects/${id}/duplicate`, { method: 'POST' })
      await load()
    } catch (err) {
      setError(err.message || 'Duplicate failed')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            CMS for portfolio projects · {pagination.total} total
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-text shadow-lg shadow-primary/25"
        >
          + Add New Project
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          placeholder="Search projects…"
          className="admin-input max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setPage(1)
                setFilter(f.id)
              }}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                filter === f.id
                  ? 'bg-secondary/20 text-secondary'
                  : 'bg-white/[0.04] text-muted hover:text-text',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="py-20 text-center text-muted">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <p className="text-muted">No projects found.</p>
          <Link to="/admin/projects/new" className="mt-4 inline-block text-sm text-secondary hover:underline">
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-[16/10] bg-black/40">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No cover image
                  </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {project.featured ? (
                    <span className="rounded-full bg-secondary/90 px-2 py-0.5 text-[10px] font-bold uppercase text-background">
                      Featured
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      project.published
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/90 text-black',
                    )}
                  >
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold leading-snug text-text">
                    {project.title}
                  </h2>
                  <span className="shrink-0 text-[10px] text-muted">#{project.displayOrder}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{project.shortDescription}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(project.techStack || []).slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    to={`/admin/projects/${project._id}/edit`}
                    className="rounded-lg border border-border px-2 py-2 text-center text-xs font-medium hover:border-secondary/40"
                  >
                    Edit
                  </Link>
                  <a
                    href={project.published ? `/projects` : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border px-2 py-2 text-center text-xs font-medium hover:border-secondary/40"
                    onClick={(e) => {
                      if (!project.published) e.preventDefault()
                    }}
                    title={project.published ? 'Preview on portfolio' : 'Publish to preview'}
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    disabled={busyId === project._id}
                    onClick={() => onDuplicate(project._id)}
                    className="rounded-lg border border-border px-2 py-2 text-xs font-medium hover:border-secondary/40 disabled:opacity-50"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    disabled={busyId === project._id}
                    onClick={() => onDelete(project._id, project.title)}
                    className="rounded-lg border border-rose-400/30 px-2 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination.pages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-muted">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}
