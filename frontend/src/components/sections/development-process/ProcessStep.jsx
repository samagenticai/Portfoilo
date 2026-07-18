import { cn } from '../../../lib/cn'
import AppIcon from '../../ui/AppIcon'
import ProcessSatellite from './ProcessSatellite'

/**
 * Unique floating glass tile — layout shape varies by variant.
 */
export default function ProcessStep({ step, index, className }) {
  const isEven = index % 2 === 1

  return (
    <article
      data-process-step
      className={cn(
        'group/step process-step relative z-[1] w-full max-w-md',
        className,
      )}
      style={{ '--step-delay': `${index * 0.12}s` }}
      aria-labelledby={`process-${step.id}-title`}
    >
      <div
        className={cn(
          'process-step-float feature-card-border relative overflow-hidden rounded-2xl p-px',
          'transition-shadow duration-500 hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.35)]',
        )}
      >
        <div
          className={cn(
            'glass-card relative overflow-hidden rounded-[calc(1rem-1px)] border border-white/10',
            'bg-white/[0.03] p-5 backdrop-blur-md sm:p-6',
            step.variant === 'tall' && 'sm:min-h-[13.5rem]',
            step.variant === 'wide' && 'sm:pr-7',
            step.variant === 'compact' && 'sm:p-5',
          )}
        >
          {/* Accent wash */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500 group-hover/step:opacity-80',
              step.accent,
            )}
            aria-hidden="true"
          />

          {/* Soft spotlight on hover */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover/step:opacity-100"
            aria-hidden="true"
          />

          <div className="relative z-[1]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="process-step-icon group/icon flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-primary/10 transition-all duration-300 group-hover/step:border-secondary/30 group-hover/step:bg-primary/20 group-hover/step:shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                  <AppIcon name={step.icon} size={20} />
                </span>
                <div>
                  <p className="font-mono text-[0.625rem] font-semibold tracking-[0.2em] text-secondary">
                    STEP {step.step}
                  </p>
                  <h3
                    id={`process-${step.id}-title`}
                    className="mt-0.5 text-lg font-bold tracking-tight text-text sm:text-xl"
                  >
                    {step.title}
                  </h3>
                </div>
              </div>
              {!isEven && step.satellite === 'deploy' && (
                <ProcessSatellite type="deploy" className="hidden sm:inline-flex" />
              )}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted">{step.description}</p>

            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/[0.06] pt-4">
              <p className="text-[11px] font-medium tracking-wide text-slate-400">{step.detail}</p>
              {step.satellite !== 'deploy' && (
                <ProcessSatellite type={step.satellite} className="max-w-[11rem]" />
              )}
              {step.satellite === 'deploy' && (
                <ProcessSatellite type="deploy" className="sm:hidden" />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
