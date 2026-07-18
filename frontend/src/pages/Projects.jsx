import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../lib/cn'
import { usePublicProjects } from '../hooks/usePublicProjects'
import SeoHead from '../components/seo/SeoHead'
import { PAGE_SEO, absoluteUrl } from '../constants/seo'
import { buildPortfolioJsonLd } from '../lib/structuredData'
import { usePortfolio } from '../context/PortfolioContext'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import AppIcon from '../components/ui/AppIcon'
import MagneticButton from '../components/sections/projects/MagneticButton'
import ProjectExhibit from '../components/sections/projects/ProjectExhibit'
import ProjectsBackground from '../components/sections/projects/ProjectsBackground'
import {
  ProjectExhibitSkeleton,
  ProjectsEmptyState,
  ProjectsErrorState,
} from '../components/sections/projects/ProjectsFetchStates'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { projects, loading, error, reload } = usePublicProjects()
  const { profile } = usePortfolio()
  const active = projects[activeIndex]
  const seo = PAGE_SEO.projects

  const jsonLd = buildPortfolioJsonLd({
    profile,
    projects,
    pageUrl: absoluteUrl('/projects'),
    pageName: seo.title,
    pageDescription: seo.description,
  })

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || loading) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headerItems = headerRef.current?.querySelectorAll('[data-reveal-header]') ?? []

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(headerItems, { opacity: 1, y: 0 })
        return
      }

      gsap.set(headerItems, { opacity: 0, y: 32 })
      gsap.to(headerItems, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [loading, projects.length])

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={seo.path} jsonLd={jsonLd} />
      <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden scroll-mt-24 pt-28 sm:pt-32"
      aria-labelledby="all-projects-title"
    >
      <ProjectsBackground sectionRef={sectionRef} />

      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br blur-[100px] transition-all duration-1000',
          'opacity-25',
          active?.accent,
        )}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="mb-8">
          <MagneticButton
            as={Link}
            to="/#projects"
            variant="outline"
            size="sm"
            className="text-muted"
          >
            <AppIcon name="arrow-left" size={16} className="!text-inherit" />
            Back to Home
          </MagneticButton>
        </div>

        <SectionHeader
          headerRef={headerRef}
          eyebrow="Full Archive"
          title="All Projects"
          titleAs="h1"
          titleId="all-projects-title"
          description="Every application I've built — presented as independent floating product exhibits with full technical depth."
        />

        {loading ? (
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-6" aria-busy="true" aria-label="Loading projects">
            <ProjectExhibitSkeleton />
            <ProjectExhibitSkeleton />
            <ProjectExhibitSkeleton />
          </div>
        ) : error ? (
          <ProjectsErrorState message={error} onRetry={reload} />
        ) : projects.length === 0 ? (
          <ProjectsEmptyState
            title="No published projects yet"
            description="Create and publish a project from the Admin Dashboard. It will appear here automatically."
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
      </Container>
    </section>
    </>
  )
}
