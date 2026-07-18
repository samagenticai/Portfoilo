import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SECTION_CODE_SYMBOLS } from '../../../constants/features'
import { cn } from '../../../lib/cn'

const SYMBOL_LAYOUT = [
  { text: SECTION_CODE_SYMBOLS[0], left: '6%', top: '12%', size: '1.1rem' },
  { text: SECTION_CODE_SYMBOLS[1], left: '88%', top: '18%', size: '0.95rem' },
  { text: SECTION_CODE_SYMBOLS[2], left: '12%', top: '72%', size: '0.85rem' },
  { text: SECTION_CODE_SYMBOLS[3], left: '78%', top: '65%', size: '0.9rem' },
  { text: SECTION_CODE_SYMBOLS[4], left: '92%', top: '42%', size: '1rem' },
  { text: SECTION_CODE_SYMBOLS[5], left: '4%', top: '45%', size: '0.8rem' },
  { text: SECTION_CODE_SYMBOLS[6], left: '55%', top: '8%', size: '0.75rem' },
  { text: SECTION_CODE_SYMBOLS[7], left: '42%', top: '88%', size: '0.85rem' },
]

export default function WhyHireMeBackground({ active = true, className }) {
  const rootRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const ctx = gsap.context(() => {
      gsap.to(grid, {
        backgroundPosition: '64px 64px',
        duration: 50,
        ease: 'none',
        repeat: -1,
      })

      rootRef.current?.querySelectorAll('[data-bg-orb]').forEach((orb, i) => {
        gsap.to(orb, {
          x: `${(i % 2 === 0 ? 1 : -1) * (20 + i * 8)}`,
          y: `${(i % 3 === 0 ? -1 : 1) * (15 + i * 6)}`,
          duration: 14 + i * 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      rootRef.current?.querySelectorAll('[data-bg-symbol]').forEach((sym, i) => {
        gsap.to(sym, {
          y: i % 2 === 0 ? 12 : -10,
          x: i % 2 === 0 ? 8 : -6,
          rotation: i % 2 === 0 ? 2 : -2,
          duration: 18 + i * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.5,
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [active])

  return (
    <div
      ref={rootRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* Animated grid */}
      <div
        ref={gridRef}
        className="why-section-grid absolute inset-[-4%] opacity-[0.035]"
      />

      {/* Floating blur lights */}
      <div
        data-bg-orb
        className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/15 blur-[100px]"
      />
      <div
        data-bg-orb
        className="absolute right-[5%] top-[40%] h-72 w-72 rounded-full bg-secondary/10 blur-[110px]"
      />
      <div
        data-bg-orb
        className="absolute bottom-[10%] left-[40%] h-56 w-56 rounded-full bg-primary/10 blur-[90px]"
      />

      {/* Soft particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-secondary/30"
            style={{
              left: `${(i * 17 + 7) % 95}%`,
              top: `${(i * 23 + 11) % 90}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              opacity: 0.15 + (i % 4) * 0.05,
            }}
          />
        ))}
      </div>

      {/* Code symbols */}
      {SYMBOL_LAYOUT.map((item) => (
        <span
          key={item.text + item.left}
          data-bg-symbol
          className="absolute font-mono font-medium text-secondary/30 select-none"
          style={{ left: item.left, top: item.top, fontSize: item.size }}
        >
          {item.text}
        </span>
      ))}

      {/* Top / bottom fades */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
