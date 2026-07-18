import { useEffect, useRef } from 'react'

/**
 * Premium card interaction — 3D tilt, magnetic pull, and spotlight in one rAF loop.
 * Loop runs only while hovering or settling.
 */
export function useCardInteraction(ref, { enabled = true, tilt = 10, magnetic = 14 } = {}) {
  const state = useRef({
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    rx: 0,
    ry: 0,
    spotX: 50,
    spotY: 50,
    hovering: false,
  })

  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const isTouch = window.matchMedia('(hover: none)').matches
    if (isTouch) return undefined

    const s = state.current
    let raf = 0

    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onEnter = () => {
      s.hovering = true
      start()
    }

    const onLeave = () => {
      s.hovering = false
      s.tx = 0
      s.ty = 0
      s.rx = 0
      s.ry = 0
      s.spotX = 50
      s.spotY = 50
      start()
    }

    const onMove = (e) => {
      const rect = node.getBoundingClientRect()
      s.px = e.clientX - rect.left
      s.py = e.clientY - rect.top
      const nx = (s.px / rect.width - 0.5) * 2
      const ny = (s.py / rect.height - 0.5) * 2
      s.tx = nx * magnetic
      s.ty = ny * magnetic
      s.rx = -ny * tilt
      s.ry = nx * tilt
      s.spotX = (s.px / rect.width) * 100
      s.spotY = (s.py / rect.height) * 100
      start()
    }

    const tick = () => {
      const inner = node.querySelector('[data-card-inner]')
      const spotlight = node.querySelector('[data-card-spotlight]')
      const magneticEl = node.querySelector('[data-card-magnetic]')

      let settled = !s.hovering

      if (inner) {
        const curRx = parseFloat(inner.dataset.rx || '0')
        const curRy = parseFloat(inner.dataset.ry || '0')
        const curMx = parseFloat(magneticEl?.dataset.mx || '0')
        const curMy = parseFloat(magneticEl?.dataset.my || '0')

        const lerp = s.hovering ? 0.12 : 0.1
        const nrx = curRx + ((s.hovering ? s.rx : 0) - curRx) * lerp
        const nry = curRy + ((s.hovering ? s.ry : 0) - curRy) * lerp
        const nmx = curMx + ((s.hovering ? s.tx : 0) - curMx) * lerp
        const nmy = curMy + ((s.hovering ? s.ty : 0) - curMy) * lerp

        inner.dataset.rx = String(nrx)
        inner.dataset.ry = String(nry)
        inner.style.transform = `rotateX(${nrx}deg) rotateY(${nry}deg) translateZ(0)`

        if (magneticEl) {
          magneticEl.dataset.mx = String(nmx)
          magneticEl.dataset.my = String(nmy)
          magneticEl.style.transform = `translate3d(${nmx}px, ${nmy}px, 0)`
        }

        settled =
          !s.hovering &&
          Math.abs(nrx) < 0.05 &&
          Math.abs(nry) < 0.05 &&
          Math.abs(nmx) < 0.05 &&
          Math.abs(nmy) < 0.05
      }

      if (spotlight) {
        const sx = s.hovering ? s.spotX : 50
        const sy = s.hovering ? s.spotY : 50
        spotlight.style.background = `radial-gradient(280px circle at ${sx}% ${sy}%, rgba(56, 189, 248, 0.14), rgba(37, 99, 235, 0.06) 40%, transparent 70%)`
        spotlight.style.opacity = s.hovering ? '1' : '0'
      }

      if (settled) {
        stop()
        return
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    node.addEventListener('pointerenter', onEnter)
    node.addEventListener('pointerleave', onLeave)
    node.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      node.removeEventListener('pointerenter', onEnter)
      node.removeEventListener('pointerleave', onLeave)
      node.removeEventListener('pointermove', onMove)
      stop()
    }
  }, [ref, enabled, tilt, magnetic])
}
