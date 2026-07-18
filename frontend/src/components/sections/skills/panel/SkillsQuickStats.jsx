import { SKILLS_QUICK_STATS } from '../../../../constants/skills'
import AppIcon from '../../../ui/AppIcon'
import { cn } from '../../../../lib/cn'

const ICON_NAMES = {
  git: 'git',
  server: 'server',
  bolt: 'zap',
}

export default function SkillsQuickStats({ className }) {
  return (
    <div data-skills-stats className={cn('grid grid-cols-3 gap-2 px-4 py-3 sm:px-5', className)}>
      {SKILLS_QUICK_STATS.map((stat) => (
        <div
          key={stat.id}
          className="rounded-lg border border-border/40 bg-white/[0.02] px-2.5 py-2.5 text-center transition-colors duration-300 hover:border-primary/25 hover:bg-primary/[0.04]"
        >
          <div className="group/icon mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-secondary">
            <AppIcon name={ICON_NAMES[stat.icon] || 'code'} size={14} />
          </div>
          <p className="text-sm font-bold tabular-nums text-text">{stat.value}</p>
          <p className="mt-0.5 text-[0.5625rem] font-medium text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
