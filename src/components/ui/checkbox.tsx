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
 * drawn box. Checked = amber fill + a check mark, so state never rests on colour
 * alone, and the box keeps its 3:1 control border.
 */
export function Checkbox({ label, labelClassName, className, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2">
      {/* 16px box, centred on the label's first line (h-lh = one line of the label text).
          The whole label row is the click target. */}
      <span className={cn('flex h-lh shrink-0 items-center text-body-md', labelClassName)}>
        <span className="relative flex size-4">
        <input
          type="checkbox"
          className={cn(
            'peer size-4 cursor-pointer appearance-none rounded-xs border border-line-control bg-surface transition-colors checked:bg-accent aria-invalid:border-danger-solid',
            className,
          )}
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3 text-fg-on-accent opacity-0 peer-checked:opacity-100"
        />
        </span>
      </span>
      <span className={cn('text-body-md text-fg', labelClassName)}>{label}</span>
    </label>
  )
}
