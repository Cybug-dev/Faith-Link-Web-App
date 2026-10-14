import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type InputProps = ComponentProps<'input'> & {
  /** Decorative leading icon; the field's label still names the control. */
  startIcon?: LucideIcon
  /** Trailing control, e.g. the password show/hide button. */
  endAdornment?: ReactNode
}

/**
 * 48px white pill with a soft shadow and no border (Stitch design).
 * Typing: amber ring in place of the global outline, and the leading icon turns dark amber.
 * Error (aria-invalid): red ring.
 */
export function Input({ className, startIcon: StartIcon, endAdornment, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          'peer h-12 w-full rounded-full bg-surface px-4 shadow-raised text-body-md text-fg transition-shadow duration-(--motion-duration-fast) placeholder:text-fg-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent aria-invalid:ring-2 aria-invalid:ring-danger-solid disabled:cursor-not-allowed disabled:bg-subtle disabled:text-fg-disabled',
          StartIcon && 'ps-11',
          endAdornment && 'pe-12',
          className,
        )}
        {...props}
      />
      {StartIcon && (
        <StartIcon
          aria-hidden
          className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-fg-muted transition-colors duration-(--motion-duration-fast) peer-focus-visible:text-fg-accent"
        />
      )}
      {endAdornment && <div className="absolute end-1 top-1/2 -translate-y-1/2">{endAdornment}</div>}
    </div>
  )
}
