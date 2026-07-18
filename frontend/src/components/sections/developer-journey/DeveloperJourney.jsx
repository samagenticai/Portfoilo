import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from '../../../hooks/useInView'
import Container from '../../ui/Container'
import SectionHeader from '../../ui/SectionHeader'
import AchievementField from './AchievementField'
import CurrentMission from './CurrentMission'
import JourneyBackground from './JourneyBackground'
import JourneyRoadmap from './JourneyRoadmap'

gsap.registerPlugin(ScrollTrigger)

export default function DeveloperJourney() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const mainRef = useRef(null)
  const missionRef = useRef(null)
  const inView = useInView(sectionRef, { rootMargin: '80px', threshold: 0.05 })

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const headerItems = headerRef.current?.querySelectorAll('[data-reveal-header]') ?? []
      const mainItems = mainRef.current?.querySelectorAll('[data-journey-main]') ?? []
      const mission = missionRef.current

      if (reduced) {
        gsap.set([...headerItems, ...mainItems, mission], { opacity: 1, y: 0 })
        return
      }

      gsap.set(headerItems, { opacity: 0, y: 32 })
      gsap.set(mainItems, { opacity: 0, y: 40 })
      if (mission) gsap.set(mission, { opacity: 0, y: 48 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(headerItems, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
      })
        .to(
          mainItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.4',
        )
        .to(
          mission,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
          },
          '-=0.35',
        )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="section-padding relative overflow-hidden scroll-mt-24"
      aria-labelledby="journey-title"
    >
      <JourneyBackground sectionRef={sectionRef} />

      <Container className="relative z-10">
        <SectionHeader
          headerRef={headerRef}
          eyebrow="My Path"
          title="Developer Journey"
          titleId="journey-title"
          description="An interactive roadmap of how I grew from curious beginner to production-ready MERN developer — and where I'm headed next."
        />

        <div
          ref={mainRef}
          className="mb-10 grid items-start gap-8 sm:mb-12 sm:gap-10 lg:mb-[var(--spacing-section-header)] lg:grid-cols-12 lg:gap-8 xl:gap-10"
        >
          <div data-journey-main className="min-w-0 lg:col-span-5 xl:col-span-5">
            <div className="mb-5 sm:mb-6 lg:mb-6">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                Roadmap
              </p>
              <h3 className="mt-1 text-base font-bold text-text sm:text-lg lg:text-xl">Milestones</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                Scroll to trace the path — each checkpoint lights up as your journey unfolds.
              </p>
            </div>
            <JourneyRoadmap />
          </div>

          <div data-journey-main className="min-w-0 overflow-x-hidden lg:col-span-7 xl:col-span-7">
            <div className="mb-5 lg:mb-0 lg:hidden">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                Achievements
              </p>
              <h3 className="mt-1 text-base font-bold text-text sm:text-lg">What I&apos;ve Built</h3>
            </div>
            <div className="mb-4 hidden lg:block">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                Achievements
              </p>
              <h3 className="mt-1 text-lg font-bold text-text sm:text-xl">Floating Milestones</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Premium panels scattered across the journey — each unique, each earned.
              </p>
            </div>
            <AchievementField />
          </div>
        </div>

        <div ref={missionRef}>
          <CurrentMission active={inView} />
        </div>
      </Container>
    </section>
  )
}
