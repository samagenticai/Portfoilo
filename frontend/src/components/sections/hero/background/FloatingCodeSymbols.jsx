import { useMemo, useRef } from 'react'
import { cn } from '../../../../lib/cn'
import { CODE_SYMBOLS } from './backgroundData'
import {
  useFloatingDrift,
  useFloatingMousePush,
  usePauseFloating,
} from './useFloatingLayer'

export default function FloatingCodeSymbols({
  count = 12,
  active = true,
  mouseRef,
  mouseRadius = 140,
  className,
}) {
  const containerRef = useRef(null)
  const items = useMemo(() => CODE_SYMBOLS.slice(0, count), [count])

  useFloatingDrift(containerRef, items, active)
  useFloatingMousePush(containerRef, active, mouseRef, { radius: mouseRadius, force: 22 })
  usePauseFloating(containerRef, active)

  if (count === 0) return null

  return (
    <div ref={containerRef} className={cn('absolute inset-0', className)} aria-hidden="true">
      {items.map((item) => (
        <div
          key={`${item.text}-${item.left}`}
          data-float-wrap
          className="absolute will-change-transform"
          style={{ left: item.left, top: item.top }}
        >
          <span
            data-float-inner
            className="block font-mono font-medium text-secondary select-none will-change-transform"
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
