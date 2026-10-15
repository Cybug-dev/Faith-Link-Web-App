import { act, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'
import { setPendingEmail } from '@/lib/pending-email'
import { renderRoute } from '@/test/render-route'
import { LAZY_ROUTE } from '@/test/lazy-route'

const codeBox = () => screen.getByLabelText('Verification code')

describe('Verify email page', () => {
  it('sends the person back to start when there is no pending email', async () => {
    renderRoute('/verify-email')
    expect(await screen.findByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
  })

  it('shows where the code was sent, masked, and how long it lasts', () => {
    setPendingEmail('alex@gmail.com')
    renderRoute('/verify-email')
    expect(screen.getByText(/a\*\*\*@gmail\.com/)).toBeInTheDocument()
    expect(screen.getByText(/expires in 15 minutes/)).toBeInTheDocument()
  })

  it('asks for the full code before submitting', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/verify-email')
    await user.type(codeBox(), '12')
    await user.click(screen.getByRole('button', { name: 'Verify email' }))
    expect(await screen.findByText('Enter the 6-digit code.')).toBeInTheDocument()
    expect(codeBox()).toHaveAttribute('aria-invalid', 'true')
  })

  it('explains a wrong code', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/verify-email')
    await user.type(codeBox(), '000000')
    await user.click(screen.getByRole('button', { name: 'Verify email' }))
    expect(await screen.findByText(/That code isn’t right/)).toBeInTheDocument()
  })

  it('explains an expired code', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/verify-email')
    await user.type(codeBox(), '999999')
    await user.click(screen.getByRole('button', { name: 'Verify email' }))
    expect(await screen.findByText(/That code has expired/)).toBeInTheDocument()
  })

  it('continues once the code is accepted and clears the pending email', async () => {
    setPendingEmail('alex@gmail.com')
    const { user } = renderRoute('/verify-email')
    await user.type(codeBox(), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify email' }))
    // First sign-in on this device goes through onboarding on the way to home.
    expect(await screen.findByRole('heading', { name: 'You’re in the right place' }, LAZY_ROUTE)).toBeInTheDocument()
    expect(sessionStorage.getItem('faithlink.pendingEmail')).toBeNull()
  })

  it('holds the resend button during the cooldown, then enables it', () => {
    vi.useFakeTimers()
    try {
      setPendingEmail('alex@gmail.com')
      render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/verify-email'] })} />)
      const resend = screen.getByRole('button', { name: 'Resend code' })
      expect(resend).toBeDisabled()
      expect(screen.getByText('You can request a new code in 0:30.')).toBeInTheDocument()

      // One second at a time: each tick schedules the next only after React re-renders.
      for (let i = 0; i < 30; i++) {
        act(() => {
          vi.advanceTimersByTime(1000)
        })
      }
      expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled()
      expect(screen.queryByText(/You can request a new code/)).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('lets someone arriving from a blocked sign-in resend straight away', () => {
    setPendingEmail('alex@gmail.com')
    renderRoute({ pathname: '/verify-email', state: { reason: 'unverified' } })
    expect(screen.getByText(/Verify your email to sign in/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled()
  })

  it('confirms when a new code was sent', async () => {
    setPendingEmail('alex@gmail.com')
    renderRoute({ pathname: '/verify-email', state: { reason: 'unverified' } })
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))
    expect(await screen.findByText(/We sent a new code/)).toBeInTheDocument()
  })
})
