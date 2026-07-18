import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { cn } from '../../lib/cn'

const LINES = [
  '> Authenticating...',
  '██████████████',
  'Access Granted ✅',
  'Welcome back, Ahmad 🚀',
]

/**
 * Short terminal celebration after successful login (~1s then callback).
 */
export default function AuthTerminal({ active, onDone, className }) {
  const rootRef = useRef(null)
  const [visibleLines, setVisibleLines] = useState([])

  useLayoutEffect(() => {
    if (!active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timers = []
    let doneTimer = 0

    if (reduced) {
      setVisibleLines(LINES)
      doneTimer = window.setTimeout(() => onDone?.(), 900)
      return () => window.clearTimeout(doneTimer)
    }

    setVisibleLines([])
    LINES.forEach((line, i) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleLines((prev) => [...prev, line])
        }, i * 180),
      )
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' },
      )
    }, rootRef)

    doneTimer = window.setTimeout(() => onDone?.(), 1100)

    return () => {
      timers.forEach(clearTimeout)
      window.clearTimeout(doneTimer)
      ctx.revert()
    }
  }, [active, onDone])

  if (!active) return null

  return (
    <div
      ref={rootRef}
      className={cn(
        'fixed inset-0 z-[90] flex items-center justify-center bg-background/80 px-4 backdrop-blur-md',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[rgba(3,7,18,0.92)] shadow-2xl shadow-primary/20">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-muted">auth.sh</span>
        </div>
        <div className="space-y-2 px-5 py-6 font-mono text-sm text-secondary sm:text-base">
          {visibleLines.map((line) => (
            <p key={line} className="leading-relaxed">
              {line}
            </p>
          ))}
          <span className="inline-block h-4 w-2 animate-pulse bg-secondary/80" />
        </div>
      </div>
    </div>
  )
}
