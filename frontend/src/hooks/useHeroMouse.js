import { useEffect, useRef } from 'react'

/**
 * Smoothed mouse position relative to a target element.
 * Returns ref: { x, y, nx, ny, active } — pixel coords + normalized -0.5…0.5.
 * Stops rAF when section is inactive and settled.
 */
export function useHeroMouse(targetRef, { enabled = true, ease = 0.07, active = true } = {}) {
  const raw = useRef({ x: 0, y: 0, active: false })
  const smooth = useRef({ x: 0, y: 0, nx: 0, ny: 0, active: false })

  useEffect(() => {
    if (!enabled) {
      raw.current = { x: 0, y: 0, active: false }
      smooth.current = { x: 0, y: 0, nx: 0, ny: 0, active: false }
      return undefined
    }

    let raf = 0

    const onMove = (e) => {
      const node = targetRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      raw.current.x = e.clientX - rect.left
      raw.current.y = e.clientY - rect.top
      raw.current.active = true
      start()
    }

    const onLeave = () => {
      raw.current.active = false
      start()
    }

    const tick = () => {
      const node = targetRef.current
      const w = node?.offsetWidth || 1
      const h = node?.offsetHeight || 1
      const cx = w * 0.5
      const cy = h * 0.5

      if (active) {
        if (raw.current.active) {
          smooth.current.x += (raw.current.x - smooth.current.x) * ease
          smooth.current.y += (raw.current.y - smooth.current.y) * ease
          smooth.current.active = true
        } else {
          smooth.current.x += (cx - smooth.current.x) * ease * 0.6
          smooth.current.y += (cy - smooth.current.y) * ease * 0.6
          if (Math.abs(smooth.current.x - cx) < 1) smooth.current.active = false
        }

        smooth.current.nx = smooth.current.x / w - 0.5
        smooth.current.ny = smooth.current.y / h - 0.5
        raf = requestAnimationFrame(tick)
        return
      }

      smooth.current.x += (cx - smooth.current.x) * ease
      smooth.current.y += (cy - smooth.current.y) * ease
      smooth.current.nx = smooth.current.x / w - 0.5
      smooth.current.ny = smooth.current.y / h - 0.5
      smooth.current.active = false

      const settled = Math.abs(smooth.current.x - cx) < 0.5 && Math.abs(smooth.current.y - cy) < 0.5
      if (settled) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    if (active) start()

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [targetRef, enabled, ease, active])

  return smooth
}
