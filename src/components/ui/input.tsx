import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type InputProps = ComponentProps<'input'> & {
  /** Decorative leading icon; the field's label still names the control. */
  startIcon?: LucideIcon
  /** Trailing control, e.g. the password show/hide button. */
  endAdornment?: ReactNode
}

/** 48px pill with a soft shadow (Stitch design) plus a thin 3:1 control border. Error state comes from aria-invalid. */
export function Input({ className, startIcon: StartIcon, endAdornment, ...props }: InputProps) {
  return (
    <div className="relative">
      {StartIcon && (
        <StartIcon
          aria-hidden
          className="pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2 text-fg-muted"
        />
      )}
      <input
        className={cn(
          'h-12 w-full rounded-full border border-line-control bg-surface px-5 shadow-raised text-body-md text-fg transition-colors duration-(--motion-duration-fast) placeholder:text-fg-placeholder hover:border-line-control-hover aria-invalid:border-danger-solid disabled:cursor-not-allowed disabled:bg-subtle disabled:text-fg-disabled',
          StartIcon && 'ps-12',
          endAdornment && 'pe-12',
          className,
        )}
        {...props}
      />
      {endAdornment && <div className="absolute end-1 top-1/2 -translate-y-1/2">{endAdornment}</div>}
    </div>
  )
}
