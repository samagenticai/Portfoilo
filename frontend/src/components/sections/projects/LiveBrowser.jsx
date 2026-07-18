import { useEffect, useRef } from 'react'
import { cn } from '../../../lib/cn'
import AppIcon from '../../ui/AppIcon'
import SeoImage from '../../ui/SeoImage'
import { useGallery } from './GalleryFrame'

export default function LiveBrowser({ project, className }) {
  const scrollRef = useRef(null)
  const { hovered } = useGallery()
  const scrollRaf = useRef(0)
  const scrollPos = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !hovered) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) return undefined

    const tick = () => {
      scrollPos.current += 0.28
      if (scrollPos.current >= max) scrollPos.current = 0
      el.scrollTop = scrollPos.current
      scrollRaf.current = requestAnimationFrame(tick)
    }

    scrollRaf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(scrollRaf.current)
  }, [hovered])

  useEffect(() => {
    if (!hovered && scrollRef.current) {
      scrollPos.current = 0
      scrollRef.current.scrollTop = 0
    }
  }, [hovered])

  const { preview, domain, accent, status } = project

  return (
    <div
      className={cn(
        'gallery-browser relative transition-transform duration-700 ease-out',
        'group-hover/gallery:scale-[1.025]',
        className,
      )}
    >
      <div className="gallery-browser-shell relative overflow-hidden rounded-[1.125rem] border border-white/[0.12] bg-[#0a0f1a]/92 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.75),0_0_60px_-16px_rgba(37,99,235,0.35)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] bg-white/[0.04] px-3 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.5)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.5)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.5)]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-white/[0.07] bg-black/40 px-2.5 py-1">
            <AppIcon name="lock" size={11} className="text-emerald-400/90" />
            <span className="truncate font-mono text-[10px] text-slate-400 sm:text-[11px]">
              {domain}
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[14rem] overflow-hidden sm:max-h-[16.5rem] lg:max-h-[19rem]"
        >
          <div className={cn('min-h-[16rem] bg-gradient-to-br p-4 sm:min-h-[18rem] sm:p-5', accent)}>
            {preview?.coverImage || project.coverImage ? (
              <div className="mb-3 overflow-hidden rounded-lg border border-white/10">
                <SeoImage
                  src={preview?.coverImage || project.coverImage}
                  alt={`${project.title} project preview screenshot`}
                  className="h-28 w-full object-cover sm:h-32"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-secondary/85">
                  {status}
                </p>
                <h4 className="mt-1 text-sm font-bold text-text sm:text-base">{preview?.hero || project.title}</h4>
              </div>
              <span className="shrink-0 rounded-md border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-300">
                Live
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(preview?.stats || []).map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-center backdrop-blur-sm"
                >
                  <p className="text-[8px] uppercase tracking-wide text-muted">{s.label}</p>
                  <p className="mt-0.5 text-xs font-bold text-text">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              {(preview?.rows || []).map((row) => (
                <div
                  key={row.title}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-text sm:text-xs">{row.title}</p>
                    <p className="text-[9px] text-secondary">{row.status}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                    {row.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="gallery-browser-reflection pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/[0.12] to-transparent"
          aria-hidden="true"
        />
      </div>

      <div
        className="pointer-events-none absolute -bottom-4 left-[12%] right-[12%] h-8 rounded-[100%] bg-primary/25 blur-2xl transition-all duration-700 group-hover/gallery:bg-primary/40"
        aria-hidden="true"
      />
    </div>
  )
}
