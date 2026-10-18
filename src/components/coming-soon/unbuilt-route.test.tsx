import { screen, waitFor } from '@testing-library/react'
import { fakeSession } from '@/test/fake-auth-client'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute } from '@/test/render-route'

describe('Unbuilt addresses', () => {
  beforeAll(
    () => Promise.all([import('@/features/app-shell/app-shell'), import('@/features/home/home-page')]),
    60000,
  )

  it('opens the coming-soon popup instead of a "page not found" screen', async () => {
    const { router } = renderRoute('/terms')
    expect(await screen.findByRole('heading', { name: 'Terms of service is coming soon' })).toBeInTheDocument()
    // Typed directly, so there is nowhere to go back to: the person lands on the start page.
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'))
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument()
  })

  it('returns to the page the link was on', async () => {
    fakeSession.signIn()
    const { user, router } = renderRoute('/home')
    await user.click(await screen.findByRole('link', { name: 'See all events' }, LAZY_ROUTE))
    expect(await screen.findByRole('heading', { name: 'Activities is coming soon' })).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/home'))
  })
})
