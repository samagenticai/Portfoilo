import { cn } from '../../lib/cn'
import Heading from './Heading'

export default function SectionHeader({
  eyebrow,
  title,
  titleId,
  titleAs = 'h2',
  description,
  className,
  headerRef,
  gradient = true,
}) {
  return (
    <div
      ref={headerRef}
      className={cn(
        'mx-auto mb-[var(--spacing-section-header)] max-w-3xl text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          data-reveal-header
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-secondary"
        >
          {eyebrow}
        </p>
      )}
      <Heading
        as={titleAs}
        id={titleId}
        data-reveal-header
        gradient={gradient}
        className="mb-4"
      >
        {title}
      </Heading>
      {description && (
        <p
          data-reveal-header
          className="text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </p>
      )}
      <div
        data-reveal-header
        className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}
