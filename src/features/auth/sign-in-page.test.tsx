import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/render-route'

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

  it('offers Google after the email form, as designed, and has no remember-me', () => {
    renderRoute('/sign-in')
    const google = screen.getByRole('button', { name: 'Continue with Google' })
    const email = screen.getByLabelText('Email address')
    expect(email.compareDocumentPosition(google) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByLabelText(/remember me/i)).not.toBeInTheDocument()
  })

  it('shows required errors on submit', async () => {
    const { user } = renderRoute('/sign-in')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
  })

  it('validates the email format on submit, not when leaving the field', async () => {
    const { user } = renderRoute('/sign-in')
    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.tab()
    expect(screen.queryByText('Enter a valid email address, like name@example.com.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Enter a valid email address, like name@example.com.')).toBeInTheDocument()
  })

  it('uses the contract wording for a failed sign-in and keeps what was typed', async () => {
    const { user } = renderRoute('/sign-in')
    await fillAndSubmit(user, 'alex@example.com', 'wrong-password')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(
      'Wrong email or password. Signed up with Google? Use Continue with Google, or reset your password.',
    )
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
    expect(await screen.findByRole('heading', { name: 'You’re signed in' })).toBeInTheDocument()
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

  it('lands on a not-found page for links whose pages are not built yet', async () => {
    const { user } = renderRoute('/sign-in')
    await user.click(screen.getByRole('link', { name: 'Forgot password?' }))
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to sign in' })).toHaveAttribute('href', '/sign-in')
  })
})
