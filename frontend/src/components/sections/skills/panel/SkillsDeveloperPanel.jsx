import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../../../lib/cn'
import SkillsAnalyticsDashboard from './SkillsAnalyticsDashboard'
import SkillsCodeEditor from './SkillsCodeEditor'
import SkillsFocus from './SkillsFocus'
import SkillsProficiency from './SkillsProficiency'
import SkillsQuickStats from './SkillsQuickStats'

gsap.registerPlugin(ScrollTrigger)

export default function SkillsDeveloperPanel({ active = true, proficiency = [], profile, className }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const sections = root.querySelectorAll('[data-panel-section]')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sections,
        { y: 20 },
        {
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [active])

  return (
    <div
      ref={rootRef}
      data-skills-panel
      className={cn(
        'group/card feature-card-border relative overflow-hidden rounded-[var(--radius-card)] p-px',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="glass-card relative flex flex-col overflow-hidden rounded-[calc(var(--radius-card)-1px)]">
        <div
          className="skills-dashboard-scan pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"
          aria-hidden="true"
        />

        {/* Header */}
        <div
          data-panel-section
          className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-white/[0.02] px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              Developer Dashboard
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/[0.08] px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/50 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            <span className="text-[0.625rem] font-medium text-green-400">Live</span>
          </div>
        </div>

        {/* Analytics */}
        <div data-panel-section className="border-b border-border/40">
          <SkillsAnalyticsDashboard active={active} />
        </div>

        {/* Quick stats */}
        <div data-panel-section className="border-b border-border/40">
          <SkillsQuickStats />
        </div>

        {/* Proficiency bars */}
        <div data-panel-section className="border-b border-border/40">
          <SkillsProficiency items={proficiency} active={active} />
        </div>

        {/* Code editor */}
        <div data-panel-section className="border-b border-border/40">
          <SkillsCodeEditor active={active} profile={profile} />
        </div>

        {/* Current focus + progress */}
        <div data-panel-section>
          <SkillsFocus active={active} />
        </div>
      </div>
    </div>
  )
}
