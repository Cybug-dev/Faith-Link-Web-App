import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/render-route'

type User = ReturnType<typeof renderRoute>['user']
const PASSWORD = 'correct-horse7!'
const submit = (user: User) => user.click(screen.getByRole('button', { name: 'Create account' }))

async function fillValid(user: User, email = 'alex@example.com') {
  await user.type(screen.getByLabelText('Full name'), 'Alex Turner')
  await user.type(screen.getByLabelText('Email address'), email)
  await user.type(screen.getByLabelText('Password'), PASSWORD)
  await user.click(screen.getByRole('checkbox'))
}

/** First submit reveals the confirmation field; second submit creates the account. */
async function fillAndConfirm(user: User, email?: string) {
  await fillValid(user, email)
  await submit(user)
  await user.type(await screen.findByLabelText('Confirm password'), PASSWORD)
  await submit(user)
}

describe('Create account page', () => {
  it('shows the password rule up front', () => {
    renderRoute('/create-account')
    expect(screen.getByLabelText('Password')).toHaveAccessibleDescription(
      'At least 8 characters with a number and symbol',
    )
  })

  it('requires every field and the terms on submit', async () => {
    const { user } = renderRoute('/create-account')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('Enter your full name.')).toBeInTheDocument()
    expect(screen.getByText('Enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Use at least 8 characters.', { selector: 'p[id$="-error"]' })).toBeInTheDocument()
    expect(
      screen.getByText('Agree to the Terms of Service and Privacy Policy to continue.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('flags a weak password while typing and clears it once it meets the rule', async () => {
    const { user } = renderRoute('/create-account')
    const password = screen.getByLabelText('Password')
    await user.type(password, 'short')
    expect(await screen.findByText('Use at least 8 characters.', { selector: 'p[id$="-error"]' })).toBeInTheDocument()
    await user.type(password, 'er7!')
    expect(screen.queryByText(/Use at least 8 characters|Add at least one/, { selector: 'p[id$="-error"]' })).not.toBeInTheDocument()
  })

  it('asks for a number and a symbol', async () => {
    const { user } = renderRoute('/create-account')
    const password = screen.getByLabelText('Password')
    await user.type(password, 'longenough')
    await submit(user)
    expect(await screen.findByText('Add at least one number.', { selector: 'p[id$="-error"]' })).toBeInTheDocument()
    await user.type(password, '7')
    expect(
      await screen.findByText('Add at least one symbol, like ! or #.', { selector: 'p[id$="-error"]' }),
    ).toBeInTheDocument()
  })

  it('shows the confirmation field, focused, only after the first submit', async () => {
    const { user } = renderRoute('/create-account')
    expect(screen.queryByLabelText('Confirm password')).not.toBeInTheDocument()
    await fillValid(user)
    await submit(user)
    expect(await screen.findByLabelText('Confirm password')).toHaveFocus()
    expect(screen.queryByRole('heading', { name: 'Check your email' })).not.toBeInTheDocument()
  })

  it('rejects a confirmation that does not match', async () => {
    const { user } = renderRoute('/create-account')
    await fillValid(user)
    await submit(user)
    await user.type(await screen.findByLabelText('Confirm password'), 'something-else1!')
    await submit(user)
    expect(await screen.findByText('Passwords don’t match. Re-enter it.')).toBeInTheDocument()
  })

  it('shows the password as hidden with a slashed eye until toggled', async () => {
    const { user } = renderRoute('/create-account')
    const toggle = screen.getByRole('button', { name: 'Show password' })
    expect(toggle.querySelector('svg')).toHaveClass('lucide-eye-off')
    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Hide password' }).querySelector('svg')).toHaveClass('lucide-eye')
  })

  it('goes to the code screen with the address masked', async () => {
    const { user } = renderRoute('/create-account')
    await fillAndConfirm(user)
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument()
    expect(screen.getByText(/a\*\*\*@example\.com/)).toBeInTheDocument()
  })

  it('shows a generic error and stays put when sign-up fails', async () => {
    const { user } = renderRoute('/create-account')
    await fillAndConfirm(user, 'error@example.com')
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t create your account')
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
  })
})
