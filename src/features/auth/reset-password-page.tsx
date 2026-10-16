import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { OtpInput } from '@/components/ui/otp-input'
import { PasswordInput } from '@/components/ui/password-input'
import { clearPendingEmail, getPendingEmail, maskEmail } from '@/lib/pending-email'
import { formatClock, useCountdown } from '@/lib/use-countdown'
import { fieldTone } from '@/lib/field-tone'
import { useDocumentTitle } from '@/lib/use-document-title'
import { AuthError, authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { PASSWORD_RESET_STATE } from './navigation-state'
import {
  dailyLimitMessage,
  guessesLeft,
  lockCurrentCode,
  nextResetCodeAt,
  recordResetCodeSent,
  recordWrongGuess,
} from './reset-limits'
import {
  MIN_PASSWORD_LENGTH,
  OTP_LENGTH,
  resetCodeSchema,
  resetPasswordSchema,
  type ResetCodeValues,
  type ResetPasswordValues,
} from './schemas'

/** Same wait as the verify email screen. */
const RESEND_COOLDOWN_SECONDS = 30
/** Neon Auth codes expire after 15 minutes. */
const CODE_LIFETIME_MINUTES = 15

const LOCKED_MESSAGE = 'Too many wrong tries. Request a new code below.'

const CODE_MESSAGES = {
  INVALID_CODE: 'That code isn’t right. Check the code in your email and try again.',
  CODE_EXPIRED: 'That code has expired. Request a new one below.',
  TOO_MANY_ATTEMPTS: LOCKED_MESSAGE,
} as const

/** Message for a code the server rejected, or null for any other failure. */
function codeMessage(error: unknown): string | null {
  if (error instanceof AuthError && error.code in CODE_MESSAGES) {
    return CODE_MESSAGES[error.code as keyof typeof CODE_MESSAGES]
  }
  return null
}

const triesLeft = (n: number) => `That code isn’t right. ${n} ${n === 1 ? 'try' : 'tries'} left.`


/**
 * Two steps on one route: confirm the emailed code first, and only then choose a
 * new password (owner: asking for a password before the code is confirmed is bad UX).
 * No Stitch design: built on the Verify email skeleton, plus the Create account password fields.
 */
export function ResetPasswordPage() {
  useDocumentTitle('Reset password')
  const email = getPendingEmail()
  const [code, setCode] = useState<string | null>(null)
  // The new-password step can still learn the code went stale (e.g. it expired meanwhile).
  const [codeError, setCodeError] = useState<string | null>(null)

  // A refresh or a direct visit has no email to reset: start over.
  if (!email) return <Navigate to="/forgot-password" replace />

  if (code === null) {
    return <CodeStep email={email} initialError={codeError} onConfirmed={setCode} />
  }
  return (
    <NewPasswordStep
      email={email}
      otp={code}
      onCodeRejected={(message) => {
        setCodeError(message)
        setCode(null)
      }}
    />
  )
}

function CodeStep({
  email,
  initialError,
  onConfirmed,
}: {
  email: string
  initialError: string | null
  onConfirmed: (otp: string) => void
}) {
  const { remaining, restart } = useCountdown(RESEND_COOLDOWN_SECONDS)
  const [failed, setFailed] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  // 3 wrong guesses (or Neon refusing more) use the code up until a new one is sent.
  const [locked, setLocked] = useState(() => guessesLeft(email) === 0)
  const [retryAt, setRetryAt] = useState(() => nextResetCodeAt(email))

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting, isSubmitted, touchedFields },
  } = useForm<ResetCodeValues>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: { otp: '' },
  })

  // Back from the password step because the server rejected the code, or the code was
  // already used up on an earlier visit: say why.
  const openingError = initialError ?? (locked ? LOCKED_MESSAGE : null)
  useEffect(() => {
    if (openingError) setError('otp', { message: openingError })
    // Only on arrival; later errors come from submitting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = handleSubmit(async ({ otp }) => {
    setFailed(false)
    try {
      await authClient.checkResetCode({ email, otp })
    } catch (error) {
      if (error instanceof AuthError && error.code === 'INVALID_CODE') {
        const left = recordWrongGuess(email)
        if (left > 0) setError('otp', { message: triesLeft(left) })
        else {
          setLocked(true)
          setError('otp', { message: LOCKED_MESSAGE })
        }
        return
      }
      if (error instanceof AuthError && error.code === 'TOO_MANY_ATTEMPTS') {
        lockCurrentCode(email)
        setLocked(true)
      }
      const message = codeMessage(error)
      if (message) setError('otp', { message })
      else setFailed(true)
      return
    }
    onConfirmed(otp)
  })

  async function resend() {
    const nextAt = nextResetCodeAt(email)
    if (nextAt !== null) {
      setRetryAt(nextAt)
      return
    }
    setResendState('sending')
    try {
      await authClient.requestPasswordReset({ email })
      recordResetCodeSent(email)
      setRetryAt(nextResetCodeAt(email))
      setLocked(false)
      resetField('otp')
      clearErrors('otp')
      restart()
      setResendState('sent')
    } catch {
      setResendState('failed')
    }
  }

  const canResend = remaining === 0 && resendState !== 'sending' && retryAt === null
  const tone = openingError || locked ? 'error' : fieldTone(touchedFields.otp, isSubmitted)

  return (
    <AuthLayout>
      <h1 className="text-headline-lg">Enter your reset code</h1>
      <p className="mt-2 text-body-md text-fg-secondary">
        We emailed a {OTP_LENGTH}-digit code to {maskEmail(email)}. It expires in {CODE_LIFETIME_MINUTES} minutes.
      </p>

      {failed && (
        <Alert variant="danger" className="mt-6">
          We couldn’t check your code. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
        <FormField label="Reset code" hideLabel error={errors.otp?.message} errorTone={tone}>
          {(control_) => (
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <OtpInput
                  {...control_}
                  aria-label="Reset code"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.otp) && tone === 'error'}
                  disabled={isSubmitting || locked}
                  // The code is the only task on this screen and the person just navigated here.
                  // oxlint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              )}
            />
          )}
        </FormField>

        <Button type="submit" size="lg" loading={isSubmitting} disabled={locked} className="w-full">
          Continue
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-1">
        <p className="flex flex-wrap items-center gap-x-2 text-body-md text-fg-secondary">
          Didn’t get a code?
          <Button variant="ghost" size="sm" disabled={!canResend} loading={resendState === 'sending'} onClick={resend}>
            Resend code
          </Button>
        </p>
        {remaining > 0 && retryAt === null && (
          // aria-live off: a per-second readout would flood screen readers.
          <p className="text-body-sm text-fg-muted" aria-live="off">
            You can request a new code in {formatClock(remaining)}.
          </p>
        )}
        <output className="block text-body-sm text-fg-secondary">
          {resendState === 'sent' && 'We sent a new code. It can take a minute to arrive.'}
          {resendState === 'failed' && 'We couldn’t send a new code. Try again in a moment.'}
          {retryAt !== null && dailyLimitMessage(retryAt)}
        </output>
      </div>

      <p className="mt-8 text-body-md">
        <Link to="/forgot-password" onClick={clearPendingEmail} className="font-semibold text-fg-accent underline">
          Use a different email
        </Link>
      </p>
    </AuthLayout>
  )
}

