import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { NAV_LINKS, NAV_SECTION_IDS, SECTION_NAV_ALIAS } from '../../constants/navigation'
import { SITE_NAME } from '../../constants/seo'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { Container, ResumeDownloadButton } from '../ui'

function MenuIcon({ open }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className={cn(
          'origin-center transition-all duration-300 ease-out',
          open && 'translate-y-[5px] rotate-45',
        )}
        d="M4 7h16"
      />
      <path
        className={cn(
          'origin-center transition-all duration-300 ease-out',
          open && 'scale-x-0 opacity-0',
        )}
        d="M4 12h16"
      />
      <path
        className={cn(
          'origin-center transition-all duration-300 ease-out',
          open && '-translate-y-[5px] -rotate-45',
        )}
        d="M4 17h16"
      />
    </svg>
  )
}

function useActiveSection(sectionIds, enabled = true) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? 'home')

  useEffect(() => {
    if (!enabled) return undefined

    const update = () => {
      const marker = window.scrollY + Math.min(180, window.innerHeight * 0.28)
      let current = sectionIds[0]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= marker + 8) current = id
      }

      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds, enabled])

  return activeId
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined

    const scrollY = window.scrollY
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const { body, documentElement } = document

    const prev = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: documentElement.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    }

    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      body.style.overflow = prev.bodyOverflow
      documentElement.style.overflow = prev.htmlOverflow
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.width = prev.bodyWidth
      body.style.paddingRight = prev.bodyPaddingRight
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isScrolled = useScrollPosition()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const sectionActive = useActiveSection(NAV_SECTION_IDS, isHome)
  const resolvedSection = SECTION_NAV_ALIAS[sectionActive] || sectionActive
  const activeId = isHome
    ? resolvedSection
    : location.pathname === '/projects'
      ? 'projects'
      : resolvedSection

  useBodyScrollLock(isMenuOpen)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleNavClick = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const isActive = (href) => href === `#${activeId}`
  const toHash = (href) => `/${href}`

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background,box-shadow,border-color,backdrop-filter] duration-300',
        isScrolled || isMenuOpen
          ? 'glass border-b border-border shadow-lg shadow-black/10 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <nav
          className="flex h-16 items-center justify-between gap-4 lg:h-20"
          aria-label="Main navigation"
        >
          <Link
            to="/#home"
            aria-label={`${SITE_NAME} home`}
            className="group flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight transition-colors hover:text-secondary"
            onClick={handleNavClick}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm text-primary transition-colors group-hover:bg-primary/20">
              {'</>'}
            </span>
            <span className="min-w-0 truncate text-base sm:text-lg">{SITE_NAME}</span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <li key={link.href}>
                  <Link
                    to={toHash(link.href)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'nav-link relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium',
                      'transition-colors duration-300',
                      active
                        ? 'text-text'
                        : 'text-muted hover:bg-white/5 hover:text-text',
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'pointer-events-none absolute bottom-1 left-3 right-3 h-0.5 origin-center rounded-full',
                        'bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out',
                        active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden lg:block">
            <ResumeDownloadButton variant="primary" size="sm" className="nav-resume-btn shadow-lg shadow-primary/25" />
          </div>

          <button
            type="button"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden',
              'border border-border text-text transition-colors duration-300',
              'hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            )}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <MenuIcon open={isMenuOpen} />
          </button>
        </nav>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out lg:hidden',
          isMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!isMenuOpen}
      >
        <Container className="border-t border-border pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <li key={link.href}>
                  <Link
                    to={toHash(link.href)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-lg px-4 py-3.5 text-base font-medium transition-colors duration-300',
                      active
                        ? 'bg-primary/15 text-text'
                        : 'text-muted hover:bg-white/5 hover:text-text',
                    )}
                    onClick={handleNavClick}
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    {link.label}
                    {active ? (
                      <span
                        className="absolute bottom-2 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                        aria-hidden="true"
                      />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 px-4">
            <ResumeDownloadButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleNavClick}
              tabIndex={isMenuOpen ? 0 : -1}
            />
          </div>
        </Container>
      </div>
    </header>
  )
}
