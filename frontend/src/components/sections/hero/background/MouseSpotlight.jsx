import { useEffect, useRef } from 'react'
import { cn } from '../../../../lib/cn'

export default function MouseSpotlight({ mouseRef, active = true, className }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    const node = ref.current
    let raf = 0

    const tick = () => {
      if (node && mouseRef?.current) {
        const { x, y, active: on } = mouseRef.current
        const parent = node.parentElement
        if (parent && on) {
          const rect = parent.getBoundingClientRect()
          const px = (x / rect.width) * 100
          const py = (y / rect.height) * 100
          node.style.background = `radial-gradient(520px circle at ${px}% ${py}%, rgba(56, 189, 248, 0.07), rgba(37, 99, 235, 0.03) 40%, transparent 68%)`
        } else {
          node.style.background =
            'radial-gradient(520px circle at 50% 45%, rgba(56, 189, 248, 0.04), transparent 65%)'
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, mouseRef])

  if (!active) return null

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none absolute inset-0', className)}
      aria-hidden="true"
    />
  )
}
