import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * Heights map to the control tokens: sm 36px, md 48px (default), lg 56px.
 * One primary button per view; labels name the outcome ("Create account").
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-label-lg transition-colors duration-(--motion-duration-fast) ease-standard disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:bg-none disabled:text-fg-disabled aria-busy:cursor-progress',
  {
    variants: {
      variant: {
        // Amber gradient with white text, as the onboarding reference (owner's trial).
        primary: 'bg-(image:--gradient-accent) text-fg-on-accent hover:brightness-105 active:brightness-95',
        secondary: 'bg-inverse text-fg-inverse hover:bg-fg',
        outline:
          'border border-line-control bg-surface text-fg hover:border-line-control-hover hover:bg-subtle',
        surface: 'bg-surface text-fg shadow-raised hover:bg-subtle',
        ghost: 'text-fg-accent hover:bg-accent-subtle',
        /** Plain ink text, no fill (e.g. Skip). */
        text: 'text-fg hover:bg-accent-subtle',
        danger: 'bg-danger-solid text-fg-inverse hover:bg-danger-fg',
      },
      size: {
        sm: 'h-9 px-4 text-label-md',
        md: 'h-12 px-6',
        lg: 'h-14 px-8',
        /** Round icon-only button (back, next arrow). Give it an aria-label. */
        icon: 'size-12 px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Shows a spinner and blocks repeat submits. The label stays so the width doesn't jump. */
    loading?: boolean
  }

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden className="size-5 animate-spin" />}
      {children}
    </button>
  )
}
