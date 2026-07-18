import { useCallback, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../../lib/cn'
import GalleryFrame from './GalleryFrame'
import LayoutLedger from './layouts/LayoutLedger'
import LayoutMirrored from './layouts/LayoutMirrored'
import LayoutMobileReel from './layouts/LayoutMobileReel'
import LayoutSpotlight from './layouts/LayoutSpotlight'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_LAYOUTS = [LayoutLedger, LayoutSpotlight, LayoutMirrored]

export default function ProjectExhibit({ project, index, onActive, className }) {
  const frameRef = useRef(null)
  const DesktopLayout = DESKTOP_LAYOUTS[index % DESKTOP_LAYOUTS.length]

  const handleActive = useCallback(
    (i) => {
      onActive?.(i)
    },
    [onActive],
  )

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches

    // Only animate the visible layout's pieces (avoid double-animating hidden DOM)
    const selector = isDesktop
      ? '[data-desktop-layout] [data-float-piece]'
      : '[data-mobile-layout] [data-float-piece]'
    const pieces = frame.querySelectorAll(selector)

    const ctx = gsap.context(() => {
      if (reduced || pieces.length === 0) {
        gsap.set(pieces, { opacity: 1, y: 0 })
        return
      }

      const yOffset = isDesktop ? 36 : 24

      gsap.set(pieces, { opacity: 0, y: yOffset })

      gsap.to(pieces, {
        opacity: 1,
        y: 0,
        duration: isDesktop ? 0.85 : 0.65,
        stagger: isDesktop ? 0.07 : 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: frame,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, frame)

    return () => ctx.revert()
  }, [index])

  return (
    <article
      ref={frameRef}
      className={cn('relative overflow-x-clip py-8 sm:py-12 lg:py-14', className)}
      aria-labelledby={`project-${project.id}-title`}
    >
      <div
        className={cn(
          'pointer-events-none absolute -inset-x-4 top-[20%] h-[55%] rounded-full bg-gradient-to-br opacity-[0.1] blur-3xl transition-opacity duration-700',
          project.accent,
        )}
        aria-hidden="true"
      />

      <GalleryFrame frameRef={frameRef} index={index} onActive={handleActive}>
        <div data-desktop-layout>
          <DesktopLayout project={project} index={index} />
        </div>
        <div data-mobile-layout>
          <LayoutMobileReel project={project} index={index} />
        </div>
      </GalleryFrame>
    </article>
  )
}
