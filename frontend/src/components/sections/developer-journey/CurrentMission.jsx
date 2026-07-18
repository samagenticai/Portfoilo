import { useRef } from 'react'
import { useInView } from '../../../hooks/useInView'
import { useAnimatedProgress } from '../../../hooks/useAnimatedCounter'
import {
  JOURNEY_MISSION,
  JOURNEY_MISSION_SKILLS,
} from '../../../constants/journey'
import { cn } from '../../../lib/cn'

function SkillBar({ skill, rootRef, active }) {
  const width = useAnimatedProgress({
    target: skill.progress,
    triggerRef: rootRef,
    active,
  })

  return (
    <div data-journey-skill className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-text">{skill.label}</span>
        <span className="text-xs font-semibold tabular-nums text-secondary">{width}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="skills-progress-shimmer relative h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default function CurrentMission({ active = true }) {
  const rootRef = useRef(null)
  const inView = useInView(rootRef, { threshold: 0.2 })

  return (
    <div
      ref={rootRef}
      data-journey-mission
      className="feature-card-border overflow-hidden rounded-2xl p-px"
    >
      <div className="glass-card relative overflow-hidden rounded-[calc(1rem-1px)] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.04]" aria-hidden="true" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                Focus
              </p>
              <h3 className="mt-1 text-xl font-bold text-text sm:text-2xl">{JOURNEY_MISSION.title}</h3>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/50 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
              <span className="text-xs font-semibold text-secondary">In Progress</span>
            </div>
          </div>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {JOURNEY_MISSION.description}
          </p>

          <div
            className={cn(
              'mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5',
            )}
          >
            {JOURNEY_MISSION_SKILLS.map((skill) => (
              <SkillBar
                key={skill.id}
                skill={skill}
                rootRef={rootRef}
                active={active && inView}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
