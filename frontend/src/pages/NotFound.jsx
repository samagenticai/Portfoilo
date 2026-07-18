import { Link } from 'react-router-dom'
import SeoHead from '../components/seo/SeoHead'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import { PAGE_SEO } from '../constants/seo'

export default function NotFound() {
  const seo = PAGE_SEO.notFound

  return (
    <>
      <SeoHead
        title={seo.title}
        description={seo.description}
        robots={seo.robots}
      />
      <section className="section-padding flex min-h-[70vh] items-center">
        <Container className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-secondary">404</p>
          <h1 className="text-gradient text-4xl font-bold tracking-tight sm:text-5xl">Page Not Found</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            The page you requested doesn&apos;t exist or may have moved. Head back to the Ahmad Stack homepage.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/" variant="primary" size="lg">
              Back to Home
            </Button>
            <Button as={Link} to="/projects" variant="outline" size="lg">
              View Projects
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
