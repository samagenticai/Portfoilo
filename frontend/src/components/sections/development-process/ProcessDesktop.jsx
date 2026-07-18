import { PROCESS_STEPS } from '../../../constants/process'
import ProcessStep from './ProcessStep'

/**
 * Desktop / large tablet zig-zag workflow with SVG glowing paths.
 */
export default function ProcessDesktop() {
  return (
    <div className="relative mx-auto hidden max-w-5xl lg:block" data-process-desktop>
      {/* Animated glowing path spine */}
      <svg
        className="process-path-svg pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="process-path-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.05)" />
            <stop offset="20%" stopColor="rgba(56,189,248,0.55)" />
            <stop offset="50%" stopColor="rgba(37,99,235,0.5)" />
            <stop offset="80%" stopColor="rgba(56,189,248,0.55)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.05)" />
          </linearGradient>
          <filter id="process-path-glow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Zig-zag center line approximating left-right flow */}
        <path
          className="process-path-line"
          d="M50 20
             C50 60, 22 80, 22 110
             C22 145, 50 160, 50 195
             C50 230, 78 245, 78 280
             C78 315, 50 330, 50 365
             C50 400, 22 415, 22 450
             C22 485, 50 500, 50 535
             C50 570, 78 585, 78 620
             C78 655, 50 670, 50 720
             C50 750, 50 780, 50 790"
          fill="none"
          stroke="url(#process-path-grad)"
          strokeWidth="0.55"
          filter="url(#process-path-glow)"
          vectorEffect="non-scaling-stroke"
        />
        {/* Flowing dash overlay */}
        <path
          className="process-path-dash"
          d="M50 20
             C50 60, 22 80, 22 110
             C22 145, 50 160, 50 195
             C50 230, 78 245, 78 280
             C78 315, 50 330, 50 365
             C50 400, 22 415, 22 450
             C22 485, 50 500, 50 535
             C50 570, 78 585, 78 620
             C78 655, 50 670, 50 720
             C50 750, 50 780, 50 790"
          fill="none"
          stroke="rgba(56,189,248,0.7)"
          strokeWidth="0.35"
          strokeDasharray="4 10"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Center nodes */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-[2] flex h-full w-0 -translate-x-1/2 flex-col justify-around py-8" aria-hidden="true">
        {PROCESS_STEPS.map((step) => (
          <span
            key={step.id}
            className="process-node relative flex h-3 w-3 shrink-0 -translate-x-1/2 items-center justify-center"
          >
            <span className="absolute h-3 w-3 rounded-full bg-secondary/80 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
            <span className="process-node-ring absolute h-6 w-6 rounded-full border border-secondary/30" />
          </span>
        ))}
      </div>

      <ol className="relative z-[3] flex list-none flex-col gap-10 xl:gap-12">
        {PROCESS_STEPS.map((step, index) => {
          const right = step.side === 'right'
          return (
            <li
              key={step.id}
              className={`flex ${right ? 'justify-end' : 'justify-start'}`}
            >
              <ProcessStep
                step={step}
                index={index}
                className={right ? 'mr-0 xl:mr-4' : 'ml-0 xl:ml-4'}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
