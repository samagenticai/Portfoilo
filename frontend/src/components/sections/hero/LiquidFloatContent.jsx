import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '../../../lib/cn'

/**
 * Liquid Floating raft — entire left Hero content drifts like a leaf on calm water.
 * Layered mouse parallax per line; soft return on leave. No letter distortion.
 */
export default function LiquidFloatContent({ children, className }) {
  const rootRef = useRef(null)
  const raftRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const raft = raftRef.current
    if (!root || !raft) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const lines = Array.from(raft.querySelectorAll('[data-liquid-line]'))

    if (reduced) {
      gsap.set([raft, ...lines], {
        clearProps: 'all',
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0,
        filter: 'none',
        letterSpacing: '',
      })
      return undefined
    }

    const amp = isMobile
      ? { raftX: 3.5, raftY: 4.5, raftR: 0.22, lineX: 1.6, lineY: 2.2, mouseX: 6, mouseY: 5 }
      : { raftX: 7, raftY: 8.5, raftR: 0.4, lineX: 3.2, lineY: 4.2, mouseX: 16, mouseY: 12 }

    const depths = lines.map((el, i) => {
      const raw = parseFloat(el.dataset.depth || '')
      return Number.isFinite(raw) ? raw : 0.55 + i * 0.1
    })

    let raf = 0
    let running = false
    let t = 0
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, inside: false }

    const ctx = gsap.context(() => {
      gsap.set(lines, {
        opacity: 0,
        y: 36,
        filter: 'blur(12px)',
        letterSpacing: '0.06em',
      })
      gsap.set(raft, { x: 0, y: 0, rotation: 0, transformOrigin: '50% 45%' })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          gsap.set(lines, { clearProps: 'letterSpacing,filter' })
          running = true
          raf = requestAnimationFrame(tick)
        },
      })

      tl.to(lines, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        letterSpacing: 'normal',
        duration: 0.95,
        stagger: 0.1,
      })
    }, root)

    const tick = () => {
      if (!running) return

      t += isMobile ? 0.0032 : 0.0042

      // Soft ease toward mouse target
      const ease = mouse.inside ? 0.045 : 0.028
      mouse.x += (mouse.tx - mouse.x) * ease
      mouse.y += (mouse.ty - mouse.y) * ease

      // Dual-frequency sine = organic leaf drift
      const raftX =
        Math.sin(t) * amp.raftX + Math.sin(t * 0.41 + 0.6) * (amp.raftX * 0.4)
      const raftY =
        Math.cos(t * 0.87) * amp.raftY + Math.sin(t * 0.53 + 1.1) * (amp.raftY * 0.35)
      const raftR =
        Math.sin(t * 0.62) * amp.raftR + Math.cos(t * 0.33) * (amp.raftR * 0.35)

      gsap.set(raft, {
        x: raftX,
        y: raftY,
        rotation: raftR,
        force3D: true,
      })

      lines.forEach((line, i) => {
        const depth = depths[i]
        const phase = i * 0.85
        const lx =
          Math.sin(t * 0.92 + phase) * amp.lineX * depth +
          Math.sin(t * 0.35 + phase * 1.3) * amp.lineX * 0.25 * depth
        const ly =
          Math.cos(t * 0.78 + phase) * amp.lineY * depth +
          Math.sin(t * 0.48 + phase) * amp.lineY * 0.3 * depth

        gsap.set(line, {
          x: lx + mouse.x * amp.mouseX * depth,
          y: ly + mouse.y * amp.mouseY * depth,
          force3D: true,
        })
      })

      raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      if (isMobile) return
      const rect = root.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      mouse.inside = true
      mouse.tx = Math.max(-1, Math.min(1, nx))
      mouse.ty = Math.max(-1, Math.min(1, ny))
    }

    const onLeave = () => {
      mouse.inside = false
      mouse.tx = 0
      mouse.ty = 0
    }

    if (!isMobile) {
      root.addEventListener('pointermove', onMove, { passive: true })
      root.addEventListener('pointerleave', onLeave)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn('liquid-float-root relative', className)}
    >
      <div
        ref={raftRef}
        className="liquid-float-raft will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  )
}
