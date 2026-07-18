import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JOURNEY_MILESTONES } from '../../../constants/journey'
import JourneyCheckpoint from './JourneyCheckpoint'

gsap.registerPlugin(ScrollTrigger)

export default function JourneyRoadmap() {
  const rootRef = useRef(null)
  const lineRef = useRef(null)
  const glowRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const line = lineRef.current
    const glow = glowRef.current
    if (!root || !line) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(line, { scaleY: 1 })
      if (glow) gsap.set(glow, { opacity: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.set(line, { scaleY: 0, transformOrigin: 'top center' })
      if (glow) gsap.set(glow, { opacity: 0.3 })

      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.6,
        },
      })

      if (glow) {
        gsap.to(glow, {
          opacity: 1,
          scrollTrigger: {
            trigger: root,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 0.6,
          },
        })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative" aria-label="Developer journey roadmap">
      <div className="absolute bottom-2 left-[17px] top-2 w-px overflow-hidden sm:left-[19px] lg:left-[21px]" aria-hidden="true">
        <div className="absolute inset-0 bg-white/[0.08]" />
        <div
          ref={lineRef}
          className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary"
        />
        <div
          ref={glowRef}
          className="absolute inset-0 bg-gradient-to-b from-primary/60 via-secondary/60 to-primary/60 blur-sm"
        />
      </div>

      <ol className="relative space-y-0">
        {JOURNEY_MILESTONES.map((milestone, index) => (
          <JourneyCheckpoint
            key={milestone.id}
            milestone={milestone}
            index={index}
            isLast={index === JOURNEY_MILESTONES.length - 1}
          />
        ))}
      </ol>
    </div>
  )
}
