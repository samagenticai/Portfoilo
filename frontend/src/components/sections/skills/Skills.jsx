import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePortfolio } from '../../../context/PortfolioContext'
import { useInView } from '../../../hooks/useInView'
import Button from '../../ui/Button'
import Container from '../../ui/Container'
import Heading from '../../ui/Heading'
import MernOrbit from './MernOrbit'
import SkillsDeveloperPanel from './panel/SkillsDeveloperPanel'
import SkillsBackground from './SkillsBackground'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const sectionRef = useRef(null)
  const introRef = useRef(null)
  const panelRef = useRef(null)
  const inView = useInView(sectionRef, { rootMargin: '80px', threshold: 0.05 })
  const { profile, orbit, proficiency, loading } = usePortfolio()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const introItems = introRef.current?.querySelectorAll('[data-reveal]') ?? []
      const orbit = section.querySelector('[data-mern-orbit]')
      const panel = panelRef.current

      if (reduced) {
        gsap.set([...introItems, orbit, panel], { opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.set(introItems, { opacity: 0, y: 36 })
      gsap.set(orbit, { opacity: 0, scale: 0.9 })
      if (panel) gsap.set(panel, { opacity: 0, y: 40 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(introItems, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
      })
        .to(
          orbit,
          { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.45',
        )
        .to(
          panel,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.35',
        )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section-padding relative overflow-hidden scroll-mt-24"
      aria-labelledby="skills-title"
    >
      <SkillsBackground sectionRef={sectionRef} />

      <Container className="relative z-10">
        <div className="mb-[var(--spacing-section-header)] grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div ref={introRef} className="text-center lg:text-left">
            <p
              data-reveal
              className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-secondary"
            >
              Tech Stack
            </p>
            <Heading as="h2" id="skills-title" data-reveal gradient className="mb-4">
              {profile?.skillsHeading || 'Technologies I Use to Build Modern Web Applications'}
            </Heading>
            <p data-reveal className="text-base leading-relaxed text-muted sm:text-lg">
              {profile?.skillsDescription ||
                'I specialize in building fast, scalable and responsive web applications using the MERN Stack and modern frontend technologies.'}
            </p>
            <p data-reveal className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
              {profile?.skillsDescription2 ||
                'I focus on writing clean code, creating exceptional user experiences and delivering production-ready applications.'}
            </p>
            <div data-reveal className="mt-8">
              <Button as="a" href="#projects" variant="primary" size="lg" className="w-full sm:w-auto">
                View My Projects
              </Button>
            </div>
          </div>

          <MernOrbit items={loading ? [] : orbit} />
        </div>

        <div ref={panelRef} className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <SkillsDeveloperPanel active={inView} proficiency={proficiency} profile={profile} />
        </div>
      </Container>
    </section>
  )
}