function NewPasswordStep({
  email,
  otp,
  onCodeRejected,
}: {
  email: string
  otp: string
  onCodeRejected: (message: string) => void
}) {
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, touchedFields },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    // Live feedback: each field is checked as it is typed, and its message clears once the value is valid.
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async ({ password }) => {
    setFailed(false)
    try {
      await authClient.resetPassword({ email, otp, password })
    } catch (error) {
      const message = codeMessage(error)
      if (message) onCodeRejected(message)
      else setFailed(true)
      return
    }
    clearPendingEmail()
    // Owner: after a reset, sign in again with the new password (no automatic sign-in).
    navigate('/sign-in', { replace: true, state: PASSWORD_RESET_STATE, viewTransition: true })
  })

  return (
    <AuthLayout>
      <h1 className="text-headline-lg">Set a new password</h1>
      <p className="mt-2 text-body-md text-fg-secondary">Code confirmed. Choose a new password for {maskEmail(email)}.</p>

      {failed && (
        <Alert variant="danger" className="mt-6">
          We couldn’t reset your password. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
        <FormField
          label="New password"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters with a number and symbol`}
          error={errors.password?.message}
          errorTone={fieldTone(touchedFields.password, isSubmitted)}
        >
          {(control_) => (
            <PasswordInput
              {...control_}
              {...register('password')}
              autoComplete="new-password"
              placeholder="Create a new password"
              // First field of a step the person just moved to.
              // oxlint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          )}
        </FormField>

        <FormField
          label="Confirm new password"
          error={errors.confirmPassword?.message}
          errorTone={fieldTone(touchedFields.confirmPassword, isSubmitted)}
        >
          {(control_) => (
            <PasswordInput
              {...control_}
              {...register('confirmPassword')}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
            />
          )}
        </FormField>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Reset password
        </Button>
      </form>
    </AuthLayout>
  )
}
