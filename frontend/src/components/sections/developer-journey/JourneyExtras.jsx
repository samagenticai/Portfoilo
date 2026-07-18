import { motion, useReducedMotion } from 'framer-motion'
import {
  EXTRA_POSITIONS,
  JOURNEY_AVAILABILITY,
  JOURNEY_CURRENT_PROJECT,
  JOURNEY_DEPLOYMENT_STATUS,
  JOURNEY_GIT_ACTIVITY,
  JOURNEY_QUOTE,
} from '../../../constants/journey'
import AppIcon from '../../ui/AppIcon'
import { cn } from '../../../lib/cn'

function GlassChip({ children, className }) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 backdrop-blur-md sm:px-4 sm:py-3.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

function QuoteCard({ className }) {
  return (
    <GlassChip className={cn('p-4', className)}>
      <div className="mb-2 flex items-center gap-2">
        <AppIcon name="sparkles" size={14} />
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary sm:text-[0.6875rem]">
          Developer Quote
        </p>
      </div>
      <blockquote className="text-xs italic leading-relaxed text-slate-300 sm:text-sm">
        &ldquo;{JOURNEY_QUOTE.text}&rdquo;
      </blockquote>
      <cite className="mt-2 block text-[0.625rem] not-italic text-muted">{JOURNEY_QUOTE.author}</cite>
    </GlassChip>
  )
}

function GitCard({ className }) {
  return (
    <GlassChip className={className}>
      <div className="mb-1.5 flex items-center gap-2">
        <AppIcon name="git" size={14} />
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary">
          {JOURNEY_GIT_ACTIVITY.label}
        </p>
      </div>
      <p className="text-lg font-bold tabular-nums text-text sm:text-xl">{JOURNEY_GIT_ACTIVITY.commits}</p>
      <p className="text-xs text-slate-400">{JOURNEY_GIT_ACTIVITY.streak}</p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="h-2 flex-1 rounded-sm bg-green-500/30"
            style={{ opacity: 0.35 + (i % 4) * 0.15 }}
          />
        ))}
      </div>
    </GlassChip>
  )
}

function DeploymentCard({ className }) {
  return (
    <GlassChip className={className}>
      <div className="mb-1.5 flex items-center gap-2">
        <AppIcon name="globe" size={14} />
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary">
          {JOURNEY_DEPLOYMENT_STATUS.label}
        </p>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span className="text-xs font-semibold text-green-400">{JOURNEY_DEPLOYMENT_STATUS.status}</span>
      </div>
      <p className="mt-1 text-[0.6875rem] text-slate-400">
        {JOURNEY_DEPLOYMENT_STATUS.platforms.join(' · ')} · {JOURNEY_DEPLOYMENT_STATUS.uptime}
      </p>
    </GlassChip>
  )
}

function ProjectCard({ className }) {
  return (
    <GlassChip className={className}>
      <div className="mb-1.5 flex items-center gap-2">
        <AppIcon name="folder" size={14} />
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-secondary">
          {JOURNEY_CURRENT_PROJECT.label}
        </p>
      </div>
      <p className="text-sm font-semibold leading-snug text-text">{JOURNEY_CURRENT_PROJECT.name}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${JOURNEY_CURRENT_PROJECT.progress}%` }}
        />
      </div>
      <p className="mt-1 text-[0.6875rem] tabular-nums text-muted">{JOURNEY_CURRENT_PROJECT.progress}% complete</p>
    </GlassChip>
  )
}

function AvailabilityBadge({ className }) {
  return (
    <div
      className={cn(
        'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-md',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
      </span>
      <span className="text-xs font-semibold text-green-400 sm:text-sm">{JOURNEY_AVAILABILITY.status}</span>
    </div>
  )
}

export default function JourneyExtras({ layout = 'floating' }) {
  const prefersReducedMotion = useReducedMotion()
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-20px' },
        transition: { duration: 0.5 },
      }

  if (layout === 'stacked') {
    return (
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <motion.div className="w-full min-w-0" {...motionProps}>
          <QuoteCard />
        </motion.div>
        <motion.div className="w-full min-w-0" {...motionProps}>
          <GitCard />
        </motion.div>
        <motion.div className="w-full min-w-0" {...motionProps}>
          <DeploymentCard />
        </motion.div>
        <motion.div className="w-full min-w-0" {...motionProps}>
          <ProjectCard />
        </motion.div>
        <motion.div {...motionProps} className="flex w-full justify-center sm:col-span-2">
          <AvailabilityBadge />
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <motion.div className={EXTRA_POSITIONS.availability} {...motionProps}>
        <AvailabilityBadge />
      </motion.div>
      <motion.div className={cn(EXTRA_POSITIONS.quote, 'journey-panel-float')} style={{ animationDelay: '2s' }} {...motionProps}>
        <QuoteCard />
      </motion.div>
      <motion.div className={cn(EXTRA_POSITIONS.git, 'journey-panel-float')} style={{ animationDelay: '2.4s' }} {...motionProps}>
        <GitCard />
      </motion.div>
      <motion.div className={cn(EXTRA_POSITIONS.deployment, 'journey-panel-float')} style={{ animationDelay: '1.2s' }} {...motionProps}>
        <DeploymentCard />
      </motion.div>
      <motion.div className={cn(EXTRA_POSITIONS.project, 'journey-panel-float')} style={{ animationDelay: '1.8s' }} {...motionProps}>
        <ProjectCard />
      </motion.div>
    </>
  )
}
