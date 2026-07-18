import { lazy, Suspense } from 'react'
import { Hero } from '../components/sections/hero'
import { WhyHireMe } from '../components/sections/why-hire-me'
import { Skills } from '../components/sections/skills'
import SeoHead from '../components/seo/SeoHead'
import { usePortfolio } from '../context/PortfolioContext'
import { PAGE_SEO } from '../constants/seo'
import { buildPortfolioJsonLd } from '../lib/structuredData'
import { absoluteUrl } from '../constants/seo'
import { usePublicProjects } from '../hooks/usePublicProjects'

const DeveloperJourney = lazy(() =>
  import('../components/sections/developer-journey/DeveloperJourney'),
)
const FeaturedProjects = lazy(() =>
  import('../components/sections/projects/FeaturedProjects'),
)
const DevelopmentProcess = lazy(() =>
  import('../components/sections/development-process/DevelopmentProcess'),
)
const Contact = lazy(() => import('../components/sections/contact/Contact'))

function SectionFallback() {
  return <div className="min-h-[40vh]" aria-hidden="true" />
}

export default function Home() {
  const seo = PAGE_SEO.home
  const { profile } = usePortfolio()
  const { projects } = usePublicProjects()

  const jsonLd = buildPortfolioJsonLd({
    profile,
    projects,
    pageUrl: absoluteUrl('/'),
    pageName: seo.title,
    pageDescription: seo.description,
  })

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={seo.path} jsonLd={jsonLd} />
      <Hero />
      <WhyHireMe />
      <Skills />
      <Suspense fallback={<SectionFallback />}>
        <DeveloperJourney />
        <FeaturedProjects />
        <DevelopmentProcess />
        <Contact />
      </Suspense>
    </>
  )
}
