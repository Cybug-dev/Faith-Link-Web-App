import { cva, type VariantProps } from 'class-variance-authority'
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const alertVariants = cva('flex gap-2 rounded-md border p-4 text-body-sm', {
  variants: {
    variant: {
      // Stitch error banner: borderless pink container, bright-red title and icon, dark-red description.
      danger: 'border-transparent bg-danger-strong text-danger-fg',
      warning: 'border-warning-line bg-warning text-warning-fg',
      success: 'border-success-line bg-success text-success-fg',
      info: 'border-info-line bg-info text-info-fg',
    },
  },
  defaultVariants: { variant: 'info' },
})

type Variant = NonNullable<VariantProps<typeof alertVariants>['variant']>

/** Title and icon colours that differ from the body text. */
const accents: Partial<Record<Variant, { title: string; icon: string }>> = {
  // Filled disc: fill takes the bright red, the stroke (ring and "!") takes the banner colour.
  danger: { title: 'text-danger-solid', icon: 'size-5.5 fill-danger-solid text-danger-strong' },
}

const icons: Record<Variant, LucideIcon> = {
  danger: CircleAlert,
  warning: TriangleAlert,
  success: CircleCheck,
  info: Info,
}

type AlertProps = VariantProps<typeof alertVariants> & {
  title?: string
  children: ReactNode
  className?: string
}

/**
 * Form-level / page-level message. Status is icon + words, not colour alone.
 * Danger announces immediately (role="alert"); the rest are polite status updates.
 */
export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const resolved: Variant = variant ?? 'info'
  const Icon = icons[resolved]
  const accent = accents[resolved]
  return (
    <div role={resolved === 'danger' ? 'alert' : 'status'} className={cn(alertVariants({ variant }), className)}>
      <span className="flex h-6 shrink-0 items-center">
        <Icon aria-hidden className={accent?.icon ?? 'size-5'} />
      </span>
      <div className="min-w-0">
        {title && <p className={cn('text-title-md', accent?.title)}>{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
