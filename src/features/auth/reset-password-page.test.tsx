import { screen } from '@testing-library/react'
import { getPendingEmail, setPendingEmail } from '@/lib/pending-email'
import { renderRoute } from '@/test/render-route'

const codeBox = () => screen.getByLabelText('Reset code')

async function fill(user: ReturnType<typeof renderRoute>['user'], code: string, password: string, confirm = password) {
  await user.type(codeBox(), code)
  await user.type(screen.getByLabelText('New password'), password)
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

  it('explains a wrong code and an expired code', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    await fill(user, '000000', 'Passw0rd!')
    expect(await screen.findByText(/That code isn’t right/)).toBeInTheDocument()

    await user.clear(codeBox())
    await user.type(codeBox(), '999999')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))
    expect(await screen.findByText(/That code has expired/)).toBeInTheDocument()
  })

  it('resets the password and signs the person in', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/reset-password')
    await fill(user, '123456', 'Passw0rd!')
    expect(await screen.findByRole('heading', { name: 'You’re signed in' })).toBeInTheDocument()
    expect(getPendingEmail()).toBeNull()
  })
})
