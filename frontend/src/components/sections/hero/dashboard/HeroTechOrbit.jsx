import { HERO_ORBIT } from '../../../../constants/heroDashboard'
import { cn } from '../../../../lib/cn'
import TechIcon from '../../../ui/TechIcon'

function OrbitIcon({ item }) {
  const dir = item.direction === -1 ? 'reverse' : 'normal'

  return (
    <div
      className="orbit-ring pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        animation: `orbit-spin ${item.duration}s linear infinite ${dir}`,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: `rotate(${item.startAngle}deg) translateX(${item.radius}px)` }}
      >
        <div
          className="orbit-counter -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: `orbit-spin ${item.duration}s linear infinite ${dir === 'reverse' ? 'normal' : 'reverse'}`,
          }}
        >
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10',
              'border border-border/80 bg-white/[0.04] backdrop-blur-md',
              'shadow-sm shadow-primary/10 transition-shadow duration-300',
            )}
            title={item.name}
          >
            <TechIcon name={item.id} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroTechOrbit({ className }) {
  return (
    <div
      className={cn('absolute inset-0 flex items-center justify-center', className)}
      aria-hidden="true"
    >
      <div className="absolute h-[58%] w-[58%] rounded-full border border-primary/10" />
      <div className="absolute h-[72%] w-[72%] rounded-full border border-border/30" />
      <div className="absolute h-[86%] w-[86%] rounded-full border border-secondary/5" />

      {HERO_ORBIT.map((item) => (
        <OrbitIcon key={item.id} item={item} />
      ))}

      {/* 3D Developer Core */}
      <div className="hero-dev-core relative z-10 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
        <div className="hero-dev-core-glow pointer-events-none absolute inset-[-40%] rounded-full" aria-hidden="true" />
        <div className="hero-dev-core-ring hero-dev-core-ring-a pointer-events-none absolute inset-[-18%] rounded-full border border-secondary/25" aria-hidden="true" />
        <div className="hero-dev-core-ring hero-dev-core-ring-b pointer-events-none absolute inset-[-28%] rounded-full border border-primary/15" aria-hidden="true" />
        <div
          className={cn(
            'hero-dev-core-sphere relative flex h-full w-full items-center justify-center rounded-full',
            'border border-primary/40 bg-gradient-to-br from-primary/30 via-secondary/20 to-background',
            'shadow-xl shadow-primary/30',
          )}
        >
          <span className="text-lg font-bold text-secondary sm:text-xl">{'</>'}</span>
        </div>
      </div>
    </div>
  )
}
