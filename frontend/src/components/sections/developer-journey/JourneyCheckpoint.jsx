import { useEffect, useRef, useState } from 'react'
import AppIcon from '../../ui/AppIcon'
import { cn } from '../../../lib/cn'

export function useCheckpointActive(threshold = 0.55) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold, rootMargin: '-10% 0px -10% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, active }
}

export default function JourneyCheckpoint({ milestone, index, isLast }) {
  const { ref, active } = useCheckpointActive()

  return (
    <li
      ref={ref}
      data-journey-checkpoint
      className={cn(
        'relative flex gap-3 pb-7 transition-all duration-500 sm:gap-4 sm:pb-8 lg:gap-5 lg:pb-10',
        isLast && 'pb-0 sm:pb-0 lg:pb-0',
      )}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div className="relative z-10 shrink-0">
        <div
          className={cn(
            'group/icon relative flex h-9 w-9 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 lg:h-11 lg:w-11',
            'transition-all duration-500',
            active
              ? 'scale-110 border-secondary bg-secondary/15 shadow-lg shadow-secondary/30'
              : 'border-white/15 bg-white/[0.04]',
          )}
        >
          <AppIcon
            name={milestone.icon}
            size={16}
            className={cn(
              'sm:h-[18px] sm:w-[18px] transition-all duration-500',
              active && 'drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]',
            )}
          />
          {active && (
            <span
              className="absolute inset-0 rounded-full bg-secondary/20 animate-ping"
              aria-hidden="true"
            />
          )}
        </div>
        {active && (
          <div
            className="absolute inset-0 -m-2 rounded-full bg-secondary/20 blur-xl"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider transition-colors duration-500',
              active
                ? 'border-secondary/40 bg-secondary/10 text-secondary'
                : 'border-white/10 bg-white/[0.03] text-muted',
            )}
          >
            {milestone.year}
          </span>
        </div>
        <h3
          className={cn(
            'mt-1.5 text-[0.8125rem] font-semibold leading-snug transition-colors duration-500 sm:text-sm lg:text-base',
            active ? 'text-text' : 'text-text/80',
          )}
        >
          {milestone.title}
        </h3>
        {milestone.items?.length ? (
          <ul className="mt-2 space-y-1 text-[0.6875rem] leading-relaxed text-slate-400 sm:text-xs lg:text-sm">
            {milestone.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary/70" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[0.6875rem] leading-relaxed text-slate-400 sm:text-xs lg:text-sm">
            {milestone.detail}
          </p>
        )}
      </div>
    </li>
  )
}
