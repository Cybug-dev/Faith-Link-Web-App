import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import './skeleton.scss'

type SkeletonProps = ComponentProps<'div'> & {
  variant?: 'text' | 'circular' | 'rectangular' | 'button' | 'badge'
  width?: string | number
  height?: string | number
}

/**
 * Generic, premium skeleton placeholder for loading states across the app.
 * Features a soft, restrained shimmer animation that respects reduced motion.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton', `skeleton-${variant}`, className)}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  )
}
