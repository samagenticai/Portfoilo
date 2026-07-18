import { useEffect, useRef, useState } from 'react'

export function useAnimatedMetric({ min, max, interval = 2200, active = true, suffix = '' }) {
  const [display, setDisplay] = useState(min)
  const valueRef = useRef(min)

  useEffect(() => {
    if (!active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(Math.round((min + max) / 2))
      return undefined
    }

    let raf = 0
    let target = min + Math.random() * (max - min)
    let timeout = 0

    const lerp = () => {
      const current = valueRef.current
      const next = current + (target - current) * 0.08
      valueRef.current = next
      setDisplay(suffix === 'ms' ? Math.round(next) : Math.round(next * 10) / 10)
      raf = requestAnimationFrame(lerp)
    }

    raf = requestAnimationFrame(lerp)

    const pickTarget = () => {
      target = min + Math.random() * (max - min)
      timeout = window.setTimeout(pickTarget, interval + Math.random() * 800)
    }

    timeout = window.setTimeout(pickTarget, interval)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
    }
  }, [min, max, interval, active, suffix])

  if (suffix === '%') return `${display}%`
  if (suffix === 'ms') return `${display}ms`
  return String(display)
}
