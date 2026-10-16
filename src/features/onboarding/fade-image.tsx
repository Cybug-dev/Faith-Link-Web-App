import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import './fade-image.scss'

/**
 * An <img> that shows a soft pulsing placeholder until the photo arrives, then
 * sharpens in, so slow connections never show an empty hole or a sudden pop.
 */
type FadeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> & {
  /** Required; use "" for a decorative photo. */
  alt: string
}

export function FadeImage({ alt, className, onLoad, ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      {...props}
      alt={alt}
      // Cached photos can finish before React attaches onLoad.
      ref={(el) => {
        if (el?.complete) setLoaded(true)
      }}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      className={cn('fade-image', loaded && 'fade-image--loaded', className)}
    />
  )
}
