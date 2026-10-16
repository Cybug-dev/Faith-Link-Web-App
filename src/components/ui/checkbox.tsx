import { Check } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'children'> & {
  /** Label content; may contain links. The whole row is the click target. */
  label: ReactNode
  /** Text style for the label, e.g. smaller type. Sets the line height the box lines up with. */
  labelClassName?: string
}

/**
 * Native checkbox (keyboard, form and screen-reader behaviour for free) with a
 * drawn box, as the Stitch "Mobile Auth UI Design" sign-in: a soft filled square
 * with no border; checked = amber fill + a check mark, so state never rests on
 * colour alone. Keyboard focus still gets the global focus ring.
 */
export function Checkbox({ label, labelClassName, className, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2">
      {/* 20px box, centred on the label's first line (h-lh = one line of the label text).
          The whole label row is the click target. */}
      <span className={cn('flex h-lh shrink-0 items-center text-body-md', labelClassName)}>
        <span className="relative flex size-5">
        <input
          type="checkbox"
          className={cn(
            'peer size-5 cursor-pointer appearance-none rounded-sm bg-muted transition-colors checked:bg-accent aria-invalid:bg-danger-strong',
            className,
          )}
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3.5 text-fg-on-accent opacity-0 transition-opacity peer-checked:opacity-100"
        />
        </span>
      </span>
      <span className={cn('text-body-md text-fg', labelClassName)}>{label}</span>
    </label>
  )
}
