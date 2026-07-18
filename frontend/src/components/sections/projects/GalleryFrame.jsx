import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'
import { useHeroComplexity } from '../../../hooks/useHeroComplexity'
import { useInView } from '../../../hooks/useInView'
import { useMouseParallax } from '../../../hooks/useMouseParallax'

const GalleryContext = createContext({ hovered: false, inView: false })

export function useGallery() {
  return useContext(GalleryContext)
}

export default function GalleryFrame({
  children,
  frameRef,
  index,
  className,
  onActive,
}) {
  const [hovered, setHovered] = useState(false)
  const inView = useInView(frameRef, { rootMargin: '-10% 0px', threshold: 0.1 })
  const config = useHeroComplexity()
  const parallaxActive = inView && hovered && config.showParallax && config.tier === 'desktop'
  const parallax = useMouseParallax(frameRef, {
    enabled: config.showParallax && config.tier === 'desktop',
    active: parallaxActive,
    ease: 0.08,
  })
  const rafRef = useRef(0)

  useEffect(() => {
    if (inView) onActive?.(index)
  }, [inView, index, onActive])

  useEffect(() => {
    const node = frameRef.current
    if (!node || !parallaxActive) {
      if (node) {
        node.style.setProperty('--gx', '0px')
        node.style.setProperty('--gy', '0px')
      }
      return undefined
    }

    const tick = () => {
      node.style.setProperty('--gx', `${parallax.current.x * 32}px`)
      node.style.setProperty('--gy', `${parallax.current.y * 24}px`)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [frameRef, parallax, parallaxActive])

  return (
    <GalleryContext.Provider value={{ hovered, inView }}>
      <div
        className={cn('gallery-frame group/gallery relative', className)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        data-gallery-index={index}
      >
        <div
          className="gallery-frame-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/gallery:opacity-100"
          aria-hidden="true"
        />
        {children}
      </div>
    </GalleryContext.Provider>
  )
}
