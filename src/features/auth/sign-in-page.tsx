import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { OrDivider } from '@/components/ui/or-divider'
import { PasswordInput } from '@/components/ui/password-input'
import { setPendingEmail } from '@/lib/pending-email'
import { useDocumentTitle } from '@/lib/use-document-title'
import { AuthError, authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { AuthTabs } from './auth-tabs'
import { GoogleButton } from './google-button'
import { signInSchema, type SignInValues } from './schemas'
import { SignInBanner } from './auth-banners'
import { SIGN_IN_SCRIPTURE, authImages } from './scripture'
import { ScriptureCard } from './scripture-card'

type FormError = 'credentials' | 'unknown' | null

/** Layout and copy follow the Stitch "FaithLink Sign In" screen (see docs/ui/stitch-sources.md). */
export function SignInPage() {
  useDocumentTitle('Sign in')
  const navigate = useNavigate()
  const [formError, setFormError] = useState<FormError>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    // No warnings while filling the form; validate on submit, then keep errors fresh while fixing them.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
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
      setFormError(error instanceof AuthError && error.code === 'INVALID_CREDENTIALS' ? 'credentials' : 'unknown')
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

      {formError === 'credentials' && (
        // Same wording for unknown email and Google-only accounts: the backend must not reveal which.
        <Alert variant="danger" className="mt-4">
          Wrong email or password. Signed up with Google? Use Continue with Google, or{' '}
          <Link to="/forgot-password" className="font-semibold text-current underline">
            reset your password
          </Link>
          .
        </Alert>
      )}
      {formError === 'unknown' && (
        <Alert variant="danger" className="mt-4">
          We couldn’t sign you in. Check your connection and try again.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <FormField label="Email address" error={errors.email?.message}>
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
          labelAction={
            <Link to="/forgot-password" className="text-label-md text-fg-accent hover:underline">
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
