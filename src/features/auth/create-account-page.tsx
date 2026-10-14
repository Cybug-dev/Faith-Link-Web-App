import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError, FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { OrDivider } from '@/components/ui/or-divider'
import { PasswordInput } from '@/components/ui/password-input'
import { setPendingEmail } from '@/lib/pending-email'
import { useDocumentTitle } from '@/lib/use-document-title'
import { authClient } from './auth-client'
import { AuthLayout } from './auth-layout'
import { AuthTabs } from './auth-tabs'
import { GoogleButton } from './google-button'
import { MIN_PASSWORD_LENGTH, createAccountSchema, type CreateAccountValues } from './schemas'
import { CREATE_ACCOUNT_BANNER_SCRIPTURE, CREATE_ACCOUNT_SCRIPTURE, authImages } from './scripture'
import { ScriptureCard } from './scripture-card'

/**
 * Layout and copy follow the Stitch "FaithLink Create Account" screen: the banner
 * carries a verse (Sign in carries the brand line), but the tabs stay under the
 * photo as on Sign in so they don't jump between pages.
 */
export function CreateAccountPage() {
  useDocumentTitle('Create account')
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: '', email: '', password: '', acceptedTerms: false },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setFailed(false)
    try {
      await authClient.signUpWithEmail({ name, email, password })
      // Always the same next step, even if the email already has an account (anti-enumeration).
      setPendingEmail(email)
      navigate('/verify-email')
    } catch {
      setFailed(true)
    }
  })

  return (
    <AuthLayout
      banner={
        <figure>
          <blockquote className="text-body-sm">
            <p>“{CREATE_ACCOUNT_BANNER_SCRIPTURE.text}”</p>
          </blockquote>
          <figcaption className="mt-1 text-label-sm">
            {CREATE_ACCOUNT_BANNER_SCRIPTURE.reference} ({CREATE_ACCOUNT_BANNER_SCRIPTURE.translation})
          </figcaption>
        </figure>
      }
      image={authImages.createAccount}
      scripture={CREATE_ACCOUNT_SCRIPTURE}
    >
      <AuthTabs />
      <h1 className="mt-6 text-headline-lg">Create your account</h1>
      <p className="mt-1 text-body-sm text-fg-secondary">
        Join a community built to help you grow in faith and fellowship.
      </p>

      {failed && (
        <Alert variant="danger" className="mt-4">
          We couldn’t create your account. Try again in a moment.
        </Alert>
      )}

      <form noValidate onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <FormField label="Full name" error={errors.name?.message}>
          {(control) => (
            <Input
              {...control}
              {...register('name')}
              autoComplete="name"
              placeholder="John Doe"
              startIcon={User}
            />
          )}
        </FormField>

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
          hint={`At least ${MIN_PASSWORD_LENGTH} characters with a number and symbol`}
          error={errors.password?.message}
        >
          {(control) => (
            <PasswordInput
              {...control}
              {...register('password')}
              autoComplete="new-password"
              placeholder="Create a password"
            />
          )}
        </FormField>

        <div className="flex flex-col gap-2">
          <Checkbox
            {...register('acceptedTerms')}
            aria-invalid={errors.acceptedTerms ? true : undefined}
            aria-describedby={errors.acceptedTerms ? 'terms-error' : undefined}
            label={
              <span className="text-caption text-fg-secondary">
                I agree to the{' '}
                <Link to="/terms" className="font-semibold text-fg-accent underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-fg-accent underline">
                  Privacy Policy
                </Link>
              </span>
            }
          />
          {errors.acceptedTerms?.message && <FieldError id="terms-error">{errors.acceptedTerms.message}</FieldError>}
        </div>

        <Button type="submit" loading={isSubmitting} className="mt-1 w-full">
          Create account
        </Button>
      </form>

      <div className="my-4">
        <OrDivider>or continue with</OrDivider>
      </div>
      <GoogleButton />

      <ScriptureCard scripture={CREATE_ACCOUNT_SCRIPTURE} />

      <p className="mt-6 text-center text-body-sm text-fg-secondary">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-semibold text-fg-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
