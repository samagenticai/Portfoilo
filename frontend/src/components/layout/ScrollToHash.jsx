import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scrolls to hash targets after route changes and refreshes GSAP triggers.
 */
export default function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    const { hash, pathname } = location

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh()

      if (!hash) return

      const id = decodeURIComponent(hash.replace('#', ''))
      const el = document.getElementById(id)
      if (!el) return

      // Account for sticky navbar
      const top = el.getBoundingClientRect().top + window.scrollY - 88
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }, pathname === '/' ? 50 : 120)

    return () => window.clearTimeout(timer)
  }, [location])

  return null
}
