import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { DEFAULT_AUTHOR, SITE_NAME } from '../../../constants/seo'
import { usePortfolio } from '../../../context/PortfolioContext'
import LiquidFloatContent from './LiquidFloatContent'
import AnimatedTitle from './AnimatedTitle'
import HeroCTA from './HeroCTA'
import { DeveloperDashboard } from './dashboard'
import { HeroBackground } from './background'
import ScrollIndicator from './ScrollIndicator'

export default function Hero() {
  const sectionRef = useRef(null)
  const visualRef = useRef(null)
  const scrollRef = useRef(null)
  const { profile } = usePortfolio()

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([visualRef.current, scrollRef.current], { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.set(visualRef.current, { opacity: 0, scale: 0.94, y: 16 })
      gsap.set(scrollRef.current, { opacity: 0, y: 12 })

      gsap
        .timeline({ defaults: { ease: 'power3.out' }, delay: 0.35 })
        .to(visualRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.95,
          ease: 'power2.out',
        })
        .to(
          scrollRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          '-=0.35',
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-dvh flex-col overflow-hidden pt-16 lg:pt-20"
      aria-labelledby="hero-name"
    >
      <HeroBackground sectionRef={sectionRef} />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-[var(--spacing-container)] py-10 sm:py-12 lg:py-14">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <LiquidFloatContent className="order-1 text-center lg:text-left">
            <p
              data-liquid-line
              data-depth="0.55"
              className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-secondary will-change-transform sm:text-base"
            >
              {SITE_NAME}
            </p>

            <h1
              id="hero-name"
              data-liquid-line
              data-depth="1"
              className="text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text will-change-transform"
            >
              Hello, I&apos;m{' '}
              <span className="block sm:inline">{profile?.fullName || DEFAULT_AUTHOR}</span>
            </h1>

            <div
              data-liquid-line
              data-depth="0.85"
              className="mt-4 will-change-transform sm:mt-5"
            >
              <AnimatedTitle titles={profile?.animatedTitles} />
            </div>

            <p
              data-liquid-line
              data-depth="0.7"
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted will-change-transform sm:mt-6 sm:text-lg lg:mx-0"
            >
              {profile?.heroDescription ||
                'I craft scalable full-stack applications with the MERN stack — clean architecture, polished interfaces, and performance that feels effortless.'}
            </p>

            <div
              data-liquid-line
              data-depth="0.9"
              className="mt-8 flex flex-col items-center gap-3 will-change-transform sm:mt-10 sm:flex-row sm:justify-center lg:justify-start"
            >
              <HeroCTA href="#projects" variant="primary">
                View Projects
              </HeroCTA>
              <HeroCTA href="#contact" variant="outline">
                Contact Me
              </HeroCTA>
            </div>
          </LiquidFloatContent>

          <div ref={visualRef} className="order-2 flex w-full justify-center lg:justify-end">
            <DeveloperDashboard active />
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="relative z-10 flex justify-center pb-6 sm:pb-8">
        <ScrollIndicator href="#why-hire-me" />
      </div>
    </section>
  )
}
