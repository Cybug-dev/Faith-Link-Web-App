import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type SelectProps = ComponentProps<'select'> & {
  /** Short 36px pill with tight padding on phones; the standard 52px pill from tablet up. */
  isCompactOnPhone?: boolean
}

/**
 * Native select drawn like Input: white pill, soft shadow, no border, amber focus ring.
 * Native so phones get their own picker and keyboard support comes for free.
 */
export function Select({ className, children, isCompactOnPhone = false, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'peer h-13 w-full cursor-pointer appearance-none rounded-full bg-surface ps-4 pe-11 shadow-raised text-body-sm text-fg transition-shadow duration-(--motion-duration-fast) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:bg-subtle disabled:text-fg-disabled',
          isCompactOnPhone && 'h-(--control-h-sm) ps-3 pe-8 text-label-sm tablet:h-13 tablet:ps-4 tablet:pe-11 tablet:text-body-sm',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className={cn(
          'pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-fg-muted transition-colors duration-(--motion-duration-fast) peer-focus-visible:text-fg-accent',
          isCompactOnPhone && 'end-3 size-4 tablet:end-4 tablet:size-5',
        )}
      />
    </div>
  )
}
