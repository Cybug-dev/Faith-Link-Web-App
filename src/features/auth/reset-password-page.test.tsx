import { screen } from '@testing-library/react'
import { getPendingEmail, setPendingEmail } from '@/lib/pending-email'
import { renderRoute } from '@/test/render-route'

const codeBox = () => screen.getByLabelText('Reset code')

type User = ReturnType<typeof renderRoute>['user']

async function enterCode(user: User, code: string) {
  await user.type(codeBox(), code)
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

async function fill(user: User, code: string, password: string, confirm = password) {
  await enterCode(user, code)
  await user.type(await screen.findByLabelText('New password'), password)
  await user.type(screen.getByLabelText('Confirm new password'), confirm)
  await user.click(screen.getByRole('button', { name: 'Reset password' }))
}

describe('Reset password page', () => {
  it('sends the person back to start when there is no pending email', async () => {
    renderRoute('/reset-password')
    expect(await screen.findByRole('heading', { name: 'Forgot your password?' })).toBeInTheDocument()
  })

  it('applies the same password rule as create account', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    await fill(user, '123456', 'short')
    expect(await screen.findByText('Use at least 8 characters.')).toBeInTheDocument()
  })

  it('catches a mismatched confirmation', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    await fill(user, '123456', 'Passw0rd!', 'Passw0rd?')
    expect(await screen.findByText('Passwords don’t match. Re-enter it.')).toBeInTheDocument()
  })

  it('asks for the new password only after the code is confirmed', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    expect(screen.queryByLabelText('New password')).not.toBeInTheDocument()
    await enterCode(user, '123456')
    expect(await screen.findByRole('heading', { name: 'Set a new password' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Reset code')).not.toBeInTheDocument()
  })

  it('explains a wrong code and an expired code, and stays on the code step', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    await enterCode(user, '000000')
    expect(await screen.findByText(/That code isn’t right/)).toBeInTheDocument()
    expect(screen.queryByLabelText('New password')).not.toBeInTheDocument()

    await user.clear(codeBox())
    await enterCode(user, '999999')
    expect(await screen.findByText(/That code has expired/)).toBeInTheDocument()
  })

  it('counts down wrong guesses and locks the code after three', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    for (const left of ['2 tries left', '1 try left']) {
      await enterCode(user, '000000')
      expect(await screen.findByText(new RegExp(left))).toBeInTheDocument()
      await user.clear(codeBox())
    }
    await enterCode(user, '000000')
    expect(await screen.findByText('Too many wrong tries. Request a new code below.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('resets the password and sends the person to sign in again', async () => {
    setPendingEmail('alex@gmail.com')
    const { user, router } = renderRoute('/reset-password')
    await fill(user, '123456', 'Passw0rd!')
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sign-in')
    expect(screen.getByRole('status')).toHaveTextContent('Password updated. Sign in with your new password.')
    expect(getPendingEmail()).toBeNull()
  })
})
