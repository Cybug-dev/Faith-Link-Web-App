import { screen, waitFor, within } from '@testing-library/react'
import { fakeSession } from '@/test/fake-auth-client'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute } from '@/test/render-route'
import { ApiError } from '@/lib/api-client'
import type { ApiChurch, ChurchMemberRow, ChurchPermission, ChurchRole, Me, PrimaryTransfer } from './church-api'

vi.mock('./church-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./church-api')>()
  const fn = () => vi.fn<(...args: unknown[]) => Promise<unknown>>()
  return {
    ...actual,
    churchApi: {
      getMe: fn(),
      listChurches: fn(),
      getChurch: fn(),
      createChurch: fn(),
      updateChurch: fn(),
      joinChurch: fn(),
      leaveChurch: fn(),
      listMembers: fn(),
      changeRole: fn(),
      removeMember: fn(),
      offerPrimaryTransfer: fn(),
      acceptPrimaryTransfer: fn(),
      cancelPrimaryTransfer: fn(),
    },
  }
})

const { churchApi } = await import('./church-api')
const api = vi.mocked(churchApi)

const ME = 'user-me'
const PORTAL = '/church/church-1'
const NO_CHURCHES = { churches: [], total: 0, limit: 20, offset: 0 }
const CHURCH: ApiChurch = {
  id: 'church-1',
  name: 'Grace Chapel',
  slug: 'grace-chapel',
  description: 'A family of believers in Lagos.',
  logoUrl: null,
  city: 'Lagos',
  country: 'Nigeria',
  roleLabels: { leader: 'Deacon' },
  createdAt: '2026-01-05T00:00:00Z',
}

function member(userId: string, displayName: string, role: ChurchRole, isPrimaryAdmin = false): ChurchMemberRow {
  return { membershipId: `m-${userId}`, role, isPrimaryAdmin, joinedAt: '2026-02-01T00:00:00Z', user: { userId, displayName, avatarUrl: null } }
}

const PERMISSIONS: Record<ChurchRole, ChurchPermission[]> = {
  admin: ['church.update', 'members.view', 'members.remove', 'roles.assign', 'lessons.manage', 'quizzes.manage'],
  pastor: ['members.view', 'roles.assign', 'lessons.manage', 'quizzes.manage'],
  leader: ['members.view', 'quizzes.manage'],
  member: ['members.view'],
}

function signInAs(role: ChurchRole, { isPrimaryAdmin = false, transfer = null as PrimaryTransfer | null } = {}) {
  const me: Me = {
    user: { id: ME },
    memberships: [{ membershipId: 'm-me', role, isPrimaryAdmin, church: { id: CHURCH.id, name: CHURCH.name, slug: CHURCH.slug, logoUrl: null, roleLabels: CHURCH.roleLabels } }],
  }
  api.getMe.mockResolvedValue(me)
  api.getChurch.mockResolvedValue({
    church: CHURCH,
    viewer: {
      isMember: true,
      role,
      isPrimaryAdmin,
      joinedAt: '2026-02-01T00:00:00Z',
      permissions: isPrimaryAdmin ? [...PERMISSIONS[role], 'primary.transfer'] : PERMISSIONS[role],
      pendingPrimaryTransfer: transfer,
    },
  })
  const members = [
    member(ME, 'Me Myself', role, isPrimaryAdmin),
    member('u-ada', 'Ada Obi', 'leader'),
    member('u-ben', 'Ben Eze', 'member'),
  ]
  api.listMembers.mockResolvedValue({ members, total: members.length, limit: 20, offset: 0 })
}

async function openMembersTab() {
  const { user } = renderRoute(PORTAL)
  const sections = within(await screen.findByRole('navigation', { name: 'Church sections' }, LAZY_ROUTE))
  await user.click(sections.getByRole('button', { name: 'Members' }))
  const list = within(await screen.findByRole('region', { name: /Members \(3\)/ }))
  await list.findByText('Ada Obi')
  return { user, list }
}

