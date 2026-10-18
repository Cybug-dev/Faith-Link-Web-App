import { screen, within } from '@testing-library/react'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { fakeSession } from '@/test/fake-auth-client'
import { renderRoute as renderAnyRoute } from '@/test/render-route'

// A returning, signed-in account: no onboarding on the way.
const renderRoute = (pathname: string) => {
  fakeSession.signIn()
  return renderAnyRoute(pathname)
}

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
      'The Burning Ones',
      'Welcome back, David!',
      'Quick Actions',
      'Upcoming Events',
      'Your Progress',
      'Recent Activity',
      'Trending This Week',
    ])
  })

  // Owner kept streak, points and level as designed (2026-10-17).
  it('shows the streak, points and level on the focus banner', async () => {
    renderRoute('/home')
    await screen.findByRole('heading', { level: 1 }, LAZY_ROUTE)
    const stats = within(screen.getByRole('region', { name: /welcome back/i }))
    expect(stats.getByText('Day Streak')).toBeInTheDocument()
    expect(stats.getByText('1,280')).toBeInTheDocument()
    expect(stats.getByText('Level 14')).toBeInTheDocument()
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
