import { useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import TechIcon from '../../ui/TechIcon'
import MernOrbitEnergy from './MernOrbitEnergy'

function OrbitItem({ item, scale = 1 }) {
  const [paused, setPaused] = useState(false)
  const radius = item.radius * scale
  const dir = item.direction === -1 ? 'reverse' : 'normal'

  return (
    <div
      className="orbit-ring pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        animation: `orbit-spin ${item.duration}s linear infinite ${dir}`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
      aria-hidden={false}
    >
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2"
        style={{ transform: `rotate(${item.startAngle}deg) translateX(${radius}px)` }}
      >
        <div
          className="orbit-counter flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{
            animation: `orbit-spin ${item.duration}s linear infinite ${dir === 'reverse' ? 'normal' : 'reverse'}`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <button
            type="button"
            className={cn(
              'group/orbit relative flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12',
              'border border-border bg-white/[0.04] backdrop-blur-md',
              'transition-all duration-300 touch-manipulation',
              'hover:border-secondary/40 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              paused && 'border-secondary/50 bg-primary/15 shadow-lg shadow-primary/25 scale-110',
            )}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            aria-label={item.name}
          >
            <TechIcon name={item.lucideIcon || item.id} iconUrl={item.iconUrl} label={item.name} />
            <span
              className={cn(
                'pointer-events-none absolute -bottom-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap',
                'rounded-md border border-border bg-background/90 px-2 py-1 text-[0.6875rem] font-medium text-text backdrop-blur-sm',
                'opacity-0 transition-all duration-300',
                'group-hover/orbit:opacity-100 group-focus/orbit:opacity-100',
                paused && 'opacity-100',
              )}
              role="tooltip"
            >
              {item.name}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MernOrbit({ items = [], className }) {
  const mouseRef = useRef({ x: 0, y: 0, active: false })

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      active: true,
    }
  }

  const onPointerLeave = () => {
    mouseRef.current.active = false
  }

  return (
    <div
      data-mern-orbit
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'relative mx-auto aspect-square w-full max-w-[min(100%,20rem)] scale-90 sm:max-w-md sm:scale-100',
        className,
      )}
      aria-label="MERN Stack technology orbit"
    >
      <div className="mern-orbit-ring mern-orbit-ring-a absolute inset-[12%] rounded-full border border-border/40" aria-hidden="true" />
      <div className="mern-orbit-ring mern-orbit-ring-b absolute inset-[22%] rounded-full border border-primary/10" aria-hidden="true" />
      <div className="absolute inset-[8%] rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
      <MernOrbitEnergy mouseRef={mouseRef} />

      {items.map((item) => (
        <OrbitItem key={item.id} item={item} scale={1} />
      ))}

      {/* Center hub */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="mern-orbit-hub-pulse absolute inset-0 -m-3 rounded-full bg-primary/10 blur-xl sm:-m-4" aria-hidden="true" />
        <div
          className={cn(
            'relative flex h-24 w-24 flex-col items-center justify-center rounded-full sm:h-28 sm:w-28',
            'border border-primary/30 bg-white/[0.04] backdrop-blur-xl',
            'shadow-lg shadow-primary/20',
          )}
        >
          <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-secondary sm:text-xs">
            MERN
          </span>
          <span className="text-sm font-bold text-text sm:text-base">STACK</span>
        </div>
      </div>
    </div>
  )
}
