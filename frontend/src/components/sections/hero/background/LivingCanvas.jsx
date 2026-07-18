import { useEffect, useRef } from 'react'

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function createDust(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: rand(-0.22, 0.22),
    vy: rand(-0.22, 0.22),
    size: rand(0.6, 2.2),
    opacity: rand(0.15, 0.55),
    phase: Math.random() * Math.PI * 2,
    pulse: rand(0.004, 0.009),
  }))
}

function createNodes(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: rand(-0.16, 0.16),
    vy: rand(-0.16, 0.16),
    r: rand(1.4, 2.8),
    phase: Math.random() * Math.PI * 2,
  }))
}

/**
 * Premium living canvas — dust particles + animated network in one rAF loop.
 */
export default function LivingCanvas({
  active = true,
  dustCount = 180,
  networkNodes = 52,
  connectionDistance = 155,
  mouseRadius = 160,
  mouseForce = 0.045,
  maxDpr = 1.5,
  mouseRef,
  className,
}) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  const cfgRef = useRef({ dustCount, networkNodes, connectionDistance, mouseRadius, mouseForce, maxDpr })
  const apiRef = useRef(null)

  activeRef.current = active
  cfgRef.current = { dustCount, networkNodes, connectionDistance, mouseRadius, mouseForce, maxDpr }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    const state = {
      dust: [],
      nodes: [],
      w: 0,
      h: 0,
      raf: 0,
      time: 0,
    }

    const resize = (force = false) => {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      const { maxDpr: cap, dustCount: dc, networkNodes: nc } = cfgRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, cap)

      state.w = width
      state.h = height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (force || state.dust.length !== dc) {
        state.dust = createDust(dc, width || 1, height || 1)
      }
      if (force || state.nodes.length !== nc) {
        state.nodes = createNodes(nc, width || 1, height || 1)
      }
    }

    const applyMouse = (p) => {
      const { mouseRadius: radius, mouseForce: force } = cfgRef.current
      if (!mouseRef?.current?.active || radius <= 0) return
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const dx = p.x - mx
      const dy = p.y - my
      const d2 = dx * dx + dy * dy
      const r2 = radius * radius
      if (d2 < r2 && d2 > 1) {
        const d = Math.sqrt(d2)
        const f = ((radius - d) / radius) * force
        p.vx += (dx / d) * f
        p.vy += (dy / d) * f
      }
    }

    const integrate = (p, w, h) => {
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.992
      p.vy *= 0.992

      if (Math.abs(p.vx) + Math.abs(p.vy) < 0.025) {
        p.vx += rand(-0.06, 0.06)
        p.vy += rand(-0.06, 0.06)
      }

      if (p.x < 0) { p.x = 0; p.vx *= -0.8 }
      if (p.x > w) { p.x = w; p.vx *= -0.8 }
      if (p.y < 0) { p.y = 0; p.vy *= -0.8 }
      if (p.y > h) { p.y = h; p.vy *= -0.8 }
    }

    const draw = () => {
      const { w, h, dust, nodes, time } = state
      const { connectionDistance: conn, mouseRadius: mRadius } = cfgRef.current
      const connSq = conn * conn
      const mSq = mRadius * mRadius
      const mx = mouseRef?.current?.x ?? -9999
      const my = mouseRef?.current?.y ?? -9999
      const mouseOn = mouseRef?.current?.active && mRadius > 0

      ctx.clearRect(0, 0, w, h)

      // ── Network lines (animated pulse along connections) ──
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        applyMouse(a)
        integrate(a, w, h)

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < connSq) {
            const dist = Math.sqrt(d2)
            const t = 1 - dist / conn
            const pulse = 0.5 + 0.5 * Math.sin(time * 0.002 + a.phase + b.phase)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(56, 189, 248, ${t * 0.22 * pulse})`
            ctx.lineWidth = 0.5 + t * 0.4
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // ── Network nodes ──
      for (const n of nodes) {
        const nearMouse = mouseOn && (n.x - mx) ** 2 + (n.y - my) ** 2 < mSq
        ctx.beginPath()
        ctx.fillStyle = nearMouse ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 184, 0.65)'
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()

        if (nearMouse) {
          ctx.beginPath()
          ctx.fillStyle = 'rgba(37, 99, 235, 0.35)'
          ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── Glowing dust particles ──
      for (const d of dust) {
        applyMouse(d)
        integrate(d, w, h)

        const pulse = d.opacity * (0.7 + 0.3 * Math.sin(time * d.pulse + d.phase))
        const isBlue = d.phase > Math.PI

        ctx.save()
        ctx.shadowBlur = d.size * 4
        ctx.shadowColor = isBlue ? 'rgba(37, 99, 235, 0.9)' : 'rgba(56, 189, 248, 0.9)'
        ctx.beginPath()
        ctx.fillStyle = isBlue
          ? `rgba(37, 99, 235, ${pulse})`
          : `rgba(56, 189, 248, ${pulse})`
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const loop = () => {
      if (!activeRef.current) {
        state.raf = 0
        ctx.clearRect(0, 0, state.w, state.h)
        return
      }
      state.time += 1
      draw()
      state.raf = requestAnimationFrame(loop)
    }

    const ensureLoop = () => {
      if (activeRef.current && !state.raf) state.raf = requestAnimationFrame(loop)
    }

    apiRef.current = { resize: () => resize(true), ensureLoop }

    const onResize = () => resize(false)
    resize(true)
    window.addEventListener('resize', onResize, { passive: true })
    ensureLoop()

    return () => {
      cancelAnimationFrame(state.raf)
      state.raf = 0
      window.removeEventListener('resize', onResize)
      apiRef.current = null
    }
  }, [mouseRef])

  useEffect(() => {
    apiRef.current?.resize()
  }, [dustCount, networkNodes, maxDpr])

  useEffect(() => {
    if (active) apiRef.current?.ensureLoop()
  }, [active])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
