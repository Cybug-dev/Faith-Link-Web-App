import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fakeSession } from '@/test/fake-auth-client'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute } from '@/test/render-route'

describe('Sidebar', () => {
  // Load the lazy shell and home page once up front, so a slow first import can't time out a test.
  beforeAll(() => Promise.all([import('./app-shell'), import('@/features/home/home-page')]), 60000)

  async function renderHome() {
    fakeSession.signIn()
    renderRoute('/home')
    return screen.findByRole('complementary', { name: 'Sidebar' }, LAZY_ROUTE)
  }

  it('starts collapsed and opens from the logo button', async () => {
    const user = userEvent.setup()
    const sidebar = await renderHome()
    const toggle = screen.getByRole('button', { name: 'Open sidebar' })

    expect(sidebar).toHaveAttribute('data-open', 'false')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(sidebar).toHaveAttribute('data-open', 'true')
    // The logo button hides itself when open, so focus moves to the close button.
    expect(screen.getByRole('button', { name: 'Close sidebar' })).toHaveFocus()
  })

  it('closes again and keeps focus on the logo button', async () => {
    const user = userEvent.setup()
    const sidebar = await renderHome()
    await user.click(screen.getByRole('button', { name: 'Open sidebar' }))

    await user.click(screen.getByRole('button', { name: 'Close sidebar' }))

    expect(sidebar).toHaveAttribute('data-open', 'false')
    expect(screen.getByRole('button', { name: 'Open sidebar' })).toHaveFocus()
  })

  it('opens the coming-soon popup for a feature that is not built yet', async () => {
    const user = userEvent.setup()
    await renderHome()

    await user.click(screen.getByRole('button', { name: /live games/i }))

    expect(screen.getByRole('heading', { name: 'Live Games is coming soon' })).toBeInTheDocument()
  })
})
