import { useRef } from 'react'
import { cn } from '../../../../lib/cn'
import ContributionHeatmap from './ContributionHeatmap'
import FloatingCommands from './FloatingCommands'
import HeroTechOrbit from './HeroTechOrbit'
import MouseEnergyTrail from './MouseEnergyTrail'
import StatusPanel from './StatusPanel'

export default function DeveloperDashboard({ className, active = true }) {
  const panelRef = useRef(null)

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-md lg:max-w-none',
        className,
      )}
      role="img"
      aria-label="Interactive developer dashboard with orbiting technologies and live status metrics"
    >
      <div className="feature-card-border rounded-[var(--radius-card)] p-px">
        <div
          ref={panelRef}
          className="glass-card relative aspect-[4/5] min-h-[22rem] overflow-hidden rounded-[calc(var(--radius-card)-1px)] sm:aspect-square sm:min-h-[24rem] lg:min-h-[28rem]"
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-[38%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[70px]"
            aria-hidden="true"
          />

          <FloatingCommands active={active} />
          <ContributionHeatmap active={active} />

          {/* Orbit + core — upper area */}
          <div className="absolute inset-x-0 top-0 bottom-[42%] sm:bottom-[38%]">
            <HeroTechOrbit />
          </div>

          <StatusPanel active={active} />
          <MouseEnergyTrail active={active} targetRef={panelRef} className="z-30" />

          {/* Subtle scan line */}
          <div className="hero-scan-line pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
