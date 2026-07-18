import { forwardRef, useRef } from 'react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useMagneticElement } from '../../hooks/useMagneticElement'
import { cn } from '../../lib/cn'
import AppIcon from './AppIcon'
import Button from './Button'

const ResumeDownloadButton = forwardRef(function ResumeDownloadButton(
  {
    children = 'Download Resume',
    variant = 'primary',
    size = 'md',
    className,
    showIcon = true,
    magnetic = false,
    disabledTitle = 'Resume not uploaded yet',
    onClick,
    tabIndex,
    ...props
  },
  ref,
) {
  const wrapRef = useRef(null)
  const { hasResume, resumeUrl, resumeFileName } = usePortfolio()
  useMagneticElement(wrapRef, { enabled: magnetic })

  const buttonClassName = cn(
    magnetic && 'gallery-btn relative overflow-hidden',
    magnetic && variant === 'primary' && 'gallery-btn-primary',
    magnetic && variant === 'outline' && 'gallery-btn-outline',
    className,
  )

  const iconSize = size === 'sm' ? 15 : 16

  const button = !hasResume ? (
    <Button
      ref={ref}
      type="button"
      variant={variant}
      size={size}
      disabled
      title={disabledTitle}
      aria-disabled="true"
      className={cn('cursor-not-allowed opacity-50', buttonClassName)}
      tabIndex={tabIndex ?? -1}
      {...props}
    >
      {showIcon ? <AppIcon name="download" size={iconSize} className="!text-inherit" /> : null}
      {children}
    </Button>
  ) : (
    <Button
      ref={ref}
      as="a"
      href={resumeUrl}
      download={resumeFileName}
      variant={variant}
      size={size}
      className={buttonClassName}
      onClick={onClick}
      tabIndex={tabIndex}
      {...props}
    >
      {showIcon ? <AppIcon name="download" size={iconSize} className="!text-inherit" /> : null}
      {children}
    </Button>
  )

  if (!magnetic) return button

  return (
    <div
      ref={wrapRef}
      className={cn(
        'inline-flex max-w-full will-change-transform',
        className?.includes('w-full') && 'w-full',
      )}
    >
      {button}
    </div>
  )
})

export default ResumeDownloadButton
