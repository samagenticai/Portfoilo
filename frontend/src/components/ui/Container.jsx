import { cn } from '../../lib/cn'

export default function Container({ children, className, as: Component = 'div', ...props }) {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-7xl px-[var(--spacing-container)]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
