import { useEffect, useRef } from 'react'
import { getMagneticSettings } from './getMagneticSettings'

/**
 * Smooth magnetic pull — transform runs on a wrapper element via rAF.
 * Disabled for touch/reduced motion; intensity scales by device tier.
 */
export function useMagneticElement(ref, options = {}) {
  const {
    enabled = true,
    strength: strengthOption,
    maxOffset: maxOffsetOption,
    ease: easeOption,
  } = options

  const settingsRef = useRef(getMagneticSettings())

  useEffect(() => {
    const node = ref?.current
    if (!node || !enabled) return undefined

    settingsRef.current = getMagneticSettings()
    const settings = settingsRef.current
    if (!settings.enabled) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none)').matches
    if (reduced || touch) return undefined

    const strength = strengthOption ?? settings.strength
    const maxOffset = maxOffsetOption ?? settings.maxOffset
    const ease = easeOption ?? settings.ease

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let hovering = false
    let rafId = 0
    let lastFrame = 0
    let rect = node.getBoundingClientRect()

    node.style.willChange = 'transform'

    const updateRect = () => {
      if (!node) return
      rect = node.getBoundingClientRect()
    }

    const applyTransform = () => {
      if (!node) return
      node.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
    }

    const resetTransform = () => {
      if (!node) return
      current.x = 0
      current.y = 0
      target.x = 0
      target.y = 0
      node.style.transform = ''
    }

    const stopLoop = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      lastFrame = 0
    }

    const tick = (timestamp) => {
      if (!node) {
        stopLoop()
        return
      }

      const dt = lastFrame ? Math.min(32, timestamp - lastFrame) / 16.667 : 1
      lastFrame = timestamp

      const factor = 1 - (1 - ease) ** dt
      current.x += (target.x - current.x) * factor
      current.y += (target.y - current.y) * factor

      applyTransform()

      const settled =
        !hovering &&
        Math.abs(current.x) < 0.04 &&
        Math.abs(current.y) < 0.04

      if (settled) {
        resetTransform()
        stopLoop()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const onEnter = () => {
      hovering = true
      updateRect()
      startLoop()
    }

    const onLeave = () => {
      hovering = false
      target.x = 0
      target.y = 0
      startLoop()
    }

    const onMove = (event) => {
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      target.x = Math.max(-maxOffset, Math.min(maxOffset, dx * strength))
      target.y = Math.max(-maxOffset, Math.min(maxOffset, dy * strength))
      startLoop()
    }

    const onScrollOrResize = () => {
      if (hovering) updateRect()
    }

    node.addEventListener('pointerenter', onEnter)
    node.addEventListener('pointerleave', onLeave)
    node.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })

    return () => {
      node.removeEventListener('pointerenter', onEnter)
      node.removeEventListener('pointerleave', onLeave)
      node.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      stopLoop()
      if (node) {
        node.style.willChange = ''
        node.style.transform = ''
      }
    }
  }, [ref, enabled, strengthOption, maxOffsetOption, easeOption])
}
