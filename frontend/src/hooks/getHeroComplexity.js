const DESKTOP_MQ = '(min-width: 1024px)'
const TABLET_MQ = '(min-width: 768px)'

export function getHeroComplexity() {
  if (typeof window === 'undefined') return createConfig('desktop')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return createConfig('reduced')
  }
  if (window.matchMedia(DESKTOP_MQ).matches) return createConfig('desktop')
  if (window.matchMedia(TABLET_MQ).matches) return createConfig('tablet')
  return createConfig('mobile')
}

function createConfig(tier) {
  const configs = {
    desktop: {
      tier: 'desktop',
      enabled: true,
      dustCount: 180,
      networkNodes: 52,
      connectionDistance: 155,
      mouseRadius: 160,
      mouseForce: 0.045,
      maxDpr: 1.5,
      techWordCount: 9,
      codeSymbolCount: 12,
      showSpotlight: true,
      showParallax: true,
      auroraIntensity: 1,
      gridOpacity: 0.045,
    },
    tablet: {
      tier: 'tablet',
      enabled: true,
      dustCount: 95,
      networkNodes: 34,
      connectionDistance: 130,
      mouseRadius: 120,
      mouseForce: 0.03,
      maxDpr: 1.25,
      techWordCount: 6,
      codeSymbolCount: 8,
      showSpotlight: true,
      showParallax: true,
      auroraIntensity: 0.85,
      gridOpacity: 0.035,
    },
    mobile: {
      tier: 'mobile',
      enabled: true,
      dustCount: 42,
      networkNodes: 18,
      connectionDistance: 105,
      mouseRadius: 0,
      mouseForce: 0,
      maxDpr: 1,
      techWordCount: 4,
      codeSymbolCount: 5,
      showSpotlight: false,
      showParallax: false,
      auroraIntensity: 0.65,
      gridOpacity: 0.028,
    },
    reduced: {
      tier: 'reduced',
      enabled: false,
      dustCount: 0,
      networkNodes: 0,
      connectionDistance: 0,
      mouseRadius: 0,
      mouseForce: 0,
      maxDpr: 1,
      techWordCount: 0,
      codeSymbolCount: 0,
      showSpotlight: false,
      showParallax: false,
      auroraIntensity: 0.4,
      gridOpacity: 0.02,
    },
  }
  return configs[tier]
}
