import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { setPendingEmail } from '@/lib/pending-email'
import { fieldTone } from '@/lib/field-tone'
import { useDocumentTitle } from '@/lib/use-document-title'
import { AuthError, authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { dailyLimitMessage, nextResetCodeAt, recordResetCodeSent } from './reset-limits'
import { emailErrorLabel, OTP_LENGTH, forgotPasswordSchema, type ForgotPasswordValues } from './schemas'

type FormError = { kind: 'daily-limit'; retryAt: number } | { kind: 'rate-limited' } | { kind: 'unknown' } | null

/** No Stitch design: built on the Verify email skeleton (auth archetype). */
export function ForgotPasswordPage() {
  useDocumentTitle('Forgot password')
  const navigate = useNavigate()
  const [formError, setFormError] = useState<FormError>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, touchedFields },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    // Live feedback: each field is checked as it is typed, and its message clears once the value is valid.
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null)
    const retryAt = nextResetCodeAt(email)
    if (retryAt !== null) {
      setFormError({ kind: 'daily-limit', retryAt })
      return
    }
    try {
      // Succeeds for unknown emails too, so this screen never reveals who has an account.
      await authClient.requestPasswordReset({ email })
      recordResetCodeSent(email)
      setPendingEmail(email)
      navigate('/reset-password', { viewTransition: true })
    } catch (error) {
      setFormError({ kind: error instanceof AuthError && error.code === 'RATE_LIMITED' ? 'rate-limited' : 'unknown' })
    }
  })

  return (
    <AuthLayout>
      <h1 className="text-headline-lg">Forgot your password?</h1>
      <p className="mt-2 text-body-md text-fg-secondary">
        Enter the email you use for FaithLink. If it has an account, we’ll send a {OTP_LENGTH}-digit code to reset your
        password.
      </p>

      {formError?.kind === 'daily-limit' && (
        <Alert variant="danger" className="mt-6">
          {dailyLimitMessage(formError.retryAt)}
        </Alert>
      )}
      {formError?.kind === 'rate-limited' && (
        <Alert variant="danger" className="mt-6">
          Too many requests. Wait a few minutes, then try again.
        </Alert>
      )}
      {formError?.kind === 'unknown' && (
        <Alert variant="danger" className="mt-6">
          We couldn’t send a code. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
        <FormField
          label="Email address"
          error={errors.email?.message}
          errorTone={fieldTone(touchedFields.email, isSubmitted)}
          errorLabel={emailErrorLabel(errors.email?.type)}
        >
          {(control) => (
            <Input
              {...control}
              {...register('email')}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              startIcon={Mail}
            />
          )}
        </FormField>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Send code
        </Button>
      </form>

      <p className="mt-8 text-body-md">
        <Link to="/sign-in" viewTransition className="font-semibold text-fg-accent underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
