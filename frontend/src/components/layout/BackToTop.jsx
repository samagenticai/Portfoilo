import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'
import AppIcon from '../ui/AppIcon'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      className={cn(
        'back-to-top fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40',
        'inline-flex h-11 w-11 items-center justify-center rounded-xl',
        'border border-white/10 bg-[rgba(3,7,18,0.82)] text-secondary shadow-lg shadow-black/30 backdrop-blur-xl',
        'transition-all duration-300 ease-out',
        'hover:border-secondary/35 hover:bg-primary/15 hover:text-text hover:shadow-[0_8px_28px_rgba(37,99,235,0.35)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-3 opacity-0 pointer-events-none',
      )}
    >
      <AppIcon name="arrow-up" size={18} className="!text-inherit" />
    </button>
  )
}
