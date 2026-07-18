import { cn } from '../../lib/cn'

/**
 * SEO-friendly image: lazy loading, async decode, responsive by default.
 */
export default function SeoImage({
  src,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  sizes,
  srcSet,
  ...props
}) {
  if (!src) return null

  return (
    <img
      src={src}
      alt={alt || ''}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      srcSet={srcSet}
      className={cn(className)}
      {...props}
    />
  )
}
