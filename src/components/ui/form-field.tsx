import { CircleAlert } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Props the field hands to its control so label, hint and error are wired for assistive tech. */
export type FieldControlProps = {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
}

/** Inline error line. Icon + words, never colour alone. */
export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 text-body-sm text-danger-fg">
      <span className="flex h-5 shrink-0 items-center">
        <CircleAlert aria-hidden className="size-4" />
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
  /** Inline error under the field; replaces the hint while present. */
  error?: string
  /** Sits opposite the label, e.g. "Forgot password?". */
  labelAction?: ReactNode
  children: (control: FieldControlProps) => ReactNode
}

export function FormField({ label, hideLabel = false, hint, error, labelAction, children }: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className="flex flex-col gap-2">
      <div className={cn('flex items-baseline justify-between gap-3', hideLabel && 'sr-only')}>
        <label htmlFor={id} className="text-label-lg text-fg">
          {label}
        </label>
        {labelAction}
      </div>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error ? (
        <FieldError id={errorId}>{error}</FieldError>
      ) : hint ? (
        <p id={hintId} className="text-body-sm text-fg-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
