import { useCallback, useState } from 'react'
import { cn } from '../../../lib/cn'
import MagneticButton from '../projects/MagneticButton'

/** Hero CTA — floats with liquid raft; magnetic + glass shine + glow + ripple */
export default function HeroCTA({ href, children, variant = 'primary', className }) {
  const [ripples, setRipples] = useState([])

  const spawnRipple = useCallback((e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.5
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y, size }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 650)
  }, [])

  return (
    <div className={cn('w-full sm:w-auto', className)}>
      <MagneticButton
        as="a"
        href={href}
        variant={variant}
        size="lg"
        onClick={spawnRipple}
        className={cn(
          'hero-cta relative w-full min-h-12 overflow-hidden sm:w-auto',
          variant === 'primary' && 'hero-cta-primary',
          variant === 'outline' && 'hero-cta-outline',
        )}
      >
        <span className="relative z-[1]">{children}</span>
        <span className="hero-cta-shine pointer-events-none absolute inset-0" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="hero-cta-ripple absolute rounded-full bg-white/30"
              style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            />
          ))}
        </span>
      </MagneticButton>
    </div>
  )
}
