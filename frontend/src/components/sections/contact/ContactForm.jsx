import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import AppIcon from '../../ui/AppIcon'
import MagneticButton from '../projects/MagneticButton'
import {
  CONTACT_FORM_DEFAULTS,
  trimContactForm,
  validateContactField,
  validateContactForm,
} from '../../../constants/contact'
import { useCardInteraction } from '../../../hooks/useCardInteraction'
import { useHeroComplexity } from '../../../hooks/useHeroComplexity'
import { buildUrl } from '../../../lib/api'

const PROGRESS_BLOCKS = 14

function FloatingField({
  id,
  label,
  as: Comp = 'input',
  value,
  onChange,
  onBlur,
  type = 'text',
  required,
  autoComplete,
  rows,
  error,
  describedBy,
  maxLength,
}) {
  const [focused, setFocused] = useState(false)
  const floated = focused || Boolean(value)
  const invalid = Boolean(error)

  return (
    <div className="contact-float-field relative">
      <Comp
        id={id}
        name={id}
        type={Comp === 'textarea' ? undefined : type}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        required={required}
        autoComplete={autoComplete}
        rows={rows}
        maxLength={maxLength}
        placeholder=" "
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        onFocus={() => setFocused(true)}
        className={cn(
          'peer contact-input w-full rounded-2xl border bg-black/35 text-text outline-none backdrop-blur-md',
          'min-h-14 px-4 pt-6 pb-2.5 text-base transition-all duration-300 sm:min-h-[3.75rem]',
          'hover:border-white/20',
          'focus:bg-black/45 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.12),0_0_28px_rgba(37,99,235,0.18)]',
          'focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          invalid
            ? 'border-rose-400/55 focus:border-rose-400/70'
            : 'border-white/[0.1] focus:border-secondary/45',
          Comp === 'textarea' && 'min-h-[10.5rem] resize-y leading-relaxed sm:min-h-[11.5rem]',
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-4 transition-all duration-300',
          floated
            ? 'top-2 text-[10px] font-semibold uppercase tracking-[0.14em]'
            : 'top-1/2 -translate-y-1/2 text-sm sm:text-[0.9375rem]',
          invalid ? 'text-rose-300' : floated ? 'text-secondary' : 'text-slate-400',
          Comp === 'textarea' && !floated && 'top-5 translate-y-0',
        )}
      >
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {error ? (
        <p id={describedBy} className="mt-1.5 px-1 text-xs font-medium text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function BlockProgress({ progress }) {
  const filled = Math.round((progress / 100) * PROGRESS_BLOCKS)
  const blocks = Array.from({ length: PROGRESS_BLOCKS }, (_, i) => (i < filled ? '█' : '░'))

  return (
    <p
      className="contact-progress-blocks font-mono text-lg tracking-[0.12em] text-secondary sm:text-xl"
      aria-hidden="true"
    >
      {blocks.join('')}
    </p>
  )
}

export default function ContactForm({ className }) {
  const cardRef = useRef(null)
  const config = useHeroComplexity()
  const [form, setForm] = useState(CONTACT_FORM_DEFAULTS)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [phase, setPhase] = useState('idle') // idle | connecting | success | error
  const [progress, setProgress] = useState(0)
  const [ripples, setRipples] = useState([])
  const [submitError, setSubmitError] = useState('')

  useCardInteraction(cardRef, {
    enabled: config.tier === 'desktop' && config.enabled && phase === 'idle',
    tilt: 3,
    magnetic: 0,
  })

  const isValid = useMemo(() => validateContactForm(form).valid, [form])

  useEffect(() => {
    if (phase !== 'connecting') return undefined

    setProgress(0)
    const start = performance.now()
    const duration = 1400
    let raf = 0
    let cancelled = false

    const tick = (now) => {
      if (cancelled) return
      const t = Math.min(1, (now - start) / duration)
      setProgress(Math.round(t * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [phase])

  const onChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError('')
    setErrors((prev) => {
      if (!touched[name]) return prev
      const message = validateContactField(name, value)
      if (!message) {
        const next = { ...prev }
        delete next[name]
        return next
      }
      return { ...prev, [name]: message }
    })
  }, [touched])

  const onBlur = useCallback((e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => {
      const message = validateContactField(name, value)
      if (!message) {
        const next = { ...prev }
        delete next[name]
        return next
      }
      return { ...prev, [name]: message }
    })
  }, [])

  const spawnRipple = useCallback((e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.6
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y, size }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 650)
  }, [])

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (phase === 'connecting') return

      const trimmed = trimContactForm(form)
      const { valid, errors: nextErrors } = validateContactForm(trimmed)

      setForm(trimmed)
      setTouched({ name: true, email: true, subject: true, message: true })
      setErrors(nextErrors)

      if (!valid) return

      setPhase('connecting')
      setSubmitError('')
      setProgress(0)

      const started = performance.now()
      let ok = true

      try {
        const res = await fetch(buildUrl('/api/contact'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimmed),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          ok = false
          setSubmitError(data.message || 'Something went wrong. Please try again.')
        }
      } catch {
        ok = false
        setSubmitError('Unable to reach the server. Please try again or contact me directly.')
      }

      const elapsed = performance.now() - started
      const remaining = Math.max(0, 1400 - elapsed)
      await new Promise((r) => setTimeout(r, remaining))

      if (ok) {
        setPhase('success')
        setForm(CONTACT_FORM_DEFAULTS)
        setErrors({})
        setTouched({})
      } else {
        setPhase('error')
        setSubmitError('Something went wrong. Please try again or reach me via WhatsApp/email.')
      }
    },
    [form, phase],
  )

  const resetToForm = () => {
    setPhase('idle')
    setProgress(0)
    setSubmitError('')
  }

  return (
    <div
      ref={cardRef}
      className={cn('contact-form-wrap group/form relative w-full max-w-none', className)}
      style={{ perspective: '1200px' }}
    >
      <div className="contact-form-shell feature-card-border relative overflow-hidden rounded-[1.5rem] p-px">
        <div
          data-card-inner
          className="contact-form-surface relative overflow-hidden rounded-[calc(1.5rem-1px)] border border-white/[0.09] bg-[rgba(3,7,18,0.72)] p-5 backdrop-blur-2xl sm:p-7 md:p-7 lg:p-8"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            data-card-spotlight
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-500"
            aria-hidden="true"
          />
          <div className="contact-form-shine pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-[3]">
            {phase === 'connecting' && (
              <div
                className="flex min-h-[24rem] flex-col items-center justify-center px-2 text-center sm:min-h-[26rem]"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <span className="contact-connecting-pulse mb-6 h-12 w-12 rounded-full border-2 border-secondary/30 border-t-secondary" />
                <p className="mb-5 text-base font-semibold text-text sm:text-lg">Connecting...</p>
                <BlockProgress progress={progress} />
                <div className="contact-progress mt-5 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {phase === 'success' && (
              <div
                className="contact-success flex min-h-[24rem] flex-col items-center justify-center px-2 text-center sm:min-h-[26rem]"
                role="status"
                aria-live="polite"
              >
                <span className="contact-success-icon mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10">
                  <AppIcon name="check" size={28} className="text-emerald-400" />
                </span>
                <p className="text-lg font-bold text-text sm:text-xl">Message Sent Successfully ✅</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                  I&apos;ll get back to you as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={resetToForm}
                  className="mt-8 min-h-12 rounded-xl px-4 text-sm font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  Send another message
                </button>
              </div>
            )}

            {phase === 'error' && (
              <div
                className="flex min-h-[24rem] flex-col items-center justify-center px-2 text-center sm:min-h-[26rem]"
                role="alert"
                aria-live="assertive"
              >
                <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10">
                  <span className="text-2xl" aria-hidden="true">!</span>
                </span>
                <p className="text-lg font-bold text-text sm:text-xl">Message not sent</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                  {submitError || 'Please try again.'}
                </p>
                <MagneticButton
                  type="button"
                  variant="primary"
                  size="lg"
                  className="mt-8 min-h-12"
                  onClick={resetToForm}
                >
                  Try again
                </MagneticButton>
              </div>
            )}

            {phase === 'idle' && (
              <form
                onSubmit={onSubmit}
                className="space-y-4 sm:space-y-5"
                noValidate
                aria-label="Contact form"
              >
                <FloatingField
                  id="name"
                  label="Full Name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={touched.name ? errors.name : ''}
                  describedBy={touched.name && errors.name ? 'name-error' : undefined}
                />
                <FloatingField
                  id="email"
                  label="Email Address"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={touched.email ? errors.email : ''}
                  describedBy={touched.email && errors.email ? 'email-error' : undefined}
                />
                <FloatingField
                  id="subject"
                  label="Subject"
                  required
                  value={form.subject}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={touched.subject ? errors.subject : ''}
                  describedBy={touched.subject && errors.subject ? 'subject-error' : undefined}
                />
                <FloatingField
                  id="message"
                  label="Message"
                  as="textarea"
                  required
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={touched.message ? errors.message : ''}
                  describedBy={touched.message && errors.message ? 'message-error' : undefined}
                />
                <p className="px-1 text-right text-[11px] text-muted" aria-live="polite">
                  {form.message.trim().length}/1000
                </p>

                <MagneticButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  onClick={spawnRipple}
                  disabled={!isValid}
                  aria-disabled={!isValid}
                  className={cn(
                    'contact-send-btn relative mt-1 w-full min-h-14 overflow-hidden py-4 text-base sm:min-h-[3.75rem]',
                    !isValid && 'opacity-50',
                  )}
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <AppIcon name="send" size={18} />
                    Send Message
                  </span>
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
                    {ripples.map((r) => (
                      <span
                        key={r.id}
                        className="contact-ripple absolute rounded-full bg-white/35"
                        style={{
                          left: r.x,
                          top: r.y,
                          width: r.size,
                          height: r.size,
                        }}
                      />
                    ))}
                  </span>
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
