import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROCESS_PHILOSOPHY } from '../../../constants/process'
import { useInView } from '../../../hooks/useInView'
import Container from '../../ui/Container'
import SectionHeader from '../../ui/SectionHeader'
import AppIcon from '../../ui/AppIcon'
import ProcessBackground from './ProcessBackground'
import ProcessDesktop from './ProcessDesktop'
import ProcessMobile from './ProcessMobile'

gsap.registerPlugin(ScrollTrigger)

export default function DevelopmentProcess() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const flowRef = useRef(null)
  const footerRef = useRef(null)
  const inView = useInView(sectionRef, { rootMargin: '80px', threshold: 0.04 })

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headerItems = headerRef.current?.querySelectorAll('[data-reveal-header]') ?? []
    const steps = flowRef.current?.querySelectorAll('[data-process-step]') ?? []
    const footer = footerRef.current

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([...headerItems, ...steps, footer], { opacity: 1, y: 0, clearProps: 'all' })
        return
      }

      gsap.set(headerItems, { opacity: 0, y: 28 })
      gsap.set(steps, { opacity: 0, y: 40 })
      if (footer) gsap.set(footer, { opacity: 0, y: 24 })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        })
        .to(headerItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
        })

      steps.forEach((step, i) => {
        gsap.to(step, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          delay: Math.min(i * 0.02, 0.1),
        })
      })

      if (footer) {
        gsap.to(footer, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      // Draw path when section enters
      const path = section.querySelector('.process-path-line')
      if (path && path.getTotalLength) {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: flowRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  // Pause infinite dash when off-screen via CSS class
  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-padding relative overflow-hidden scroll-mt-24"
      aria-labelledby="process-title"
      data-process-active={inView || undefined}
    >
      <ProcessBackground sectionRef={sectionRef} />

      <Container className="relative z-10">
        <SectionHeader
          headerRef={headerRef}
          eyebrow="How I Work"
          title="Development Process"
          titleId="process-title"
          description="A deliberate workflow from research to production — how I plan, build, ship, and refine software with professional discipline."
        />

        <div ref={flowRef}>
          <ProcessDesktop />
          <ProcessMobile />
        </div>

        <div
          ref={footerRef}
          className="mx-auto mt-12 max-w-2xl text-center sm:mt-14"
        >
          <div className="feature-card-border inline-flex max-w-full items-start gap-3 rounded-2xl p-px sm:items-center">
            <div className="glass-card flex max-w-full items-start gap-3 rounded-[calc(1rem-1px)] border border-white/10 bg-white/[0.03] px-5 py-4 text-left backdrop-blur-md sm:items-center sm:px-6 sm:py-5 sm:text-center">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-primary/10 sm:mt-0">
                <AppIcon name="sparkles" size={18} />
              </span>
              <p className="text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                {PROCESS_PHILOSOPHY}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
