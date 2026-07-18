import { useEffect, useRef } from 'react'

/**
 * Smooth mouse tracking with lerp, driven by requestAnimationFrame.
 * Returns a ref: { x, y } normalized to -0.5 … 0.5 relative to the target.
 * Stops the loop when inactive and settled.
 */
export function useMouseParallax(targetRef, { enabled = true, ease = 0.06, active = true } = {}) {
  const pointer = useRef({ x: 0, y: 0 })
  const smoothed = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      pointer.current = { x: 0, y: 0 }
      smoothed.current = { x: 0, y: 0 }
      return undefined
    }

    const onMove = (event) => {
      const node = targetRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5
      pointer.current.x = Math.max(-0.5, Math.min(0.5, nx))
      pointer.current.y = Math.max(-0.5, Math.min(0.5, ny))
      start()
    }

    const onLeave = () => {
      pointer.current.x = 0
      pointer.current.y = 0
      start()
    }

    const tick = () => {
      if (active) {
        smoothed.current.x += (pointer.current.x - smoothed.current.x) * ease
        smoothed.current.y += (pointer.current.y - smoothed.current.y) * ease
      } else {
        smoothed.current.x += (0 - smoothed.current.x) * ease
        smoothed.current.y += (0 - smoothed.current.y) * ease
      }

      const settled =
        Math.abs(smoothed.current.x) < 0.001 &&
        Math.abs(smoothed.current.y) < 0.001 &&
        Math.abs(pointer.current.x) < 0.001 &&
        Math.abs(pointer.current.y) < 0.001

      if (!active && settled) {
        smoothed.current.x = 0
        smoothed.current.y = 0
        rafRef.current = 0
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    if (active) start()

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [targetRef, enabled, ease, active])

  return smoothed
}
