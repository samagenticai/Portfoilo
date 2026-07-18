import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../../context/AuthContext'
import LoginBackground from '../../components/admin/LoginBackground'
import AuthToast from '../../components/admin/AuthToast'
import AuthTerminal from '../../components/admin/AuthTerminal'
import SeoHead from '../../components/seo/SeoHead'
import AppIcon from '../../components/ui/AppIcon'
import { PAGE_SEO } from '../../constants/seo'
import { cn } from '../../lib/cn'

export default function Login() {
  const seo = PAGE_SEO.login
  const { login } = useAuth()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')
  const [showTerminal, setShowTerminal] = useState(false)

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const items = card.querySelectorAll('[data-login-reveal]')
    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y: 24, filter: 'blur(8px)' })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15,
      })
    }, card)

    return () => ctx.revert()
  }, [])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onTerminalDone = useCallback(() => {
    navigate('/admin/dashboard', { replace: true })
  }, [navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setToast('')

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.rememberMe,
      })
      setShowTerminal(true)
    } catch (err) {
      setToast(err.message || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        robots={seo.robots}
        path={seo.path}
      />
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <LoginBackground />
      <AuthToast message={toast} type="error" onClose={() => setToast('')} />
      <AuthTerminal active={showTerminal} onDone={onTerminalDone} />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md"
      >
        <div
          data-login-reveal
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-primary/15 text-secondary">
            <span className="text-lg font-bold">{'</>'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-muted">
            Secure portfolio CMS — single administrator only
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="feature-card-border relative overflow-hidden rounded-[1.5rem] p-px"
          data-login-reveal
        >
          <div className="rounded-[calc(1.5rem-1px)] border border-white/[0.09] bg-[rgba(3,7,18,0.72)] p-6 backdrop-blur-2xl sm:p-8">
            <div className="space-y-4">
              <div data-login-reveal>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={form.email}
                  onChange={onChange}
                  placeholder="admin@example.com"
                  className={cn(
                    'w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3.5 text-base text-text outline-none backdrop-blur-md',
                    'transition-all duration-300 placeholder:text-slate-500',
                    'focus:border-secondary/45 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]',
                  )}
                />
              </div>

              <div data-login-reveal>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••••••"
                    className={cn(
                      'w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3.5 pr-12 text-base text-text outline-none backdrop-blur-md',
                      'transition-all duration-300 placeholder:text-slate-500',
                      'focus:border-secondary/45 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12)]',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-muted hover:text-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div data-login-reveal className="flex items-center justify-between gap-3 pt-1">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary"
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed text-sm text-muted/50"
                  title="Coming soon"
                >
                  Forgot Password
                </button>
              </div>

              <div data-login-reveal className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || showTerminal}
                  className={cn(
                    'hero-cta hero-cta-primary relative flex w-full min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-semibold text-text',
                    'bg-primary transition-all duration-300',
                    'hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <AppIcon name="lock" size={17} className="!text-inherit" />
                      Login
                    </>
                  )}
                </button>
              </div>
            </div>

            <p data-login-reveal className="mt-6 text-center text-xs text-muted">
              No public registration. Authorized administrator only.
            </p>
          </div>
        </form>
      </div>
    </section>
    </>
  )
}
