import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-primary text-text hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35',
  secondary:
    'bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20',
  outline:
    'border border-border bg-transparent text-text hover:border-primary/40 hover:bg-primary/5',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-white/5',
}

const sizes = {
  sm: 'h-11 min-h-[44px] px-4 text-sm',
  md: 'h-11 min-h-[44px] px-6 text-sm',
  lg: 'h-12 min-h-[48px] px-8 text-base',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    as: Component = 'button',
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        'touch-manipulation',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
})

export default Button
