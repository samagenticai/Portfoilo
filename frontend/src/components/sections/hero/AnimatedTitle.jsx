import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { cn } from '../../../lib/cn'

const DEFAULT_TITLES = [
  'React Developer',
  'Node.js Developer',
  'MERN Stack Developer',
  'Full Stack Developer',
]

const HOLD_MS = 2800

/** Soft dissolve morph between roles — no typing blink */
export default function AnimatedTitle({ titles = DEFAULT_TITLES, className }) {
  const wrapRef = useRef(null)
  const textRef = useRef(null)
  const indexRef = useRef(0)
  const roleTitles = useMemo(
    () => (titles?.length ? titles : DEFAULT_TITLES),
    [titles],
  )
  const [display, setDisplay] = useState(roleTitles[0])
  const [reduced, setReduced] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    if (mq.matches) {
      setDisplay(roleTitles[0])
      return undefined
    }

    const node = textRef.current
    if (!node) return undefined

    let timeout = 0
    const ctx = gsap.context(() => {
      const cycle = () => {
        const next = (indexRef.current + 1) % roleTitles.length
        gsap.to(node, {
          opacity: 0,
          filter: 'blur(8px)',
          y: -5,
          duration: 0.55,
          ease: 'power2.inOut',
          onComplete: () => {
            indexRef.current = next
            setDisplay(roleTitles[next])
            gsap.fromTo(
              node,
              { opacity: 0, filter: 'blur(8px)', y: 7 },
              {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                duration: 0.65,
                ease: 'power3.out',
                onComplete: () => {
                  timeout = window.setTimeout(cycle, HOLD_MS)
                },
              },
            )
          },
        })
      }

      timeout = window.setTimeout(cycle, HOLD_MS + 1200)
    }, wrapRef)

    return () => {
      window.clearTimeout(timeout)
      ctx.revert()
    }
  }, [roleTitles])

  if (reduced) {
    return (
      <p className={cn('text-gradient text-xl font-semibold sm:text-2xl lg:text-3xl', className)}>
        {roleTitles[0]}
      </p>
    )
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        'relative flex h-[1.45em] items-center justify-center overflow-visible lg:justify-start',
        'text-xl font-semibold sm:text-2xl lg:text-3xl',
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <p ref={textRef} className="hero-role-text text-gradient will-change-[opacity,filter,transform]">
        {display}
      </p>
      <span className="pointer-events-none invisible absolute" aria-hidden="true">
        Full Stack Developer
      </span>
    </div>
  )
}
