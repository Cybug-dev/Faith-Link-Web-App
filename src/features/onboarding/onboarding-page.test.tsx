import { fireEvent, screen } from '@testing-library/react'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute } from '@/test/render-route'
import { SHOW_ONBOARDING_EVERY_SIGN_IN, hasSeenOnboarding, markOnboardingSeen } from './onboarding-storage'

const heading = (name: string) => screen.findByRole('heading', { level: 1, name }, LAZY_ROUTE)
// Step 1 has two Next controls (the phone arrow on the verse card and the desktop footer button); the footer one is last.
const footerNext = () => screen.getAllByRole('button', { name: /next/i }).at(-1) as HTMLElement

describe('Onboarding', () => {
  it('shows once on this device before home', async () => {
    const { router } = renderRoute('/home')
    expect(await heading('You’re in the right place')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/onboarding')
  })

  it('moves forward and back with the buttons, then finishes on Get started', async () => {
    const { user, router } = renderRoute('/onboarding')
    await heading('You’re in the right place')
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()

    await user.click(footerNext())
    expect(await heading('Learn and grow in your faith')).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 4: Learn and grow in your faith')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await heading('You’re in the right place')).toBeInTheDocument()

    await user.click(footerNext())
    await heading('Learn and grow in your faith')
    await user.click(footerNext())
    await heading('Play, learn and compete')
    await user.click(footerNext())
    await heading('Connect and make an impact')

    await user.click(screen.getByRole('button', { name: 'Get started' }))
    expect(await screen.findByRole('heading', { name: 'You’re signed in' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/home')
    expect(hasSeenOnboarding()).toBe(!SHOW_ONBOARDING_EVERY_SIGN_IN)
  })

  it('follows the arrow keys and Enter', async () => {
    renderRoute('/onboarding')
    await heading('You’re in the right place')
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(await heading('Learn and grow in your faith')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(await heading('You’re in the right place')).toBeInTheDocument()
    fireEvent.keyDown(document.body, { key: 'Enter' })
    expect(await heading('Learn and grow in your faith')).toBeInTheDocument()
  })

  it('Skip goes straight to home and is remembered', async () => {
    const { user, router } = renderRoute('/onboarding')
    await heading('You’re in the right place')
    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(await screen.findByRole('heading', { name: 'You’re signed in' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/home')
    expect(hasSeenOnboarding()).toBe(!SHOW_ONBOARDING_EVERY_SIGN_IN)
  })

  // Last: marking as seen also sets an in-memory flag that lasts for the rest of this file.
  // Off while onboarding temporarily shows after every sign-in.
  it('goes straight to home once it has been seen', async () => {
    if (SHOW_ONBOARDING_EVERY_SIGN_IN) return
    markOnboardingSeen()
    renderRoute('/home')
    expect(await screen.findByRole('heading', { name: 'You’re signed in' })).toBeInTheDocument()
  })
})
