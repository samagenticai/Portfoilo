import { useEffect, useRef } from 'react'
import { cn } from '../../../lib/cn'

function createParticle(index, radius, mobile) {
  const clockwise = index % 2 === 0
  return {
    angle: Math.random() * Math.PI * 2,
    orbitRadius: radius * (0.55 + Math.random() * 0.45),
    speed: (clockwise ? 1 : -1) * (0.0008 + Math.random() * 0.0012) * (mobile ? 0.65 : 1),
    size: mobile ? 1 + Math.random() * 1.5 : 1.2 + Math.random() * 2.2,
    opacity: 0.25 + Math.random() * 0.55,
    fadeSpeed: 0.004 + Math.random() * 0.008,
    fadeDir: Math.random() > 0.5 ? 1 : -1,
    hue: Math.random() > 0.5 ? '56,189,248' : '37,99,235',
  }
}

export default function MernOrbitEnergy({ mouseRef, className }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let particles = []
    let width = 0
    let height = 0
    let dpr = 1
    let mobile = window.matchMedia('(max-width: 639px)').matches

    const resize = () => {
      mobile = window.matchMedia('(max-width: 639px)').matches
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = mobile ? 16 : 34
      const baseRadius = Math.min(width, height) * 0.42
      particles = Array.from({ length: count }, (_, i) => createParticle(i, baseRadius, mobile))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2
      const mouse = mouseRef?.current || { x: 0, y: 0, active: false }
      const mouseInfluence = mobile ? 0.00015 : 0.00035

      // Subtle energy field
      const field = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.48)
      field.addColorStop(0, 'rgba(56, 189, 248, 0.08)')
      field.addColorStop(0.55, 'rgba(37, 99, 235, 0.05)')
      field.addColorStop(1, 'rgba(37, 99, 235, 0)')
      ctx.fillStyle = field
      ctx.fillRect(0, 0, width, height)

      for (const p of particles) {
        if (mouse.active) {
          p.angle += mouse.x * mouseInfluence
        }
        p.angle += p.speed
        p.opacity += p.fadeSpeed * p.fadeDir
        if (p.opacity >= 0.85 || p.opacity <= 0.15) p.fadeDir *= -1

        const x = cx + Math.cos(p.angle) * p.orbitRadius
        const y = cy + Math.sin(p.angle) * p.orbitRadius

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.hue}, ${p.opacity})`
        ctx.shadowColor = `rgba(${p.hue}, ${p.opacity * 0.9})`
        ctx.shadowBlur = mobile ? 4 : 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    ro?.observe(wrap)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [mouseRef])

  return (
    <div
      ref={wrapRef}
      className={cn('mern-orbit-energy pointer-events-none absolute inset-[18%] z-[5]', className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
