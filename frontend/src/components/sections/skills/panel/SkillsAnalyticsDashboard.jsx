import { useRef } from 'react'
import { SKILLS_ANALYTICS_METRICS } from '../../../../constants/skills'
import { useAnimatedCounter, useAnimatedProgress } from '../../../../hooks/useAnimatedCounter'
import AppIcon from '../../../ui/AppIcon'
import { cn } from '../../../../lib/cn'

const ICON_NAMES = {
  folder: 'folder',
  stack: 'stack',
  rocket: 'rocket',
  bolt: 'zap',
  star: 'sparkles',
}

function ProgressBar({ progress, accent = 'primary' }) {
  const gradient =
    accent === 'green'
      ? 'from-green-500 to-emerald-400'
      : 'from-primary to-secondary'

  return (
    <div className="relative h-1 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={cn('skills-progress-shimmer relative h-full rounded-full bg-gradient-to-r', gradient)}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function MetricCell({ metric, index, rootRef, active }) {
  const display = useAnimatedCounter({
    target: metric.value ?? 0,
    suffix: metric.suffix ?? '',
    triggerRef: rootRef,
    active,
    duration: 1.5 + index * 0.08,
  })
  const progress = useAnimatedProgress({
    target: metric.progress,
    triggerRef: rootRef,
    active,
  })

  const iconName = ICON_NAMES[metric.icon] || 'code'

  if (metric.status) {
    return (
      <div
        data-analytic-metric
        className={cn(
          'group/metric relative col-span-2 flex items-center justify-between gap-3 rounded-lg',
          'border border-green-500/25 bg-green-500/[0.05] px-3 py-2.5',
          'transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/[0.08]',
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="group/icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/15 ring-1 ring-inset ring-green-500/20">
            <AppIcon name={iconName} size={16} className="text-green-400" />
          </div>
          <p className="text-xs font-semibold text-text">{metric.label}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/35 bg-green-500/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-green-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/50 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          Active
        </span>
      </div>
    )
  }

  return (
    <div
      data-analytic-metric
      className={cn(
        'group/metric relative rounded-lg border border-border/40 bg-white/[0.02] p-3',
        'transition-all duration-300 hover:border-primary/25 hover:bg-primary/[0.04]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="group/icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/15">
          <AppIcon name={iconName} size={16} />
        </div>
        <p className="text-lg font-bold tabular-nums tracking-tight text-text">{display}</p>
      </div>
      <p className="mt-2 text-[0.6875rem] font-medium text-muted">{metric.label}</p>
      <div className="mt-2">
        <ProgressBar progress={progress} />
      </div>
    </div>
  )
}

export default function SkillsAnalyticsDashboard({ active = true, className }) {
  const rootRef = useRef(null)

  return (
    <div ref={rootRef} data-skills-dashboard className={cn('p-4 sm:p-4', className)}>
      <div className="grid grid-cols-2 gap-2.5">
        {SKILLS_ANALYTICS_METRICS.map((metric, i) => (
          <MetricCell key={metric.id} metric={metric} index={i} rootRef={rootRef} active={active} />
        ))}
      </div>
    </div>
  )
}
