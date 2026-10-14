import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { OtpInput } from '@/components/ui/otp-input'
import { clearPendingEmail, getPendingEmail, maskEmail } from '@/lib/pending-email'
import { formatClock, useCountdown } from '@/lib/use-countdown'
import { useDocumentTitle } from '@/lib/use-document-title'
import { AuthError, authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { OTP_LENGTH, verifyEmailSchema, type VerifyEmailValues } from './schemas'

/** Wait between code requests. Not in the backend contract yet: confirm when wiring. */
const RESEND_COOLDOWN_SECONDS = 30
/** From the auth contract: verification codes expire after 15 minutes. */
const CODE_LIFETIME_MINUTES = 15

export function VerifyEmailPage() {
  useDocumentTitle('Verify email')
  const email = getPendingEmail()
  // A refresh or a direct visit has nothing to verify: send them to start over.
  if (!email) return <Navigate to="/create-account" replace />
  return <VerifyEmailForm email={email} />
}

function VerifyEmailForm({ email }: { email: string }) {
  const navigate = useNavigate()
  // Arriving from a blocked sign-in: a code may not have just been sent, so allow an immediate resend.
  const unverified = (useLocation().state as { reason?: string } | null)?.reason === 'unverified'
  const { remaining, restart } = useCountdown(RESEND_COOLDOWN_SECONDS, unverified ? 0 : RESEND_COOLDOWN_SECONDS)
  const [failed, setFailed] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = handleSubmit(async ({ otp }) => {
    setFailed(false)
    try {
      await authClient.verifyEmail({ email, otp })
      clearPendingEmail()
      navigate('/home', { viewTransition: true })
    } catch (error) {
      if (error instanceof AuthError && error.code === 'INVALID_CODE') {
        setError('otp', { message: 'That code isn’t right. Check the code in your email and try again.' })
      } else if (error instanceof AuthError && error.code === 'CODE_EXPIRED') {
        setError('otp', { message: 'That code has expired. Request a new one below.' })
      } else {
        setFailed(true)
      }
    }
  })

  async function resend() {
    setResendState('sending')
    try {
      await authClient.resendVerificationCode({ email })
      restart()
      setResendState('sent')
    } catch {
      setResendState('failed')
    }
  }

  const canResend = remaining === 0 && resendState !== 'sending'

  return (
    <AuthLayout>
      <h1 className="text-headline-lg">Check your email</h1>
      <p className="mt-2 text-body-md text-fg-secondary">
        Enter the {OTP_LENGTH}-digit verification code we emailed to {maskEmail(email)}. It expires in{' '}
        {CODE_LIFETIME_MINUTES} minutes.
      </p>

      {unverified && (
        <Alert variant="info" className="mt-6">
          Verify your email to sign in. If you can’t find the code, request a new one below.
        </Alert>
      )}
      {failed && (
        <Alert variant="danger" className="mt-6">
          We couldn’t verify your email. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
        <FormField label="Verification code" hideLabel error={errors.otp?.message}>
          {(control_) => (
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <OtpInput
                  {...control_}
                  aria-label="Verification code"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.otp)}
                  disabled={isSubmitting}
                  // The code is the only task on this screen, and the person just navigated here:
                  // moving focus to it is expected, not disorienting.
                  // oxlint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              )}
            />
          )}
        </FormField>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Verify email
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-1">
        <p className="flex flex-wrap items-center gap-x-2 text-body-md text-fg-secondary">
          Didn’t get a code?
          <Button variant="ghost" size="sm" disabled={!canResend} loading={resendState === 'sending'} onClick={resend}>
            Resend code
          </Button>
        </p>
        {remaining > 0 && (
          // aria-live off: a per-second readout would flood screen readers.
          <p className="text-body-sm text-fg-muted" aria-live="off">
            You can request a new code in {formatClock(remaining)}.
          </p>
        )}
        <output className="block text-body-sm text-fg-secondary">
          {resendState === 'sent' && 'We sent a new code. It can take a minute to arrive.'}
          {resendState === 'failed' && 'We couldn’t send a new code. Try again in a moment.'}
        </output>
      </div>

      <p className="mt-8 text-body-md">
        <Link
          to={unverified ? '/sign-in' : '/create-account'}
          onClick={clearPendingEmail}
          className="font-semibold text-fg-accent underline"
        >
          Use a different email
        </Link>
      </p>
    </AuthLayout>
  )
}
