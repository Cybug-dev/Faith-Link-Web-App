import { screen } from '@testing-library/react'
import { getPendingEmail } from '@/lib/pending-email'
import { renderRoute } from '@/test/render-route'

describe('Forgot password page', () => {
  it('asks for a valid email before sending', async () => {
    const { user } = renderRoute('/forgot-password')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    expect(await screen.findByText('Enter your email.')).toBeInTheDocument()
  })

  it('sends a code and moves on to setting a new password', async () => {
    const { user } = renderRoute('/forgot-password')
    await user.type(screen.getByLabelText('Email address'), 'alex@gmail.com')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    expect(await screen.findByRole('heading', { name: 'Enter your reset code' })).toBeInTheDocument()
    expect(getPendingEmail()).toBe('alex@gmail.com')
  })

  it('keeps the person on the page when the code cannot be sent', async () => {
    const { user } = renderRoute('/forgot-password')
    await user.type(screen.getByLabelText('Email address'), 'error@example.com')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    expect(await screen.findByText(/couldn’t send a code/)).toBeInTheDocument()
  })
})
