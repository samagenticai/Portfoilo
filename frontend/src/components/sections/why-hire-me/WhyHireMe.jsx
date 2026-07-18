import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURES } from '../../../constants/features'
import { useInView } from '../../../hooks/useInView'
import Container from '../../ui/Container'
import FeatureCard from '../../ui/FeatureCard'
import SectionHeader from '../../ui/SectionHeader'
import WhyHireMeBackground from './WhyHireMeBackground'

gsap.registerPlugin(ScrollTrigger)

export default function WhyHireMe() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const inView = useInView(sectionRef, { rootMargin: '80px', threshold: 0.05 })

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const headerItems = headerRef.current?.querySelectorAll('[data-reveal-header]') ?? []
      const cards = gridRef.current?.querySelectorAll('[data-feature-card]') ?? []

      if (reduced) {
        gsap.set([...headerItems, ...cards], { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.set(headerItems, { opacity: 0, y: 32 })
      gsap.set(cards, { opacity: 0, y: 48, scale: 0.96 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(headerItems, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
      }).to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.4',
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-hire-me"
      className="section-padding relative overflow-hidden scroll-mt-24"
      aria-labelledby="why-hire-me-title"
    >
      <WhyHireMeBackground active={inView} />

      <Container className="relative z-10">
        <SectionHeader
          headerRef={headerRef}
          eyebrow="What I Offer"
          title="Why Hire Me"
          titleId="why-hire-me-title"
          description="I build fast, scalable, responsive and user-focused web applications using the MERN Stack."
        />

        <div
          ref={gridRef}
          className="grid grid-cols-1 items-stretch gap-[var(--spacing-grid)] sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {FEATURES.map((feature) => (
            <div key={feature.id} role="listitem" className="flex h-full">
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                accent={feature.accent}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
