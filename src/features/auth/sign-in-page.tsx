import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { OrDivider } from '@/components/ui/or-divider'
import { PasswordInput } from '@/components/ui/password-input'
import { setPendingEmail } from '@/lib/pending-email'
import { fieldTone } from '@/lib/field-tone'
import { useDocumentTitle } from '@/lib/use-document-title'
import { AuthError, authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { AuthTabs } from './auth-tabs'
import { GoogleButton } from './google-button'
import { cameFromPasswordReset } from './navigation-state'
import { emailErrorLabel, signInSchema, type SignInValues } from './schemas'
import { SignInBanner } from './auth-banners'
import { SIGN_IN_SCRIPTURE, authImages } from './scripture'
import { ScriptureCard } from './scripture-card'

type FormError = 'credentials' | 'unknown' | null

/** Layout and copy follow the Stitch "FaithLink Sign In" screen (see docs/ui/stitch-sources.md). */
export function SignInPage() {
  useDocumentTitle('Sign in')
  const navigate = useNavigate()
  const passwordReset = cameFromPasswordReset(useLocation().state)
  const [formError, setFormError] = useState<FormError>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitted, touchedFields },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
    // Live feedback: each field is checked as it is typed, and its message clears once the value is valid.
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await authClient.signInWithEmail(values)
      navigate('/home', { viewTransition: true })
    } catch (error) {
      if (error instanceof AuthError && error.code === 'EMAIL_NOT_VERIFIED') {
        setPendingEmail(values.email)
        navigate('/verify-email', { state: { reason: 'unverified' }, viewTransition: true })
        return
      }
      // Input is kept so the person can correct it.
      if (error instanceof AuthError && error.code === 'INVALID_CREDENTIALS') {
        setFormError('credentials')
        // Neutral on purpose: never confirm that this email has an account. Clears when the password is edited.
        setError('password', { message: 'Check your email and password, then try again.' })
        return
      }
      setFormError('unknown')
    }
  })

  return (
    <AuthLayout
      banner={<SignInBanner />}
      image={authImages.signIn}
      scripture={SIGN_IN_SCRIPTURE}
    >
      <AuthTabs />
      <h1 className="mt-6 text-headline-lg">Welcome back</h1>
      <p className="mt-1 text-body-sm text-fg-secondary">
        Sign in to continue your journey and connect with your community.
      </p>

      {passwordReset && !formError && (
        <Alert variant="success" className="mt-4">
          Password updated. Sign in with your new password.
        </Alert>
      )}
      {formError === 'credentials' && (
        // Stitch "FaithLink Sign In - Error State". Same wording whether the email exists or not.
        <Alert variant="danger" title="Authentication failed" className="mt-4">
          Incorrect email or password. Please verify your details or reset your access below.
          <Link
            to="/forgot-password"
            className="mt-2.5 flex w-fit items-center gap-1 text-label-sm text-danger-solid hover:underline"
          >
            Reset password
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </Alert>
      )}
      {formError === 'unknown' && (
        <Alert variant="danger" className="mt-4">
          We couldn’t sign you in. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
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

        <FormField
          label="Password"
          error={errors.password?.message}
          errorTone={fieldTone(touchedFields.password, isSubmitted)}
          labelAction={
            <Link to="/forgot-password" className="text-label-sm text-fg-accent hover:underline">
              Forgot password?
            </Link>
          }
        >
          {(control) => (
            <PasswordInput
              {...control}
              {...register('password')}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          )}
        </FormField>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Checkbox {...register('rememberMe')} label="Remember me" labelClassName="text-xs" />
          {/* Stitch says "256-bit secure"; we state only what is true: sign-in runs over an encrypted (HTTPS) connection. */}
          <p className="flex items-center gap-1 text-xs text-fg-muted">
            <ShieldCheck aria-hidden className="size-3.5" />
            Encrypted sign-in
          </p>
        </div>

        <Button type="submit" loading={isSubmitting} className="mt-1 w-full">
          Sign in
        </Button>
      </form>

      <div className="my-4">
        <OrDivider>or continue with</OrDivider>
      </div>
      <GoogleButton />

      <ScriptureCard scripture={SIGN_IN_SCRIPTURE} />

      <p className="mt-6 text-center text-body-sm text-fg-secondary">
        New to FaithLink?{' '}
        <Link to="/create-account" viewTransition className="font-semibold text-fg-accent hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
