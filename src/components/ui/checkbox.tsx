import { Check } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'children'> & {
  /** Label content; may contain links. The whole row is the click target. */
  label: ReactNode
}

/**
 * Native checkbox (keyboard, form and screen-reader behaviour for free) with a
 * drawn box. Checked = amber fill + a check mark, so state never rests on colour
 * alone, and the box keeps its 3:1 control border.
 */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-body-md text-fg">
      <span className="relative flex size-6 shrink-0">
        <input
          type="checkbox"
          className={cn(
            'peer size-6 cursor-pointer appearance-none rounded-sm border border-line-control bg-surface transition-colors checked:bg-accent aria-invalid:border-danger-solid',
            className,
          )}
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={2.5}
          className="pointer-events-none absolute inset-0 m-auto size-4 text-fg-on-accent opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span>{label}</span>
    </label>
  )
}
