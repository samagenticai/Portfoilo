import { STATUS_ITEMS } from '../../../../constants/heroDashboard'
import { useAnimatedMetric } from '../../../../hooks/useAnimatedMetric'
import { cn } from '../../../../lib/cn'

function MetricRow({ item, active }) {
  const value = useAnimatedMetric({
    min: item.min,
    max: item.max,
    suffix: item.suffix,
    active,
  })

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/40 py-2 last:border-0 sm:py-2.5">
      <span className="text-[0.6875rem] text-muted sm:text-xs">{item.label}</span>
      <span className="text-[0.6875rem] font-medium tabular-nums text-secondary sm:text-xs">
        {value}
      </span>
    </div>
  )
}

function StatusRow({ item }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/40 py-2 last:border-0 sm:py-2.5">
      <span className="text-[0.6875rem] text-muted sm:text-xs">{item.label}</span>
      <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-text sm:text-xs">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400/90" />
        </span>
        {item.value}
      </span>
    </div>
  )
}

export default function StatusPanel({ active = true, className }) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-10 border-t border-border/60 bg-background/40 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4',
        className,
      )}
      aria-label="Developer status panel"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/50 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
        </span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-secondary sm:text-xs">
          Live Developer Status
        </span>
      </div>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        {STATUS_ITEMS.map((item) =>
          item.type === 'metric' ? (
            <MetricRow key={item.id} item={item} active={active} />
          ) : (
            <StatusRow key={item.id} item={item} />
          ),
        )}
      </div>
    </div>
  )
}
