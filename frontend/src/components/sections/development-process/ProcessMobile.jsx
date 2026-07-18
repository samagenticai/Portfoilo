import { PROCESS_STEPS } from '../../../constants/process'
import ProcessStep from './ProcessStep'

/**
 * Dedicated mobile / tablet vertical process — animated center line.
 * Not a shrunk zig-zag.
 */
export default function ProcessMobile() {
  return (
    <div className="relative lg:hidden" data-process-mobile>
      {/* Vertical glowing connector */}
      <div
        className="process-mobile-line pointer-events-none absolute bottom-8 left-[1.35rem] top-8 w-px sm:left-[1.5rem]"
        aria-hidden="true"
      >
        <div className="process-mobile-line-glow absolute inset-0" />
        <div className="process-mobile-line-flow absolute inset-0" />
      </div>

      <ol className="relative list-none space-y-5 sm:space-y-6">
        {PROCESS_STEPS.map((step, index) => (
          <li key={step.id} className="relative flex gap-4 sm:gap-5">
            <span
              className="process-mobile-node relative z-[2] mt-6 flex h-3 w-3 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span className="h-3 w-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
            </span>
            <ProcessStep step={step} index={index} className="max-w-none flex-1" />
          </li>
        ))}
      </ol>
    </div>
  )
}
