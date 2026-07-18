import { useMemo, useRef } from 'react'
import { cn } from '../../../../lib/cn'
import { TECH_WORDS } from './backgroundData'
import {
  useFloatingDrift,
  useFloatingMousePush,
  usePauseFloating,
} from './useFloatingLayer'

export default function FloatingTechWords({
  count = 9,
  active = true,
  mouseRef,
  mouseRadius = 200,
  className,
}) {
  const containerRef = useRef(null)
  const items = useMemo(() => TECH_WORDS.slice(0, count), [count])

  useFloatingDrift(containerRef, items, active)
  useFloatingMousePush(containerRef, active, mouseRef, { radius: mouseRadius, force: 32 })
  usePauseFloating(containerRef, active)

  if (count === 0) return null

  return (
    <div ref={containerRef} className={cn('absolute inset-0', className)} aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.text}
          data-float-wrap
          className="absolute will-change-transform"
          style={{ left: item.left, top: item.top }}
        >
          <span
            data-float-inner
            className="block whitespace-nowrap font-bold uppercase tracking-[0.12em] text-text select-none will-change-transform"
            style={{
              fontSize: item.size,
              opacity: item.opacity,
            }}
          >
            {item.text}
          </span>
        </div>
      ))}
    </div>
  )
}
