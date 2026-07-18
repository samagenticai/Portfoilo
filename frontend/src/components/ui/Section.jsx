import { cn } from '../../lib/cn'
import Container from './Container'

export default function Section({
  children,
  id,
  className,
  containerClassName,
  as: Component = 'section',
  ...props
}) {
  return (
    <Component
      id={id}
      className={cn('section-padding scroll-mt-24', className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </Component>
  )
}
