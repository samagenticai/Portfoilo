import { cn } from '../../../lib/cn'
import AppIcon from '../../ui/AppIcon'

export function AvailabilityCard({ label, className }) {
  return (
    <div
      className={cn(
        'contact-avail flex items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] px-4 py-3.5 backdrop-blur-md sm:px-5 sm:py-4',
        className,
      )}
    >
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-35" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
      </span>
      <p className="text-sm font-semibold leading-snug text-emerald-200 sm:text-[0.9375rem]">
        {label}
      </p>
    </div>
  )
}

export function ContactRow({ icon, label, value, href, className }) {
  const Comp = href ? 'a' : 'div'
  const isExternal = href?.startsWith('http')
  const props = href
    ? {
        href,
        target: isExternal ? '_blank' : undefined,
        rel: isExternal ? 'noopener noreferrer' : undefined,
      }
    : {}

  return (
    <Comp
      {...props}
      className={cn(
        'group/icon contact-row flex items-start gap-3.5 rounded-xl py-2.5 transition-colors duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        href && 'hover:text-secondary',
        className,
      )}
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-primary/10 transition-all duration-300 group-hover/icon:border-secondary/30 group-hover/icon:bg-primary/20 group-hover/icon:shadow-[0_0_16px_rgba(56,189,248,0.25)]">
        <AppIcon name={icon} size={18} />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">{label}</p>
        <p className="mt-0.5 truncate text-[0.9375rem] font-medium text-text sm:text-base">{value}</p>
      </div>
    </Comp>
  )
}
