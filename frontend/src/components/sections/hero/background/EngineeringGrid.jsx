import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '../../../../lib/cn'

export default function EngineeringGrid({ opacity = 0.04, active = true, className }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const node = gridRef.current
    if (!node || !active) return undefined

    const ctx = gsap.context(() => {
      gsap.to(node, {
        backgroundPosition: '72px 72px',
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    }, node)

    return () => ctx.revert()
  }, [active])

  useEffect(() => {
    const node = gridRef.current
    if (!node) return
    gsap.getTweensOf(node).forEach((t) => {
      if (active) t.play()
      else t.pause()
    })
  }, [active])

  return (
    <div
      ref={gridRef}
      className={cn('hero-engineering-grid absolute inset-[-6%]', className)}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
