import { motion, useReducedMotion } from 'framer-motion'
import {
  ACHIEVEMENT_POSITIONS,
  PANEL_SIZE_CLASSES,
  PANEL_VALUE_CLASSES,
} from '../../../constants/journey'
import AppIcon from '../../ui/AppIcon'
import { cn } from '../../../lib/cn'

const ICON_ANIMATIONS = {
  bounce: 'journey-icon-bounce',
  'spin-slow': 'journey-icon-spin',
  pulse: 'journey-icon-pulse',
  glow: 'journey-icon-glow',
  sway: 'journey-icon-sway',
  flash: 'journey-icon-flash',
}

export default function AchievementPanel({ achievement, className, layout = 'desktop' }) {
  const prefersReducedMotion = useReducedMotion()
  const iconClass = ICON_ANIMATIONS[achievement.iconAnim] || 'journey-icon-pulse'

  return (
    <motion.article
      data-journey-panel
      className={cn(
        'group/panel w-full min-w-0 touch-manipulation',
        layout === 'desktop' && ACHIEVEMENT_POSITIONS[achievement.position],
        className,
      )}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -4 }}
    >
      <div
        className={cn(
          'journey-panel-float feature-card-border relative overflow-hidden rounded-2xl p-px',
          'transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/20',
        )}
        style={{ animationDelay: achievement.floatDelay }}
      >
        <div
          className={cn(
            'glass-card relative h-full overflow-hidden rounded-[calc(1rem-1px)]',
            'border border-white/10 backdrop-blur-md',
            PANEL_SIZE_CLASSES[achievement.size],
          )}
        >
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover/panel:opacity-90',
              achievement.accent,
            )}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl transition-all duration-500 group-hover/panel:bg-secondary/20"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-start gap-3">
            <div
              className={cn(
                'group/icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10',
                'border border-white/10 bg-white/[0.05]',
                'transition-all duration-300 group-hover/panel:border-secondary/30 group-hover/panel:shadow-lg group-hover/panel:shadow-secondary/20',
                iconClass,
              )}
              aria-hidden="true"
            >
              <AppIcon name={achievement.icon} size={18} className="sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-secondary sm:text-[0.6875rem]">
                {achievement.title}
              </p>
              <p
                className={cn(
                  'mt-0.5 font-bold tabular-nums tracking-tight text-text',
                  PANEL_VALUE_CLASSES[achievement.size],
                )}
              >
                {achievement.value}
              </p>
              <p className="mt-1 text-[0.6875rem] leading-relaxed text-slate-400 sm:text-xs lg:text-sm">
                {achievement.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
