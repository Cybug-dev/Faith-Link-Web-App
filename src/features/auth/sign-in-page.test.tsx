import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/render-route'
import { LAZY_ROUTE } from '@/test/lazy-route'

async function fillAndSubmit(
  user: ReturnType<typeof renderRoute>['user'],
  email: string,
  password: string,
) {
  await user.type(screen.getByLabelText('Email address'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
}

describe('Sign in page', () => {
  it('is the first screen the app opens on', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
  })

  it('renders the form with no errors before the person has interacted', () => {
    renderRoute('/sign-in')
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter your email.')).not.toBeInTheDocument()
  })

  it('offers Google after the email form and remembers the person by default', () => {
    renderRoute('/sign-in')
    const google = screen.getByRole('button', { name: 'Continue with Google' })
    const email = screen.getByLabelText('Email address')
    expect(email.compareDocumentPosition(google) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeChecked()
  })

  it('shows required errors on submit', async () => {
    const { user } = renderRoute('/sign-in')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows typing guidance in a neutral tone, and an error only after leaving the field', async () => {
    const { user } = renderRoute('/sign-in')
    const email = screen.getByLabelText('Email address')
    await user.type(email, 'alex@exa')
    expect(await screen.findByText('Enter a valid email address, like name@example.com.')).toBeInTheDocument()
    expect(email).not.toHaveAttribute('aria-invalid', 'true')
    await user.tab()
    expect(email).toHaveAttribute('aria-invalid', 'true')
  })

  it('flags an invalid email while typing and clears it once valid', async () => {
    const { user } = renderRoute('/sign-in')
    const email = screen.getByLabelText('Email address')
    await user.type(email, 'alex@exa')
    expect(await screen.findByText('Enter a valid email address, like name@example.com.')).toBeInTheDocument()
    await user.type(email, 'mple.com')
    expect(screen.queryByText('Enter a valid email address, like name@example.com.')).not.toBeInTheDocument()
    expect(email).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the Stitch error for a failed sign-in, without saying which detail was wrong', async () => {
    const { user } = renderRoute('/sign-in')
    await fillAndSubmit(user, 'alex@example.com', 'wrong-password')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Authentication failed')
    expect(alert).toHaveTextContent('Incorrect email or password. Please verify your details or reset your access below.')
    expect(screen.getByRole('link', { name: 'Reset password' })).toHaveAttribute('href', '/forgot-password')
    expect(screen.getByText('Check your email and password, then try again.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveValue('alex@example.com')
    expect(screen.getByLabelText('Password')).toHaveValue('wrong-password')
  })

  it('sends an unverified account to the verification code screen', async () => {
    const { user } = renderRoute('/sign-in')
    await fillAndSubmit(user, 'unverified@example.com', 'correct-horse')
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument()
    expect(screen.getByText(/Verify your email to sign in/)).toBeInTheDocument()
  })

  it('shows a generic error when something unexpected fails', async () => {
    const { user } = renderRoute('/sign-in')
    await fillAndSubmit(user, 'error@example.com', 'whatever1')
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t sign you in')
  })

  it('continues on success', async () => {
    const { user } = renderRoute('/sign-in')
    await fillAndSubmit(user, 'alex@example.com', 'correct-horse')
    // A returning account goes straight to home; onboarding is only for new accounts.
    expect(
      await screen.findByRole('heading', { level: 1, name: /^Good (morning|afternoon|evening), David$/ }, LAZY_ROUTE),
    ).toBeInTheDocument()
  })

  it('toggles password visibility with an accessible button', async () => {
    const { user } = renderRoute('/sign-in')
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches to Create account from the tabs', async () => {
    const { user } = renderRoute('/sign-in')
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('link', { name: 'Create account' }))
    expect(await screen.findByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
  })

  it('shows the Google button as busy while it redirects, then recovers', async () => {
    const { user } = renderRoute('/sign-in')
    await user.click(screen.getByRole('button', { name: 'Continue with Google' }))
    expect(await screen.findByRole('button', { name: 'Continue with Google' })).toBeEnabled()
  })

  it('opens the forgot password page', async () => {
    const { user } = renderRoute('/sign-in')
    await user.click(screen.getByRole('link', { name: 'Forgot password?' }))
    expect(await screen.findByRole('heading', { name: 'Forgot your password?' })).toBeInTheDocument()
  })
})
