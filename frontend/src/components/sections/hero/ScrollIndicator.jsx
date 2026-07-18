import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '../../../lib/cn'

/** Floating glass mouse — glowing dot descends continuously */
export default function ScrollIndicator({ className, href = '#why-hire-me' }) {
  const rootRef = useRef(null)
  const dotRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    if (!root || !dot) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const ctx = gsap.context(() => {
      gsap.to(root, {
        y: 8,
        duration: 2.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      gsap.fromTo(
        dot,
        { y: 0, opacity: 0.95 },
        {
          y: 18,
          opacity: 0.15,
          duration: 1.55,
          ease: 'power1.inOut',
          repeat: -1,
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <a
      ref={rootRef}
      href={href}
      className={cn(
        'hero-scroll-indicator group inline-flex flex-col items-center gap-2.5 text-muted',
        'transition-colors duration-300 hover:text-text',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl',
        className,
      )}
      aria-label="Scroll to next section"
    >
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em]">Scroll</span>
      <span
        className={cn(
          'hero-scroll-mouse relative flex h-12 w-7 items-start justify-center rounded-[1.1rem]',
          'border border-white/15 bg-white/[0.04] pt-2.5 backdrop-blur-xl',
          'transition-all duration-300',
          'group-hover:border-secondary/35 group-hover:bg-white/[0.07]',
        )}
        aria-hidden="true"
      >
        <span
          ref={dotRef}
          className="block h-2 w-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(56,189,248,0.85)]"
        />
      </span>
    </a>
  )
}
