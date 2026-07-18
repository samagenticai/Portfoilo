import { useEffect } from 'react'
import { cn } from '../../lib/cn'

export default function AuthToast({ message, type = 'error', onClose }) {
  useEffect(() => {
    if (!message) return undefined
    const t = window.setTimeout(() => onClose?.(), 4200)
    return () => window.clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      role="alert"
      className={cn(
        'auth-toast fixed right-4 top-4 z-[80] max-w-sm rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl',
        'animate-[auth-toast-in_0.45s_ease-out]',
        type === 'error'
          ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
          : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm font-bold',
            type === 'error'
              ? 'border-rose-400/40 bg-rose-500/20'
              : 'border-emerald-400/40 bg-emerald-500/20',
          )}
        >
          {type === 'error' ? '!' : '✓'}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold tracking-tight">
            {type === 'error' ? 'Authentication failed' : 'Success'}
          </p>
          <p className="mt-1 text-sm text-white/80">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
