import { forwardRef, useRef } from 'react'
import { cn } from '../../../lib/cn'
import Button from '../../ui/Button'
import { useMagneticElement } from '../../../hooks/useMagneticElement'

const MagneticButton = forwardRef(function MagneticButton(
  { magnetic = true, className, variant = 'primary', ...props },
  forwardedRef,
) {
  const wrapRef = useRef(null)
  useMagneticElement(wrapRef, { enabled: magnetic })

  return (
    <div
      ref={wrapRef}
      className={cn('inline-flex max-w-full will-change-transform', className?.includes('w-full') && 'w-full')}
    >
      <Button
        ref={forwardedRef}
        variant={variant}
        className={cn(
          'gallery-btn relative overflow-hidden',
          variant === 'primary' && 'gallery-btn-primary',
          variant === 'outline' && 'gallery-btn-outline',
          className,
        )}
        {...props}
      />
    </div>
  )
})

export default MagneticButton
