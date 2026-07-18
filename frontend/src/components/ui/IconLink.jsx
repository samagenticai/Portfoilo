import { cn } from '../../lib/cn'

const iconLinkClasses =
  'inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted transition-all duration-300 ease-out touch-manipulation'

export default function IconLink({
  href,
  label,
  children,
  className,
  download,
  disabled = false,
  disabledTitle,
  ...props
}) {
  if (disabled || !href) {
    return (
      <span
        aria-label={label}
        aria-disabled="true"
        title={disabledTitle || label}
        className={cn(iconLinkClasses, 'cursor-not-allowed opacity-50', className)}
      >
        {children}
      </span>
    )
  }

  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      aria-label={label}
      download={download || undefined}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        iconLinkClasses,
        'hover:border-primary/40 hover:bg-primary/10 hover:text-text',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
