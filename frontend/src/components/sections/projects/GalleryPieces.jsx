import { cn } from '../../../lib/cn'
import { getProjectGithubUrl, getProjectLiveUrl } from '../../../lib/projectUrls'
import AppIcon from '../../ui/AppIcon'
import MagneticButton from './MagneticButton'

export function ProjectIndex({ index }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-semibold tracking-[0.2em] text-secondary">
      <span className="h-px w-7 bg-gradient-to-r from-secondary/60 to-transparent" aria-hidden="true" />
      {String(index + 1).padStart(2, '0')}
    </span>
  )
}

export function ProjectTitle({ project, index, className }) {
  return (
    <header className={cn('min-w-0', className)}>
      <div className="mb-3.5 flex flex-wrap items-center gap-3">
        <ProjectIndex index={index} />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
          {project.status}
        </span>
        {project.featured ? (
          <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-secondary">
            Featured
          </span>
        ) : null}
        {project.badge ? (
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-200">
            {project.badge}
          </span>
        ) : null}
      </div>
      <h3
        id={`project-${project.id}-title`}
        className="text-[1.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-text sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.04]"
      >
        {project.title}
      </h3>
    </header>
  )
}

export function ProjectDescription({ project, className }) {
  return (
    <p className={cn('max-w-md text-[0.9375rem] leading-[1.75] text-muted sm:text-base sm:leading-relaxed', className)}>
      {project.description}
    </p>
  )
}

export function TechPills({ project, className }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Technology stack">
      {project.stack.map((tech, i) => (
        <li key={tech} style={{ '--i': i }}>
          <span className="gallery-pill inline-flex rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-md transition-colors sm:text-xs">
            {tech}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ProjectActions({ project, className, fullWidth = false }) {
  const liveHref = getProjectLiveUrl(project)
  const githubHref = getProjectGithubUrl(project)

  return (
    <div
      className={cn('flex flex-wrap gap-3', fullWidth && 'w-full flex-col sm:flex-row [&>*]:flex-1', className)}
      role="group"
      aria-label="Project links"
    >
      {liveHref ? (
        <MagneticButton
          as="a"
          href={liveHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          className={cn('min-h-12', fullWidth && 'w-full')}
        >
          <AppIcon name="external" size={17} />
          Live Demo
        </MagneticButton>
      ) : (
        <MagneticButton
          disabled
          variant="primary"
          size="lg"
          className={cn('min-h-12', fullWidth && 'w-full')}
          aria-label="Live demo unavailable"
        >
          <AppIcon name="external" size={17} />
          Live Demo
        </MagneticButton>
      )}
      {githubHref ? (
        <MagneticButton
          as="a"
          href={githubHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="lg"
          className={cn('min-h-12', fullWidth && 'w-full')}
        >
          <AppIcon name="folder" size={17} />
          GitHub
        </MagneticButton>
      ) : (
        <MagneticButton
          disabled
          variant="outline"
          size="lg"
          className={cn('min-h-12', fullWidth && 'w-full')}
          aria-label="GitHub repository unavailable"
        >
          <AppIcon name="folder" size={17} />
          GitHub
        </MagneticButton>
      )}
    </div>
  )
}

const METRIC_ICONS = {
  Perf: 'gauge',
  Uptime: 'activity',
  Ships: 'rocket',
}

export function ProjectMetrics({ project, className }) {
  const items = [
    { label: 'Perf', value: `${project.metrics.performance}` },
    { label: 'Uptime', value: project.metrics.uptime },
    { label: 'Ships', value: String(project.metrics.deployments) },
  ]

  return (
    <ul className={cn('flex flex-wrap gap-2.5', className)} aria-label="Project metrics">
      {items.map((item) => (
        <li
          key={item.label}
          className="gallery-metric group/icon flex min-w-[4.75rem] items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 backdrop-blur-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-primary/10">
            <AppIcon name={METRIC_ICONS[item.label]} size={14} />
          </span>
          <div className="min-w-0">
            <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-secondary">
              {item.label}
            </span>
            <span className="block text-base font-bold tabular-nums leading-tight text-text">
              {item.value}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ConnectorSpine({ className }) {
  return (
    <div
      className={cn('gallery-spine pointer-events-none absolute', className)}
      aria-hidden="true"
    />
  )
}

/** Architecture overview — fills empty space with unique project context */
export function ArchitectureChip({ project, className }) {
  return (
    <div className={cn('group/icon min-w-0', className)}>
      <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-secondary">
        <AppIcon name="layers" size={12} />
        Architecture
      </p>
      <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{project.extras.architecture}</p>
    </div>
  )
}

/** Compact feature checklist — unique, not duplicated elsewhere as primary content */
export function FeatureHighlights({ project, className, limit = 3 }) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="mb-2 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-secondary">
        <AppIcon name="check" size={12} />
        Key Capabilities
      </p>
      <ul className="space-y-2">
        {project.features.slice(0, limit).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs leading-snug text-slate-300 sm:text-[0.8125rem]">
            <AppIcon name="check" size={14} className="mt-0.5 text-emerald-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Deployment status badge */
export function DeployStatus({ project, className }) {
  return (
    <div
      className={cn(
        'group/icon inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-md',
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-500/10">
        <AppIcon name="cloud" size={14} className="text-emerald-400" />
      </span>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-secondary">Deploy</p>
        <p className="text-sm font-semibold text-text">{project.status}</p>
      </div>
    </div>
  )
}

/** Git activity pulse */
export function GitPulse({ project, className }) {
  return (
    <div
      className={cn(
        'group/icon inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 backdrop-blur-md',
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-primary/10">
        <AppIcon name="commit" size={14} />
      </span>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-secondary">Activity</p>
        <p className="text-sm font-semibold text-text">{project.extras.gitActivity}</p>
      </div>
    </div>
  )
}

/** Problem or solution insight — pick one to avoid duplication */
export function InsightNote({ label, children, icon = 'lightbulb', className }) {
  return (
    <div className={cn('group/icon min-w-0', className)}>
      <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-secondary">
        <AppIcon name={icon} size={12} />
        {label}
      </p>
      <p className="text-xs leading-relaxed text-slate-300 sm:text-[0.8125rem]">{children}</p>
    </div>
  )
}

/** Checklist chips from extras */
export function CapabilityTags({ project, className }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Capabilities">
      {project.extras.checklist.map((item) => (
        <li
          key={item}
          className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-primary/[0.06] px-2.5 py-1 text-[10px] text-slate-300"
        >
          <AppIcon name="shield" size={10} className="text-emerald-400" />
          {item}
        </li>
      ))}
    </ul>
  )
}
