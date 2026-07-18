import { useCallback, useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
]

export default function MessagesManage() {
  const [messages, setMessages] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [unread, setUnread] = useState(0)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [expandedId, setExpandedId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ search, filter, page: String(page), limit: '10' })
      const data = await api(`/api/admin/messages?${params}`)
      setMessages(data.messages || [])
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
      setUnread(data.unread ?? 0)
    } catch (err) {
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [search, filter, page])

  useEffect(() => {
    const t = window.setTimeout(load, search ? 250 : 0)
    return () => window.clearTimeout(t)
  }, [load, search])

  const setRead = async (id, read) => {
    setBusyId(id)
    try {
      await api(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ read }),
      })
      await load()
    } catch (err) {
      setError(err.message || 'Update failed')
    } finally {
      setBusyId('')
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    setBusyId(id)
    try {
      await api(`/api/admin/messages/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-muted">
            Contact form inbox · {pagination.total} total · {unread} unread
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          placeholder="Search messages…"
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
                filter === f.id ? 'bg-secondary/20 text-secondary' : 'bg-white/[0.04] text-muted hover:text-text',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-muted">Loading messages…</div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-muted">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const open = expandedId === msg._id
            return (
              <article
                key={msg._id}
                className={cn(
                  'rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-md transition',
                  msg.read ? 'border-white/10' : 'border-secondary/25 bg-secondary/[0.03]',
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-text">{msg.name}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', msg.read ? 'bg-white/10 text-muted' : 'bg-secondary/15 text-secondary')}>
                        {msg.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{msg.email}</p>
                    <p className="mt-2 font-medium text-text">{msg.subject}</p>
                    <p className="mt-1 text-xs text-muted">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busyId === msg._id} onClick={() => setRead(msg._id, !msg.read)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-muted hover:text-text">
                      Mark {msg.read ? 'Unread' : 'Read'}
                    </button>
                    <button type="button" onClick={() => setExpandedId(open ? '' : msg._id)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-text">
                      {open ? 'Hide' : 'View'}
                    </button>
                    <button type="button" disabled={busyId === msg._id} onClick={() => onDelete(msg._id)} className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-300">
                      Delete
                    </button>
                  </div>
                </div>
                {open ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-muted whitespace-pre-wrap">
                    {msg.message}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      )}

      {pagination.pages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
          <span className="text-sm text-muted">Page {pagination.page} / {pagination.pages}</span>
          <button type="button" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
