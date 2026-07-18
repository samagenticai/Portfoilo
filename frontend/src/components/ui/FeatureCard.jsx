import { useRef } from 'react'
import { useCardInteraction } from '../../hooks/useCardInteraction'
import { cn } from '../../lib/cn'
import FeatureIcon from './FeatureIcon'

export default function FeatureCard({
  title,
  description,
  icon,
  accent,
  className,
}) {
  const cardRef = useRef(null)

  useCardInteraction(cardRef, { enabled: true, tilt: 8, magnetic: 12 })

  const titleId = `feature-${title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <article
      ref={cardRef}
      data-feature-card
      className={cn(
        'group/card relative h-full perspective-[1000px]',
        'focus-within:outline-none',
        className,
      )}
      aria-labelledby={titleId}
      tabIndex={0}
    >
      <div data-card-magnetic className="h-full will-change-transform">
        <div
          className="feature-card-border relative h-full rounded-[var(--radius-card)] p-px"
        >
          <div
            data-card-inner
            className={cn(
              'glass-card relative flex h-full min-h-[220px] flex-col overflow-hidden',
              'rounded-[calc(var(--radius-card)-1px)] p-6 sm:p-7',
              'transition-[box-shadow,transform] duration-500 ease-out',
              'group-hover/card:border-primary/25 group-hover/card:shadow-xl group-hover/card:shadow-primary/10',
              'group-hover/card:-translate-y-1.5 group-focus-within/card:-translate-y-1.5',
              'group-focus-within/card:border-primary/25 group-focus-within/card:shadow-xl group-focus-within/card:shadow-primary/10',
            )}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={cn(
                'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-500',
                'group-hover/card:opacity-70 group-focus-within/card:opacity-70',
                accent,
              )}
              aria-hidden="true"
            />

            <div
              data-card-spotlight
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover/card:bg-primary/20"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-1 flex-col gap-4">
              <FeatureIcon name={icon} />

              <div className="flex flex-1 flex-col">
                <h3
                  id={titleId}
                  className="text-lg font-semibold tracking-tight text-text sm:text-xl"
                >
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  {description}
                </p>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-primary via-secondary to-transparent transition-all duration-700 group-hover/card:w-full group-focus-within/card:w-full"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </article>
  )
}
