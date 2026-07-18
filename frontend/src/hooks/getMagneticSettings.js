import { getHeroComplexity } from './getHeroComplexity'

export function getMagneticSettings() {
  const config = getHeroComplexity()

  if (config.tier === 'reduced') {
    return { enabled: false, strength: 0, maxOffset: 0, ease: 0.2 }
  }

  if (config.tier === 'mobile') {
    return { enabled: false, strength: 0, maxOffset: 0, ease: 0.2 }
  }

  if (config.tier === 'tablet') {
    return { enabled: true, strength: 0.22, maxOffset: 10, ease: 0.2 }
  }

  const lowPower =
    typeof navigator !== 'undefined' &&
    ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4))

  if (lowPower) {
    return { enabled: true, strength: 0.24, maxOffset: 10, ease: 0.22 }
  }

  return { enabled: true, strength: 0.34, maxOffset: 14, ease: 0.18 }
}
