import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '../../../../lib/cn'

export default function AuroraLayer({ intensity = 1, active = true, className }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return undefined

    const blobs = root.querySelectorAll('[data-aurora-blob]')
    const ctx = gsap.context(() => {
      blobs.forEach((blob, i) => {
        const dur = 18 + i * 4
        gsap.to(blob, {
          x: `${(i % 2 === 0 ? 1 : -1) * (8 + i * 3)}%`,
          y: `${(i % 3 === 0 ? 1 : -1) * (6 + i * 2)}%`,
          scale: 1 + i * 0.08,
          opacity: 0.5 + i * 0.12,
          duration: dur,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    }, root)

    return () => ctx.revert()
  }, [active])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll('[data-aurora-blob]').forEach((node) => {
      gsap.getTweensOf(node).forEach((t) => {
        if (active) t.play()
        else t.pause()
      })
    })
  }, [active])

  return (
    <div
      ref={rootRef}
      className={cn('pointer-events-none absolute inset-[-15%] overflow-hidden', className)}
      style={{ opacity: Math.max(0.4, Math.min(1, intensity)) }}
      aria-hidden="true"
    >
      <div
        data-aurora-blob
        className="hero-aurora-blob absolute left-[5%] top-[5%] h-[55%] w-[50%] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.55) 0%, transparent 68%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        data-aurora-blob
        className="hero-aurora-blob absolute right-[0%] top-[15%] h-[50%] w-[48%] rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, transparent 68%)',
          filter: 'blur(85px)',
        }}
      />
      <div
        data-aurora-blob
        className="hero-aurora-blob absolute bottom-[0%] left-[25%] h-[45%] w-[55%] rounded-full opacity-45"
        style={{
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(56, 189, 248, 0.14) 45%, transparent 70%)',
          filter: 'blur(95px)',
        }}
      />
      <div
        data-aurora-blob
        className="hero-aurora-blob absolute left-[40%] top-[35%] h-[35%] w-[40%] rounded-full opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />
    </div>
  )
}
