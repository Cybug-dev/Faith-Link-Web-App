import { screen, waitFor } from '@testing-library/react'
import { fakeSession } from '@/test/fake-auth-client'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { markOnboardingSeen } from '@/features/onboarding/onboarding-storage'
import { renderRoute } from '@/test/render-route'

const homeHeading = () =>
  screen.findByRole('heading', { level: 1, name: /^Good (morning|afternoon|evening), David$/ }, LAZY_ROUTE)

describe('Where people land', () => {
  beforeAll(
    () => Promise.all([import('@/features/app-shell/app-shell'), import('@/features/home/home-page')]),
    60000,
  )

  it('opens the site on sign in when signed out', async () => {
    const { router } = renderRoute('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Welcome back' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sign-in')
  })

  it('opens the site on home when already signed in', async () => {
    fakeSession.signIn()
    const { router } = renderRoute('/')
    expect(await homeHeading()).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/home')
  })

  it('sends a signed-in person from sign in and create account to home', async () => {
    fakeSession.signIn()
    const { router } = renderRoute('/create-account')
    await waitFor(() => expect(router.state.location.pathname).toBe('/home'), LAZY_ROUTE)
  })

  it('sends a signed-out person from the app to sign in', async () => {
    const { router } = renderRoute('/home')
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
  })

  it('keeps a signed-out person out of onboarding', async () => {
    const { router } = renderRoute('/onboarding')
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'), LAZY_ROUTE)
  })

  it('sends a brand-new account to onboarding before the app', async () => {
    fakeSession.signIn({ isNewAccount: true })
    const { router } = renderRoute('/home')
    await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding'), LAZY_ROUTE)
  })

  it('never sends a returning account to onboarding', async () => {
    fakeSession.signIn()
    const { router } = renderRoute('/home')
    expect(await homeHeading()).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/home')
  })

  // Last: marking as seen also sets an in-memory flag that lasts for the rest of this file.
  it('lets a new account into the app once onboarding has been seen', async () => {
    markOnboardingSeen()
    fakeSession.signIn({ isNewAccount: true })
    const { router } = renderRoute('/home')
    expect(await homeHeading()).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/home')
  })
})
