import { CircleAlert, Info } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Props the field hands to its control so label, hint and error are wired for assistive tech. */
export type FieldControlProps = {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}

/**
 * How a validation message reads:
 * - 'guide': the person is still typing in a field they haven't left; neutral, not an error yet.
 * - 'error': they left the field or submitted with it invalid; red and marked invalid.
 */
export type FieldMessageTone = 'guide' | 'error'

/** Inline validation line. Icon + words, never colour alone. */
export function FieldError({
  id,
  tone = 'error',
  children,
}: {
  id?: string
  tone?: FieldMessageTone
  children: ReactNode
}) {
  const Icon = tone === 'error' ? CircleAlert : Info
  return (
    <p
      id={id}
      className={cn('flex items-start gap-1.5 ps-1 text-xs', tone === 'error' ? 'text-danger-fg' : 'text-fg-secondary')}
    >
      <span className="flex h-lh shrink-0 items-center">
        <Icon aria-hidden className={cn('size-3.5', tone === 'guide' && 'text-fg-accent')} />
      </span>
      {children}
    </p>
  )
}

type FormFieldProps = {
  label: string
  /** Keeps the label for assistive tech but hides it visually (e.g. the verification code). */
  hideLabel?: boolean
  hint?: string
  /** Inline validation message under the field; replaces the hint while present. */
  error?: string
  /** Defaults to 'error'. Pass 'guide' while the person is still typing (see FieldMessageTone). */
  errorTone?: FieldMessageTone
  /** Sits opposite the label, e.g. "Forgot password?". */
  labelAction?: ReactNode
  /** Short status opposite the label (Stitch "Invalid syntax"), shown only while the field is in error. */
  errorLabel?: string
  children: (control: FieldControlProps) => ReactNode
}

export function FormField({
  label,
  hideLabel = false,
  hint,
  error,
  errorTone = 'error',
  labelAction,
  errorLabel,
  children,
}: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined
  const invalid = Boolean(error) && errorTone === 'error'

  return (
    <div className="flex flex-col gap-2">
      <div className={cn('flex items-baseline justify-between gap-3', hideLabel && 'sr-only')}>
        <label htmlFor={id} className="text-label-md text-fg">
          {label}
        </label>
        {labelAction}
        {invalid && errorLabel && (
          // The message below already explains the problem to assistive tech; this is a visual summary.
          <span aria-hidden className="text-xs font-medium text-danger-solid">
            {errorLabel}
          </span>
        )}
      </div>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': invalid ? true : undefined,
      })}
      {error ? (
        <FieldError id={errorId} tone={errorTone}>
          {error}
        </FieldError>
      ) : hint ? (
        <p id={hintId} className="flex items-center gap-1 ps-1 text-caption text-fg-secondary">
          <Info aria-hidden className="size-3.5 shrink-0 text-fg-accent" />
          {hint}
        </p>
      ) : null}
    </div>
  )
}
