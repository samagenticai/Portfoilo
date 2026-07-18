import { useEffect, useState } from 'react'

/**
 * Tracks whether an element is intersecting the viewport.
 * Used to pause heavy background animations when off-screen.
 */
export function useInView(ref, { rootMargin = '80px', threshold = 0.05 } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold])

  return inView
}
