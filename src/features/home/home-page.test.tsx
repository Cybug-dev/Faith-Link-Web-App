import { screen, within } from '@testing-library/react'
import { FROM_ONBOARDING } from '@/features/onboarding/onboarding-routes'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute as renderAnyRoute } from '@/test/render-route'

// Arrive as onboarding hands over, so the gate lets us through whatever the onboarding setting is.
const renderRoute = (pathname: string) => renderAnyRoute({ pathname, state: FROM_ONBOARDING })

describe('Home page', () => {
  beforeAll(
    () => Promise.all([import('@/features/app-shell/app-shell'), import('./home-page')]),
    60000,
  )

  it('greets the person and shows the desktop board sections in order', async () => {
    renderRoute('/home')
    expect(
      await screen.findByRole('heading', { level: 1, name: /^Good (morning|afternoon|evening), David$/ }, LAZY_ROUTE),
    ).toBeInTheDocument()

    const sections = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(sections).toEqual([
      'The burning ones',
      '4-day streak',
      'Quick actions',
      'Upcoming activities',
      'Your progress',
      'Recent activity',
      'Recent achievements',
    ])
  })

  // Page content only: the owner put Leaderboard in the sidebar (2026-10-17).
  it('never shows points, levels or ranks in the page content', async () => {
    renderRoute('/home')
    await screen.findByRole('heading', { level: 1 }, LAZY_ROUTE)
    expect(within(screen.getByRole('main')).queryByText(/\b(xp|pts|points|level|rank|leaderboard)\b/i)).not.toBeInTheDocument()
  })

  it('marks Home as the current page and names the unread notifications', async () => {
    renderRoute('/home')
    await screen.findByRole('heading', { level: 1 }, LAZY_ROUTE)
    for (const nav of screen.getAllByRole('navigation', { name: 'Main' })) {
      expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    }
    expect(screen.getByRole('button', { name: 'Notifications, 3 new' })).toBeInTheDocument()
  })
})
