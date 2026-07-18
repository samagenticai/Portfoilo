import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { api } from '../../lib/api'
import { getPasswordStrength, validatePasswordPolicy } from '../../lib/passwordValidation'
import AuthToast from '../../components/admin/AuthToast'
import { cn } from '../../lib/cn'

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  show,
  onToggleShow,
  autoComplete,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={cn(
            'admin-input pr-16',
            error && 'border-rose-400/40 focus:border-rose-400/50 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]',
          )}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-muted hover:text-text"
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error ? (
        <p className="admin-field-error mt-2 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function SettingsManage() {
  const formRef = useRef(null)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('success')

  const strength = useMemo(() => getPasswordStrength(form.newPassword), [form.newPassword])

  useLayoutEffect(() => {
    if (!Object.keys(errors).length || !formRef.current) return undefined

    const fields = formRef.current.querySelectorAll('.admin-field-error')
    if (!fields.length) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fields,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' },
      )
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        { x: -6, duration: 0.06, repeat: 3, yoyo: true, ease: 'power1.inOut' },
      )
    }, formRef)

    return () => ctx.revert()
  }, [errors])

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validateClient = () => {
    const nextErrors = {}

    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = 'Current password is required.'
    }

    const policy = validatePasswordPolicy(form.newPassword)
    if (!policy.valid) {
      nextErrors.newPassword = policy.errors.join(' • ')
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your new password.'
    } else if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    if (
      form.currentPassword &&
      form.newPassword &&
      form.currentPassword === form.newPassword
    ) {
      nextErrors.newPassword = 'New password must be different from the current password.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (!validateClient()) return

    setSubmitting(true)
    setToast('')

    try {
      const data = await api('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setToastType('success')
      setToast(data.message || 'Password updated successfully.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShow({ current: false, next: false, confirm: false })
    } catch (err) {
      setToastType('error')
      if (err.data?.errors) {
        setErrors(err.data.errors)
        setToast(err.message || 'Validation failed')
      } else {
        setToast(err.message || 'Failed to update password')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <AuthToast message={toast} type={toastType} onClose={() => setToast('')} />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">Security and CMS preferences.</p>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-text">Change Password</h2>
            <p className="mt-1 text-sm text-muted">
              Update your admin password. Your current session stays active after the change.
            </p>
          </div>

          <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
            <PasswordField
              id="currentPassword"
              label="Current Password"
              value={form.currentPassword}
              onChange={(e) => setField('currentPassword', e.target.value)}
              error={errors.currentPassword}
              show={show.current}
              onToggleShow={() => setShow((prev) => ({ ...prev, current: !prev.current }))}
              autoComplete="current-password"
            />

            <PasswordField
              id="newPassword"
              label="New Password"
              value={form.newPassword}
              onChange={(e) => setField('newPassword', e.target.value)}
              error={errors.newPassword}
              show={show.next}
              onToggleShow={() => setShow((prev) => ({ ...prev, next: !prev.next }))}
              autoComplete="new-password"
            />

            {form.newPassword ? (
              <div aria-live="polite">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted">Password strength</span>
                  <span className="font-medium text-text">{strength.label}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn('h-full rounded-full transition-all duration-300', strength.color)}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            ) : null}

            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              value={form.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              show={show.confirm}
              onToggleShow={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}
              autoComplete="new-password"
            />

            <ul className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-muted">
              <li>At least 8 characters</li>
              <li>One uppercase letter, one lowercase letter, one number, one special character</li>
            </ul>

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'hero-cta hero-cta-primary mt-2 flex min-h-12 w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold text-text',
                'bg-primary transition-[background-color,opacity,box-shadow] duration-300',
                'hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              {submitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating…
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
