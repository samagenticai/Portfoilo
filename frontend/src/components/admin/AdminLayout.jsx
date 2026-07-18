import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import SeoHead from '../seo/SeoHead'
import AppIcon from '../ui/AppIcon'
import { cn } from '../../lib/cn'

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: 'gauge' },
  { label: 'Projects', to: '/admin/projects', icon: 'folder' },
  { label: 'Messages', to: '/admin/messages', icon: 'mail' },
  { label: 'Profile', to: '/admin/profile', icon: 'sparkles' },
  { label: 'Resume', to: '/admin/resume', icon: 'download' },
  { label: 'Skills', to: '/admin/skills', icon: 'stack' },
  { label: 'Settings', to: '/admin/settings', icon: 'shield' },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <SeoHead
        title="Admin Dashboard | Ahmad Stack Portfolio CMS"
        description="Private portfolio content management system."
        robots="noindex, nofollow"
        path="/admin"
      />
      <div className="flex h-dvh overflow-hidden bg-background text-text">
      <div className="flex min-h-0 min-w-0 flex-1">
        {/* Desktop sidebar — fixed, never scrolls with page */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-64 flex-col border-r border-border bg-[rgba(3,7,18,0.92)] backdrop-blur-xl lg:flex">
          <div className="border-b border-border px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">CMS</p>
            <p className="mt-1 text-lg font-bold tracking-tight">Admin Panel</p>
            <p className="mt-1 truncate text-xs text-muted">{admin?.email}</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/20 text-text'
                      : 'text-muted hover:bg-white/5 hover:text-text',
                  )
                }
              >
                <AppIcon name={item.icon} size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
            >
              <AppIcon name="external" size={17} className="!text-rose-300" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main — only this area scrolls */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-[rgba(3,7,18,0.85)] px-4 backdrop-blur-xl sm:px-6">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className="text-lg">☰</span>
            </button>
            <div>
              <p className="text-sm font-semibold">Welcome back, {admin?.name || 'Ahmad'}</p>
              <p className="text-xs text-muted">Portfolio control center</p>
            </div>
            <a
              href="/"
              className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted transition hover:border-secondary/30 hover:text-text"
            >
              View site
            </a>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-clip p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r border-border bg-[rgba(3,7,18,0.98)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <p className="font-bold">Admin Panel</p>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-muted"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium',
                      isActive ? 'bg-primary/20 text-text' : 'text-muted',
                    )
                  }
                >
                  <AppIcon name={item.icon} size={17} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-300"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
    </>
  )
}
