import { useRef } from 'react'
import { SKILLS_FOCUS } from '../../../../constants/skills'
import { useAnimatedProgress } from '../../../../hooks/useAnimatedCounter'
import { cn } from '../../../../lib/cn'

export default function SkillsFocus({ active = true, className }) {
  const rootRef = useRef(null)
  const progress = useAnimatedProgress({
    target: SKILLS_FOCUS.progress,
    triggerRef: rootRef,
    active,
  })

  return (
    <div
      ref={rootRef}
      data-skills-focus
      className={cn('relative overflow-hidden px-4 py-3.5 sm:px-5', className)}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-secondary">
              Current Focus
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-text">{SKILLS_FOCUS.project}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SKILLS_FOCUS.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border/50 bg-white/[0.03] px-2 py-0.5 text-[0.625rem] font-medium text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/[0.08] px-2 py-0.5 text-[0.625rem] font-semibold text-green-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/50 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            {SKILLS_FOCUS.status}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="shrink-0 text-[0.625rem] uppercase tracking-wider text-muted">Progress</span>
          <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="skills-progress-shimmer relative h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-bold tabular-nums text-secondary">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
