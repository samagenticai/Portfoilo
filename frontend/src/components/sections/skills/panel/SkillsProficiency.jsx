import { useRef } from 'react'
import { useAnimatedProgress } from '../../../../hooks/useAnimatedCounter'
import { cn } from '../../../../lib/cn'

function ProficiencyRow({ item, rootRef, active, index }) {
  const progress = useAnimatedProgress({
    target: item.level,
    triggerRef: rootRef,
    active,
  })

  return (
    <div className="group/row flex items-center gap-3">
      <span className="w-16 shrink-0 text-[0.6875rem] font-medium text-muted">{item.label}</span>
      <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="skills-progress-shimmer relative h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${progress}%`, transitionDelay: `${index * 80}ms` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[0.6875rem] font-bold tabular-nums text-secondary">
        {progress}%
      </span>
    </div>
  )
}

export default function SkillsProficiency({ items = [], active = true, className }) {
  const rootRef = useRef(null)

  if (!items.length) return null

  return (
    <div ref={rootRef} data-skills-proficiency className={cn('px-4 py-3.5 sm:px-5', className)}>
      <div className="mb-2.5 flex items-center gap-2">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-secondary" aria-hidden="true">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-secondary">
          Core Proficiency
        </h3>
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <ProficiencyRow key={item.id} item={item} rootRef={rootRef} active={active} index={i} />
        ))}
      </div>
    </div>
  )
}
