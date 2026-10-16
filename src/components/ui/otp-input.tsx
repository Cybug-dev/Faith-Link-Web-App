import { OTPInput, REGEXP_ONLY_DIGITS, type SlotProps } from 'input-otp'
import { cn } from '@/lib/cn'

type OtpInputProps = {
  value: string
  onChange: (value: string) => void
  length?: number
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
  id?: string
  'aria-describedby'?: string
  'aria-label'?: string
}

function OtpSlot({ char, isActive, hasFakeCaret, invalid }: SlotProps & { invalid: boolean }) {
  return (
    <div
      className={cn(
        // Filled boxes with no border, matching the Stitch auth checkbox. The box being typed in
        // turns light amber (plus the caret); an invalid code tints every box red.
        'relative flex h-14 flex-1 items-center justify-center rounded-md text-title-lg text-fg transition-colors duration-(--motion-duration-fast)',
        invalid ? 'bg-danger-strong text-danger-fg' : isActive ? 'bg-accent-subtle' : 'bg-muted',
      )}
    >
      {char}
      {hasFakeCaret && (
        <span aria-hidden className="absolute h-6 w-px animate-pulse bg-fg" />
      )}
    </div>
  )
}

/**
 * One real input drawn as boxes (input-otp), so paste, autofill from SMS/email
 * (autocomplete="one-time-code"), backspace and screen readers behave natively.
 */
export function OtpInput({ length = 6, invalid = false, ...props }: OtpInputProps) {
  return (
    <OTPInput
      {...props}
      maxLength={length}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="one-time-code"
      aria-invalid={invalid || undefined}
      containerClassName="flex gap-2"
      render={({ slots }) => (
        <>
          {slots.map((slot, i) => (
            <OtpSlot key={i} {...slot} invalid={invalid} />
          ))}
        </>
      )}
    />
  )
}
