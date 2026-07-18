import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '../../../../lib/cn'

const COLS = 14
const ROWS = 5

function buildGrid() {
  return Array.from({ length: ROWS * COLS }, (_, i) => {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const intensity = ((row * 7 + col * 13 + i * 3) % 5) / 4
    return { id: i, row, col, intensity }
  })
}

export default function ContributionHeatmap({ className, active = true }) {
  const rootRef = useRef(null)
  const cells = useMemo(() => buildGrid(), [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const glowCells = root.querySelectorAll('[data-heat-cell]')
    const ctx = gsap.context(() => {
      glowCells.forEach((cell, i) => {
        if (i % 4 !== 0) return
        gsap.to(cell, {
          opacity: 0.55 + (i % 3) * 0.15,
          boxShadow: '0 0 8px rgba(56, 189, 248, 0.45)',
          duration: 2 + (i % 5) * 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: (i % 7) * 0.3,
        })
      })
    }, root)

    return () => ctx.revert()
  }, [active])

  return (
    <div
      ref={rootRef}
      className={cn(
        'pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-border/60 bg-white/[0.02] p-2 backdrop-blur-sm sm:right-4 sm:top-4 sm:p-2.5',
        className,
      )}
      aria-hidden="true"
    >
      <p className="mb-1.5 text-[0.5625rem] font-medium uppercase tracking-wider text-muted sm:text-[0.625rem]">
        Activity
      </p>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {cells.map((cell) => (
          <span
            key={cell.id}
            data-heat-cell
            className="h-2 w-2 rounded-[2px] sm:h-2.5 sm:w-2.5"
            style={{
              opacity: 0.15 + cell.intensity * 0.55,
              backgroundColor:
                cell.intensity > 0.6
                  ? 'rgba(56, 189, 248, 0.75)'
                  : cell.intensity > 0.3
                    ? 'rgba(37, 99, 235, 0.55)'
                    : 'rgba(148, 163, 184, 0.25)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
