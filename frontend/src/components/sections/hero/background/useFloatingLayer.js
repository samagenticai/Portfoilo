import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Applies gentle mouse-push to floating DOM elements.
 * GSAP drives base drift on inner node; outer wrapper gets push offset via rAF.
 */
export function useFloatingMousePush(containerRef, active, mouseRef, { radius = 180, force = 28, ease = 0.08 } = {}) {
  const offsetsRef = useRef(new Map())

  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const wrappers = root.querySelectorAll('[data-float-wrap]')
    wrappers.forEach((el) => {
      offsetsRef.current.set(el, { px: 0, py: 0, tx: 0, ty: 0 })
    })

    let raf = 0
    const tick = () => {
      if (active && mouseRef?.current) {
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const mouseActive = mouseRef.current.active

        wrappers.forEach((el) => {
          const off = offsetsRef.current.get(el)
          if (!off) return

          if (mouseActive && radius > 0) {
            const rect = el.getBoundingClientRect()
            const rootRect = root.getBoundingClientRect()
            const cx = rect.left - rootRect.left + rect.width / 2
            const cy = rect.top - rootRect.top + rect.height / 2
            const dx = cx - mx
            const dy = cy - my
            const d2 = dx * dx + dy * dy
            const r2 = radius * radius

            if (d2 < r2 && d2 > 1) {
              const d = Math.sqrt(d2)
              const f = ((radius - d) / radius) * force
              off.tx = (dx / d) * f
              off.ty = (dy / d) * f
            } else {
              off.tx = 0
              off.ty = 0
            }
          } else {
            off.tx = 0
            off.ty = 0
          }

          off.px += (off.tx - off.px) * ease
          off.py += (off.ty - off.py) * ease
          el.style.transform = `translate3d(${off.px}px, ${off.py}px, 0)`
        })
      } else {
        wrappers.forEach((el) => {
          el.style.transform = ''
        })
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      wrappers.forEach((el) => {
        el.style.transform = ''
      })
    }
  }, [containerRef, active, mouseRef, radius, force, ease])
}

export function useFloatingDrift(containerRef, items, active) {
  useEffect(() => {
    const root = containerRef.current
    if (!root || !active || items.length === 0) return undefined

    const inners = root.querySelectorAll('[data-float-inner]')
    const ctx = gsap.context(() => {
      inners.forEach((node, i) => {
        const meta = items[i]
        if (!meta) return

        gsap.set(node, {
          x: 0,
          y: 0,
          rotation: meta.rot ?? 0,
        })

        gsap.to(node, {
          x: meta.xDrift ?? 15,
          y: meta.yDrift ?? 12,
          rotation: Math.max(-3, Math.min(3, (meta.rot ?? 0) * -1)),
          duration: meta.duration ?? 30,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    }, root)

    return () => ctx.revert()
  }, [containerRef, items, active])
}

export function usePauseFloating(containerRef, active) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    root.querySelectorAll('[data-float-inner]').forEach((node) => {
      gsap.getTweensOf(node).forEach((t) => {
        if (active) t.play()
        else t.pause()
      })
    })
  }, [containerRef, active])
}
