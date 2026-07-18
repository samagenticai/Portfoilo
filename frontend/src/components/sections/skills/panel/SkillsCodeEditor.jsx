import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../../../lib/cn'

function buildDevCode(profile) {
  const name = profile?.fullName || 'Developer'
  const role = profile?.professionalTitle || 'Full Stack Developer'
  return `const developer = {
  name: "${name}",
  role: "${role}",
  status: "Available",
  passion: "Building Modern Web Applications"
};`
}

function highlightCode(code) {
  if (!code) return null

  const parts = code.split(/(".*?"|[[\]{}(),:]|const|\w+)/g).filter(Boolean)

  return parts.map((part, i) => {
    if (part === 'const') return <span key={i} className="text-secondary">{part}</span>
    if (/^".*"$/.test(part)) return <span key={i} className="text-green-400/85">{part}</span>
    if (/^[[\]{}(),:]$/.test(part)) return <span key={i} className="text-muted">{part}</span>
    if (/^\w+$/.test(part)) return <span key={i} className="text-primary/90">{part}</span>
    return <span key={i}>{part}</span>
  })
}

export default function SkillsCodeEditor({ active = true, profile, className }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)
  const deletingRef = useRef(false)
  const pauseRef = useRef(0)
  const sourceCode = useMemo(() => buildDevCode(profile), [profile])

  const lines = useMemo(() => displayed.split('\n'), [displayed])

  useEffect(() => {
    if (!active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplayed(sourceCode)
      return undefined
    }

    let timeout = 0

    const tick = () => {
      const i = indexRef.current
      const deleting = deletingRef.current

      if (pauseRef.current > 0) {
        pauseRef.current -= 1
        timeout = window.setTimeout(tick, 80)
        return
      }

      if (!deleting) {
        setDisplayed(sourceCode.slice(0, i + 1))
        indexRef.current = i + 1
        if (indexRef.current >= sourceCode.length) {
          deletingRef.current = true
          pauseRef.current = 22
        }
        timeout = window.setTimeout(tick, 26 + Math.random() * 20)
      } else {
        setDisplayed(sourceCode.slice(0, i - 1))
        indexRef.current = i - 1
        if (indexRef.current <= 0) {
          deletingRef.current = false
          pauseRef.current = 10
        }
        timeout = window.setTimeout(tick, 12)
      }
    }

    timeout = window.setTimeout(tick, 500)
    return () => window.clearTimeout(timeout)
  }, [active, sourceCode])

  return (
    <div data-skills-editor className={cn('', className)} aria-label="Developer code editor">
      <div className="flex items-center gap-2 border-b border-border/40 bg-white/[0.015] px-4 py-2">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-secondary" fill="currentColor" aria-hidden="true">
          <path d="M4 2h8l2 2v10H4V2zm1 1v10h8V5H9V3H5z" />
        </svg>
        <span className="font-mono text-[0.6875rem] text-text">developer.js</span>
        <span className="font-mono text-[0.5625rem] text-muted">
          · Ln {Math.max(lines.length, 1)}
        </span>
      </div>

      <div className="relative flex h-[130px] overflow-hidden sm:h-[145px]">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.02]"
          aria-hidden="true"
        />

        <div
          className="shrink-0 select-none border-r border-border/50 bg-white/[0.02] py-2.5 pl-2 pr-2 font-mono text-[0.625rem] leading-[1.55] text-muted/45"
          aria-hidden="true"
        >
          {(lines.length > 0 ? lines : ['']).map((_, i) => (
            <div key={i} className="text-right tabular-nums">{i + 1}</div>
          ))}
          {displayed.length === 0 && [1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="text-right">{n}</div>
          ))}
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden py-2.5 pl-2.5 pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <pre className="font-mono text-[0.6875rem] leading-[1.55] text-text">
            <code>
              {highlightCode(displayed)}
              <span className="code-cursor ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-secondary" />
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
