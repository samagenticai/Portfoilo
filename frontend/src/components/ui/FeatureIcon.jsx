import AppIcon from './AppIcon'
import { cn } from '../../lib/cn'

export default function FeatureIcon({ name, className }) {
  return (
    <div
      className={cn(
        'group/icon flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14',
        'bg-gradient-to-br from-primary/20 to-secondary/10',
        'text-secondary ring-1 ring-inset ring-secondary/20',
        'transition-all duration-500 group-hover/card:shadow-lg group-hover/card:shadow-primary/20',
        className,
      )}
    >
      <AppIcon name={name} size={24} />
    </div>
  )
}
