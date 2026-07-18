import { useEffect, useRef } from 'react'
import { cn } from '../../../../lib/cn'

export default function MouseEnergyTrail({ active = true, targetRef, className }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)

  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    const container = targetRef?.current
    if (!canvas || !container) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    const particles = []
    let raf = 0

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e) => {
      if (!activeRef.current) return
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      for (let i = 0; i < 2; i += 1) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          life: 1,
          size: 2 + Math.random() * 3,
        })
      }
    }

    const draw = () => {
      const { width, height } = container.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.022

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
        gradient.addColorStop(0, `rgba(56, 189, 248, ${p.life * 0.4})`)
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      if (particles.length > 70) particles.splice(0, particles.length - 70)
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    container.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      container.removeEventListener('pointermove', onMove)
    }
  }, [targetRef])

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
    />
  )
}
