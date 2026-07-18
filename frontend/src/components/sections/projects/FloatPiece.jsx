import { useRef } from 'react'
import { cn } from '../../../lib/cn'
import { useCardInteraction } from '../../../hooks/useCardInteraction'
import { useHeroComplexity } from '../../../hooks/useHeroComplexity'

/**
 * Independent floating surface — never a full-width card.
 * depth drives parallax magnitude via CSS vars from GalleryFrame.
 */
export default function FloatPiece({
  children,
  depth = 1,
  delay = 0,
  tilt = false,
  className,
  surface = true,
  as: Component = 'div',
}) {
  const tiltRef = useRef(null)
  const config = useHeroComplexity()

  useCardInteraction(tiltRef, {
    enabled: tilt && config.tier === 'desktop' && config.enabled,
    tilt: 6,
    magnetic: 0,
  })

  return (
    <Component
      data-float-piece
      className={cn('gallery-float min-w-0', className)}
      style={{
        '--depth': depth,
        '--drift-delay': `${delay}s`,
      }}
    >
      <div ref={tiltRef} className="gallery-float-inner h-full w-full">
        <div
          {...(tilt ? { 'data-card-inner': true } : {})}
          className={cn(
            'relative h-full w-full',
            surface && 'gallery-surface',
          )}
          style={tilt ? { transformStyle: 'preserve-3d' } : undefined}
        >
          {tilt && (
            <div
              data-card-spotlight
              className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 transition-opacity duration-500"
              aria-hidden="true"
            />
          )}
          <div className="relative z-[1] h-full">{children}</div>
        </div>
      </div>
    </Component>
  )
}