describe('My Church page', () => {
  beforeAll(() => Promise.all([import('@/features/app-shell/app-shell'), import('./my-church-page')]), 60000)
  beforeEach(() => {
    fakeSession.signIn()
    api.listChurches.mockResolvedValue(NO_CHURCHES)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })
  afterEach(() => vi.clearAllMocks())

  describe('without a church', () => {
    beforeEach(() => {
      api.getMe.mockResolvedValue({ user: { id: ME }, memberships: [] })
      api.listChurches.mockResolvedValue({
        churches: [{ id: CHURCH.id, name: CHURCH.name, slug: CHURCH.slug, description: null, logoUrl: null, city: 'Lagos', country: 'Nigeria', memberCount: 12 }],
        total: 1,
        limit: 20,
        offset: 0,
      })
    })

    it('lists churches from the API and joins one', async () => {
      const { user } = renderRoute('/church')
      expect(await screen.findByText('12 members', {}, LAZY_ROUTE)).toBeInTheDocument()
      expect(screen.getByTitle('Lagos, Nigeria')).toBeInTheDocument()
      api.joinChurch.mockResolvedValue({})
      signInAs('member')
      await user.click(screen.getByRole('button', { name: 'Join Grace Chapel' }))
      expect(api.joinChurch).toHaveBeenCalledWith(CHURCH.id)
      expect(await screen.findByRole('region', { name: 'Your church: Grace Chapel' })).toBeInTheDocument()
    })

    it('searches the directory', async () => {
      const { user } = renderRoute('/church')
      await user.type(await screen.findByRole('searchbox', { name: 'Search churches by name or city' }, LAZY_ROUTE), 'abuja{Enter}')
      await waitFor(() => expect(api.listChurches).toHaveBeenLastCalledWith('abuja', 0))
    })

    it('creates a church with a web address made from its name', async () => {
      const { user } = renderRoute('/church')
      await user.click(await screen.findByRole('button', { name: 'Start setup' }, LAZY_ROUTE))
      await user.type(screen.getByLabelText(/Church name/), 'New Life Assembly')
      expect(screen.getByLabelText(/Web address/)).toHaveValue('new-life-assembly')
      expect(screen.getByLabelText(/City/)).toBeDisabled()
      await user.selectOptions(screen.getByLabelText(/Country/), 'Nigeria')
      await user.selectOptions(screen.getByLabelText(/City/), 'Lagos')
      api.createChurch.mockRejectedValue(new ApiError(409, 'SLUG_TAKEN', 'A church with this slug already exists'))
      await user.click(screen.getByRole('button', { name: 'Create church' }))
      expect(api.createChurch).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Life Assembly', slug: 'new-life-assembly', city: 'Lagos', country: 'Nigeria' }))
      expect(await screen.findByText('A church with this slug already exists')).toBeInTheDocument()
    })
  })

  it('shows the real church: name, member count, leaders under the church’s own role names', async () => {
    signInAs('member')
    renderRoute(PORTAL)
    expect(await screen.findByRole('heading', { level: 1, name: 'Grace Chapel' }, LAZY_ROUTE)).toBeInTheDocument()
    const glance = within(screen.getByRole('list', { name: 'Church at a glance' }))
    expect(await glance.findByText('3')).toBeInTheDocument()
    const leaders = within(screen.getByRole('region', { name: 'Church Leaders' }))
    expect(await leaders.findByText('Ada Obi')).toBeInTheDocument()
    expect(leaders.getByText('Deacon')).toBeInTheDocument()
  })

  it('gives a plain member no settings and no member controls', async () => {
    signInAs('member')
    const { list } = await openMembersTab()
    expect(screen.queryByRole('button', { name: 'Church Settings' })).not.toBeInTheDocument()
    expect(list.queryByRole('combobox')).not.toBeInTheDocument()
    expect(list.queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument()
  })

  it('lets a pastor only move people between member and leader', async () => {
    signInAs('pastor')
    const { list } = await openMembersTab()
    const ben = list.getByRole('combobox', { name: 'Role for Ben Eze' })
    expect(within(ben).getAllByRole('option').map((o) => o.textContent)).toEqual(['Member', 'Deacon'])
    expect(list.queryByRole('combobox', { name: 'Role for Me Myself' })).not.toBeInTheDocument()
    expect(list.queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument()
  })

  it('lets an admin change roles and remove members, but not touch themselves', async () => {
    signInAs('admin')
    const { user, list } = await openMembersTab()
    expect(list.queryByRole('combobox', { name: 'Role for Me Myself' })).not.toBeInTheDocument()

    api.changeRole.mockResolvedValue({})
    await user.selectOptions(list.getByRole('combobox', { name: 'Role for Ben Eze' }), 'pastor')
    expect(api.changeRole).toHaveBeenCalledWith(CHURCH.id, 'm-u-ben', 'pastor')
    expect(await screen.findByText('Ben Eze is now Pastor.')).toBeInTheDocument()

    api.removeMember.mockResolvedValue({})
    await user.click(list.getByRole('button', { name: 'Remove Ada Obi' }))
    expect(api.removeMember).toHaveBeenCalledWith(CHURCH.id, 'm-u-ada')
  })

  it('shows the backend’s refusal when a change is not allowed', async () => {
    signInAs('admin')
    const { user, list } = await openMembersTab()
    api.changeRole.mockRejectedValue(new ApiError(403, 'NOT_PERMITTED', 'You do not have permission to assign this role'))
    await user.selectOptions(list.getByRole('combobox', { name: 'Role for Ben Eze' }), 'admin')
    expect(await screen.findByText('You do not have permission to assign this role')).toBeInTheDocument()
  })

  it('lets the primary admin offer the role, and tells them to transfer before leaving', async () => {
    signInAs('admin', { isPrimaryAdmin: true })
    const { user, list } = await openMembersTab()
    api.offerPrimaryTransfer.mockResolvedValue({})
    const [offerToAda] = list.getAllByRole('button', { name: 'Make primary admin' })
    await user.click(offerToAda!)
    expect(api.offerPrimaryTransfer).toHaveBeenCalledWith(CHURCH.id, 'm-u-ada')

    await user.click(screen.getByRole('button', { name: 'More church options' }))
    expect(screen.getByText(/You are the primary admin/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Leave church' })).not.toBeInTheDocument()
  })

  it('lets the person offered the primary admin role accept it', async () => {
    const transfer: PrimaryTransfer = { id: 't1', fromUserId: 'u-ada', toUserId: ME, status: 'pending', expiresAt: '2026-10-26T00:00:00Z' }
    signInAs('member', { transfer })
    const { user } = renderRoute(PORTAL)
    expect(await screen.findByText('You’ve been offered the primary admin role', {}, LAZY_ROUTE)).toBeInTheDocument()
    api.acceptPrimaryTransfer.mockResolvedValue({})
    await user.click(screen.getByRole('button', { name: 'Accept' }))
    expect(api.acceptPrimaryTransfer).toHaveBeenCalledWith(CHURCH.id)
  })

  it('lets a member leave and returns them to church discovery', async () => {
    signInAs('member')
    const { user } = renderRoute(PORTAL)
    await user.click(await screen.findByRole('button', { name: 'More church options' }, LAZY_ROUTE))
    api.leaveChurch.mockResolvedValue({})
    api.getMe.mockResolvedValue({ user: { id: ME }, memberships: [] })
    await user.click(screen.getByRole('button', { name: 'Leave church' }))
    expect(api.leaveChurch).toHaveBeenCalledWith(CHURCH.id)
    expect(await screen.findByRole('heading', { level: 1, name: /Find your church/ }, LAZY_ROUTE)).toBeInTheDocument()
  })

  it('lets an admin rename roles in Church Settings', async () => {
    signInAs('admin')
    const { user } = renderRoute(PORTAL)
    await user.click(await screen.findByRole('button', { name: 'Church Settings' }, LAZY_ROUTE))
    const pastor = screen.getByLabelText('Pastor')
    await user.type(pastor, 'Shepherd')
    api.updateChurch.mockResolvedValue({ church: CHURCH })
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(api.updateChurch).toHaveBeenCalledWith(
      CHURCH.id,
      expect.objectContaining({ name: 'Grace Chapel', roleLabels: { pastor: 'Shepherd', leader: 'Deacon' } }),
    )
  })

  it('shows an error with a retry when My Church can’t load', async () => {
    api.getMe.mockRejectedValueOnce(new ApiError(0, 'NETWORK', 'Can’t reach FaithLink. Check your connection and try again.'))
    signInAs('member')
    const { user } = renderRoute('/church')
    expect(await screen.findByText(/Can’t reach FaithLink/, {}, LAZY_ROUTE)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('region', { name: 'Your church: Grace Chapel' })).toBeInTheDocument()
  })

  it('is reached from the My Church quick action on home', async () => {
    signInAs('member')
    const { user, router } = renderRoute('/home')
    const quickActions = within(await screen.findByRole('region', { name: 'Quick Actions' }, LAZY_ROUTE))
    await user.click(quickActions.getByRole('link', { name: /My Church/ }))
    expect(await screen.findByRole('region', { name: 'Your church: Grace Chapel' }, LAZY_ROUTE)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/church')
  })

  it('opens a joined church on its own page and comes back', async () => {
    signInAs('member')
    const { user, router } = renderRoute('/church')
    await user.click(await screen.findByRole('link', { name: /Go to church portal/ }, LAZY_ROUTE))
    expect(await screen.findByRole('heading', { level: 1, name: 'Grace Chapel' }, LAZY_ROUTE)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(PORTAL)
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/church'))
  })

  it('is in the sidebar in place of Messages', async () => {
    renderRoute('/home')
    const sidebar = within(await screen.findByRole('complementary', { name: 'Sidebar' }, LAZY_ROUTE))
    expect(sidebar.getByRole('link', { name: /My Church/ })).toHaveAttribute('href', '/church')
    expect(sidebar.queryByText('Messages')).not.toBeInTheDocument()
  })
})
