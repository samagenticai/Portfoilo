import { useEffect, useRef } from 'react'
import { useHeroComplexity } from '../../../../hooks/useHeroComplexity'
import { useHeroMouse } from '../../../../hooks/useHeroMouse'
import { useInView } from '../../../../hooks/useInView'
import AuroraLayer from './AuroraLayer'
import EngineeringGrid from './EngineeringGrid'
import FloatingCodeSymbols from './FloatingCodeSymbols'
import FloatingTechWords from './FloatingTechWords'
import LivingCanvas from './LivingCanvas'
import MouseSpotlight from './MouseSpotlight'

/**
 * Award-grade living Hero background — depth stack (far → near):
 * base wash → aurora → grid → tech words → canvas (dust + network) → code → spotlight → vignette
 */
export default function HeroBackground({ sectionRef }) {
  const config = useHeroComplexity()
  const inView = useInView(sectionRef, { rootMargin: '100px', threshold: 0.02 })
  const active = inView && config.enabled

  const mouse = useHeroMouse(sectionRef, {
    enabled: config.mouseRadius > 0 || config.showParallax,
    active,
    ease: 0.065,
  })

  const auroraRef = useRef(null)
  const gridRef = useRef(null)
  const wordsRef = useRef(null)
  const canvasWrapRef = useRef(null)
  const codeRef = useRef(null)

  // Multi-layer parallax — each depth moves at a different rate
  useEffect(() => {
    if (!config.showParallax || !active) {
      ;[auroraRef, gridRef, wordsRef, canvasWrapRef, codeRef].forEach((r) => {
        if (r.current) r.current.style.transform = ''
      })
      return undefined
    }

    let raf = 0
    const tick = () => {
      const { nx, ny } = mouse.current
      if (auroraRef.current) {
        auroraRef.current.style.transform = `translate3d(${nx * -28}px, ${ny * -22}px, 0)`
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${nx * -14}px, ${ny * -10}px, 0) scale(1.06)`
      }
      if (wordsRef.current) {
        wordsRef.current.style.transform = `translate3d(${nx * 10}px, ${ny * 8}px, 0)`
      }
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.transform = `translate3d(${nx * 16}px, ${ny * 12}px, 0)`
      }
      if (codeRef.current) {
        codeRef.current.style.transform = `translate3d(${nx * 24}px, ${ny * 18}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, config.showParallax, mouse])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-hero-bg-paused={!active}
    >
      {/* Layer 0 — deep base */}
      <div className="hero-base-wash absolute inset-0" />

      {/* Layer 1 — aurora lights */}
      <div ref={auroraRef} className="absolute inset-0 will-change-transform">
        <AuroraLayer intensity={config.auroraIntensity} active={active} />
      </div>

      {/* Layer 2 — engineering grid */}
      <div ref={gridRef} className="absolute inset-0 will-change-transform">
        <EngineeringGrid opacity={config.gridOpacity} active={active} />
      </div>

      {/* Layer 3 — large tech words */}
      <div ref={wordsRef} className="absolute inset-0 will-change-transform">
        <FloatingTechWords
          count={config.techWordCount}
          active={active}
          mouseRef={mouse}
          mouseRadius={config.mouseRadius || 200}
        />
      </div>

      {/* Layer 4 — particles + network canvas */}
      <div ref={canvasWrapRef} className="absolute inset-0 will-change-transform">
        <LivingCanvas
          active={active}
          dustCount={config.dustCount}
          networkNodes={config.networkNodes}
          connectionDistance={config.connectionDistance}
          mouseRadius={config.mouseRadius}
          mouseForce={config.mouseForce}
          maxDpr={config.maxDpr}
          mouseRef={mouse}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      {/* Layer 5 — floating code symbols */}
      <div ref={codeRef} className="absolute inset-0 will-change-transform">
        <FloatingCodeSymbols
          count={config.codeSymbolCount}
          active={active}
          mouseRef={mouse}
          mouseRadius={config.mouseRadius || 140}
        />
      </div>

      {/* Layer 6 — cursor spotlight */}
      <MouseSpotlight mouseRef={mouse} active={active && config.showSpotlight} />

      {/* Layer 7 — vignette + floor fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,7,18,0.65)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  )
}
