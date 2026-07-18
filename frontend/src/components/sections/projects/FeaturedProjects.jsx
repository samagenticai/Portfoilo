import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../../lib/cn'
import { usePublicProjects } from '../../../hooks/usePublicProjects'
import Container from '../../ui/Container'
import SectionHeader from '../../ui/SectionHeader'
import AppIcon from '../../ui/AppIcon'
import MagneticButton from './MagneticButton'
import ProjectExhibit from './ProjectExhibit'
import ProjectsBackground from './ProjectsBackground'
import {
  ProjectExhibitSkeleton,
  ProjectsEmptyState,
  ProjectsErrorState,
} from './ProjectsFetchStates'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProjects() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const ctaRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { projects, loading, error, reload } = usePublicProjects()
  const active = projects[activeIndex]

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || loading) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headerItems = headerRef.current?.querySelectorAll('[data-reveal-header]') ?? []
    const cta = ctaRef.current

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([...headerItems, cta], { opacity: 1, y: 0 })
        return
      }

      gsap.set(headerItems, { opacity: 0, y: 32 })
      if (cta) gsap.set(cta, { opacity: 0, y: 28 })

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
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        })
        .to(
          cta,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
          },
          '-=0.35',
        )
    }, section)

    return () => ctx.revert()
  }, [loading, projects.length])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-padding relative overflow-hidden scroll-mt-24"
      aria-labelledby="projects-title"
    >
      <ProjectsBackground sectionRef={sectionRef} />

      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br blur-[100px] transition-all duration-1000',
          'opacity-20',
          active?.accent,
        )}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <SectionHeader
          headerRef={headerRef}
          eyebrow="Ahmad Stack"
          title="Featured Projects"
          titleId="projects-title"
          description="A selection of my best real-world applications built with modern technologies and production-ready architecture."
        />

        {loading ? (
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-6" aria-busy="true" aria-label="Loading featured projects">
            <ProjectExhibitSkeleton />
            <ProjectExhibitSkeleton />
          </div>
        ) : error ? (
          <ProjectsErrorState message={error} onRetry={reload} />
        ) : projects.length === 0 ? (
          <ProjectsEmptyState
            title="No published projects yet"
            description="Publish a project from the Admin Dashboard and it will appear here automatically."
          />
        ) : (
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-6">
            {projects.map((project, index) => (
              <ProjectExhibit
                key={project.id || project._id}
                project={project}
                index={index}
                onActive={setActiveIndex}
              />
            ))}
          </div>
        )}

        <div ref={ctaRef} className="mt-10 flex justify-center border-t border-white/[0.06] pt-10 sm:mt-14 sm:pt-12">
          <MagneticButton
            as={Link}
            to="/projects"
            variant="primary"
            size="lg"
            className="gallery-view-all group/cta min-h-12 min-w-[min(100%,17rem)] px-10"
          >
            View All Projects
            <AppIcon
              name="arrow-right"
              size={18}
              className="!text-inherit transition-transform duration-300 group-hover/cta:translate-x-1"
            />
          </MagneticButton>
        </div>
      </Container>
    </section>
  )
}
