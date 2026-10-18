import { cva } from 'class-variance-authority'

/**
 * Heights map to the control tokens: sm 36px, md 48px (default), lg 56px.
 * One primary button per view; labels name the outcome ("Create account").
 * Shared by Button and by router Links that must look exactly like a button.
 */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-colors duration-(--motion-duration-fast) ease-standard disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:bg-none disabled:text-fg-disabled aria-busy:cursor-progress',
  {
    variants: {
      variant: {
        // Amber gradient with white text, as the onboarding reference (owner's trial).
        primary: 'bg-(image:--gradient-accent) text-fg-on-accent hover:brightness-105 active:brightness-95',
        secondary: 'bg-inverse text-fg-inverse hover:bg-inverse-raised',
        outline:
          'border border-line-control bg-surface text-fg hover:border-line-control-hover hover:bg-subtle',
        surface: 'bg-surface text-fg shadow-raised hover:bg-subtle',
        ghost: 'text-fg-accent hover:bg-accent-subtle',
        /** Plain ink text, no fill (e.g. Skip). */
        text: 'text-fg hover:bg-accent-subtle',
        danger: 'bg-danger-solid text-fg-inverse hover:bg-danger-fg',
        /** Solid brand amber with ink text: the in-card action (Join), as the base component. */
        solid: 'bg-accent font-bold text-fg shadow-card hover:bg-accent-hover hover:shadow-raised',
        /** Quiet warm grey with a hairline: the secondary in-card action (View). */
        soft: 'border border-line-soft bg-soft font-bold text-fg hover:bg-soft-hover',
      },
      size: {
        sm: 'h-9 rounded-full px-4 text-label-md',
        /** Small action inside a card row (Join, View): 32px tall, 12px corners. */
        xs: 'h-8 rounded-tile px-4 text-xs',
        md: 'h-12 rounded-full px-6 text-label-lg',
        lg: 'h-14 rounded-full px-8 text-label-lg',
        /** Round icon-only button (back, next arrow). Give it an aria-label. */
        icon: 'size-12 rounded-full px-0 text-label-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)
