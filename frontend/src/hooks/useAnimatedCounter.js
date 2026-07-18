import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useAnimatedCounter({
  target,
  suffix = '',
  duration = 1.6,
  triggerRef,
  active = true,
  decimals = 0,
}) {
  const [display, setDisplay] = useState(0)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    const node = triggerRef?.current
    if (!node || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(target)
      return undefined
    }

    obj.current.val = 0
    setDisplay(0)

    const ctx = gsap.context(() => {
      gsap.to(obj.current, {
        val: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: () => {
          const v = obj.current.val
          setDisplay(decimals ? Math.round(v * 10) / 10 : Math.round(v))
        },
      })
    }, node)

    return () => ctx.revert()
  }, [target, suffix, duration, triggerRef, active, decimals])

  return `${display}${suffix}`
}

export function useAnimatedProgress({ target, triggerRef, active = true }) {
  const [width, setWidth] = useState(0)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    const node = triggerRef?.current
    if (!node || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setWidth(target)
      return undefined
    }

    obj.current.val = 0
    setWidth(0)

    const ctx = gsap.context(() => {
      gsap.to(obj.current, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: () => setWidth(Math.round(obj.current.val)),
      })
    }, node)

    return () => ctx.revert()
  }, [target, triggerRef, active])

  return width
}
