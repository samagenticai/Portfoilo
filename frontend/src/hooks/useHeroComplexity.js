import { useEffect, useState } from 'react'
import { getHeroComplexity } from './getHeroComplexity'

export function useHeroComplexity() {
  const [config, setConfig] = useState(() => getHeroComplexity())

  useEffect(() => {
    const update = () => setConfig(getHeroComplexity())

    const desktop = window.matchMedia('(min-width: 1024px)')
    const tablet = window.matchMedia('(min-width: 768px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    desktop.addEventListener('change', update)
    tablet.addEventListener('change', update)
    reduced.addEventListener('change', update)
    window.addEventListener('resize', update, { passive: true })

    return () => {
      desktop.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return config
}
