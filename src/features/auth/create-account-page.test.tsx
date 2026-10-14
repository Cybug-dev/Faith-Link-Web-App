import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/render-route'

async function fillValid(user: ReturnType<typeof renderRoute>['user'], email = 'alex@example.com') {
  await user.type(screen.getByLabelText('Full name'), 'Alex Turner')
  await user.type(screen.getByLabelText('Email address'), email)
  await user.type(screen.getByLabelText('Password'), 'correct-horse7!')
  await user.click(screen.getByRole('checkbox'))
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
    expect(await screen.findByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Use at least 8 characters.', { selector: 'p[id$="-error"]' })).toBeInTheDocument()
    expect(
      screen.getByText('Agree to the Terms of Service and Privacy Policy to continue.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('rejects a short password', async () => {
    const { user } = renderRoute('/create-account')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.tab()
    expect(await screen.findByText('Use at least 8 characters.', { selector: 'p[id$="-error"]' })).toBeInTheDocument()
  })

  it('asks for a number and a symbol', async () => {
    const { user } = renderRoute('/create-account')
    const password = screen.getByLabelText('Password')
    await user.type(password, 'longenough')
    await user.tab()
    expect(await screen.findByText('Add at least one number.', { selector: 'p[id$="-error"]' })).toBeInTheDocument()
    await user.type(password, '7')
    await user.tab()
    expect(
      await screen.findByText('Add at least one symbol, like ! or #.', { selector: 'p[id$="-error"]' }),
    ).toBeInTheDocument()
  })

  it('goes to the code screen with the address masked', async () => {
    const { user } = renderRoute('/create-account')
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument()
    expect(screen.getByText(/a\*\*\*@example\.com/)).toBeInTheDocument()
  })

  it('shows a generic error and stays put when sign-up fails', async () => {
    const { user } = renderRoute('/create-account')
    await fillValid(user, 'error@example.com')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t create your account')
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
  })
})
