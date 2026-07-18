import { cn } from '../../../lib/cn'

/** Skeleton placeholders matching project exhibit proportions — not redesigning cards */
export function ProjectExhibitSkeleton({ className }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8',
        className,
      )}
      aria-hidden="true"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-[85%] animate-pulse rounded-xl bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded-lg bg-white/[0.07]" />
          <div className="h-4 w-[90%] animate-pulse rounded-lg bg-white/[0.07]" />
          <div className="h-4 w-[70%] animate-pulse rounded-lg bg-white/[0.07]" />
          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-16 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-32 animate-pulse rounded-xl bg-primary/25" />
            <div className="h-11 w-28 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>
        <div className="h-56 animate-pulse rounded-[1.125rem] border border-white/10 bg-gradient-to-br from-primary/10 to-secondary/5 sm:h-72" />
      </div>
    </div>
  )
}

export function ProjectsEmptyState({ title, description }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-md">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-secondary">
        <span className="text-xl font-bold">{'</>'}</span>
      </div>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
    </div>
  )
}

export function ProjectsErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[1.5rem] border border-rose-400/25 bg-rose-500/[0.06] px-6 py-14 text-center backdrop-blur-md">
      <p className="text-base font-semibold text-rose-100">Unable to load projects</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-rose-100/70">
        {message || 'The projects API is unavailable right now.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-text shadow-lg shadow-primary/25 transition hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  )
}
