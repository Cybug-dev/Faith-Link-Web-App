import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { OtpInput } from '@/components/ui/otp-input'
import { PasswordInput } from '@/components/ui/password-input'
import { clearPendingEmail, getPendingEmail, maskEmail } from '@/lib/pending-email'
import { formatClock, useCountdown } from '@/lib/use-countdown'
import { useDocumentTitle } from '@/lib/use-document-title'
import { AuthError, authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { MIN_PASSWORD_LENGTH, OTP_LENGTH, resetPasswordSchema, type ResetPasswordValues } from './schemas'

/** Same wait as the verify email screen. */
const RESEND_COOLDOWN_SECONDS = 30
/** Neon Auth codes expire after 15 minutes. */
const CODE_LIFETIME_MINUTES = 15

/** No Stitch design: built on the Verify email skeleton, plus the Create account password fields. */
export function ResetPasswordPage() {
  useDocumentTitle('Reset password')
  const email = getPendingEmail()
  // A refresh or a direct visit has no email to reset: start over.
  if (!email) return <Navigate to="/forgot-password" replace />
  return <ResetPasswordForm email={email} />
}

function ResetPasswordForm({ email }: { email: string }) {
  const navigate = useNavigate()
  const { remaining, restart } = useCountdown(RESEND_COOLDOWN_SECONDS)
  const [failed, setFailed] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', password: '', confirmPassword: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = handleSubmit(async ({ otp, password }) => {
    setFailed(false)
    try {
      await authClient.resetPassword({ email, otp, password })
    } catch (error) {
      if (error instanceof AuthError && error.code === 'INVALID_CODE') {
        setError('otp', { message: 'That code isn’t right. Check the code in your email and try again.' })
      } else if (error instanceof AuthError && error.code === 'CODE_EXPIRED') {
        setError('otp', { message: 'That code has expired. Request a new one below.' })
      } else {
        setFailed(true)
      }
      return
    }
    clearPendingEmail()
    // The password is already changed; if the automatic sign-in fails, sign in by hand.
    try {
      await authClient.signInWithEmail({ email, password })
      navigate('/home', { viewTransition: true })
    } catch {
      navigate('/sign-in', { viewTransition: true })
    }
  })

  async function resend() {
    setResendState('sending')
    try {
      await authClient.requestPasswordReset({ email })
      restart()
      setResendState('sent')
    } catch {
      setResendState('failed')
    }
  }

  const canResend = remaining === 0 && resendState !== 'sending'

  return (
    <AuthLayout>
      <h1 className="text-headline-lg">Set a new password</h1>
      <p className="mt-2 text-body-md text-fg-secondary">
        Enter the {OTP_LENGTH}-digit code we emailed to {maskEmail(email)}, then choose a new password. The code
        expires in {CODE_LIFETIME_MINUTES} minutes.
      </p>

      {failed && (
        <Alert variant="danger" className="mt-6">
          We couldn’t reset your password. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
        <FormField label="Reset code" hideLabel error={errors.otp?.message}>
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
                  invalid={Boolean(errors.otp)}
                  disabled={isSubmitting}
                  // The code is the first task on this screen and the person just navigated here.
                  // oxlint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              )}
            />
          )}
        </FormField>

        <FormField
          label="New password"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters with a number and symbol`}
          error={errors.password?.message}
        >
          {(control_) => (
            <PasswordInput
              {...control_}
              {...register('password')}
              autoComplete="new-password"
              placeholder="Create a new password"
            />
          )}
        </FormField>

        <FormField label="Confirm new password" error={errors.confirmPassword?.message}>
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
        <Link to="/forgot-password" onClick={clearPendingEmail} className="font-semibold text-fg-accent underline">
          Use a different email
        </Link>
      </p>
    </AuthLayout>
  )
}
