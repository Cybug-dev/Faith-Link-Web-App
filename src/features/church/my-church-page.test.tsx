import { screen, within } from '@testing-library/react'
import { fakeSession } from '@/test/fake-auth-client'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute } from '@/test/render-route'
import { SAMPLE_CHURCH } from './church-sample-data'

describe('My Church page', () => {
  beforeAll(() => Promise.all([import('@/features/app-shell/app-shell'), import('./my-church-page')]), 60000)
  beforeEach(() => fakeSession.signIn())

  it('shows the church, its numbers, about, five leaders and the join cards', async () => {
    renderRoute('/church')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Prayer Charge Teens Church' }, LAZY_ROUTE),
    ).toBeInTheDocument()

    const glance = within(screen.getByRole('list', { name: 'Church at a glance' }))
    expect(glance.getByText('128')).toBeInTheDocument()
    expect(glance.getByText('Est. 2022')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'About Our Church' })).toBeInTheDocument()
    const leaders = within(screen.getByRole('region', { name: 'Church Leaders' }))
    expect(leaders.getAllByRole('listitem')).toHaveLength(SAMPLE_CHURCH.leaders.length)
    expect(screen.getByRole('heading', { name: 'Join a Church' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Not part of a church yet?' })).toBeInTheDocument()
  })

  it('marks Overview as the current section and opens coming soon for the others', async () => {
    const { user } = renderRoute('/church')
    const sections = within(await screen.findByRole('navigation', { name: 'Church sections' }, LAZY_ROUTE))
    expect(sections.getByText('Overview')).toHaveAttribute('aria-current', 'page')
    expect(sections.queryByRole('button', { name: 'Overview' })).not.toBeInTheDocument()
    await user.click(sections.getByRole('button', { name: 'Members' }))
    expect(await screen.findByRole('heading', { name: 'Church members is coming soon' })).toBeInTheDocument()
  })

  it('opens coming soon when an invitation code is submitted', async () => {
    const { user } = renderRoute('/church')
    await user.type(await screen.findByLabelText('Invitation code', {}, LAZY_ROUTE), 'ABC123')
    await user.click(screen.getByRole('button', { name: 'Join Church' }))
    expect(await screen.findByRole('heading', { name: 'Joining a church is coming soon' })).toBeInTheDocument()
  })

  it('is reached from the My Church quick action on home', async () => {
    const { user, router } = renderRoute('/home')
    const quickActions = within(await screen.findByRole('region', { name: 'Quick Actions' }, LAZY_ROUTE))
    await user.click(quickActions.getByRole('link', { name: /My Church/ }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Prayer Charge Teens Church' }, LAZY_ROUTE),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/church')
  })

  it('is in the sidebar in place of Messages', async () => {
    renderRoute('/home')
    const sidebar = within(await screen.findByRole('complementary', { name: 'Sidebar' }, LAZY_ROUTE))
    expect(sidebar.getByRole('link', { name: /My Church/ })).toHaveAttribute('href', '/church')
    expect(sidebar.queryByText('Messages')).not.toBeInTheDocument()
  })
})
