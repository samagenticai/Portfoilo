import { cn } from '../../lib/cn'

const tags = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
}

const styles = {
  h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]',
  h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]',
  h3: 'text-2xl sm:text-3xl font-semibold tracking-tight leading-snug',
  h4: 'text-xl sm:text-2xl font-semibold tracking-tight leading-snug',
}

export default function Heading({
  as = 'h2',
  children,
  className,
  gradient = false,
  ...props
}) {
  const Tag = tags[as] || as

  return (
    <Tag
      className={cn(
        styles[as] || styles.h2,
        gradient && 'text-gradient',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
