import { apiRequest } from '@/lib/api-client'

// Shapes returned by the FaithLink backend (`/api/me`, `/api/churches/*`).

export type ChurchRole = 'admin' | 'pastor' | 'leader' | 'member'
export type RoleLabels = Partial<Record<ChurchRole, string>>
export type ChurchPermission =
  | 'church.update'
  | 'members.view'
  | 'members.remove'
  | 'roles.assign'
  | 'lessons.manage'
  | 'quizzes.manage'
  | 'primary.transfer'

export type ApiChurch = {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  address?: string | null
  city: string | null
  country: string | null
  roleLabels: RoleLabels
  createdAt: string
}

export type PrimaryTransfer = {
  id: string
  fromUserId: string
  toUserId: string
  status: 'pending' | 'accepted' | 'cancelled' | 'expired'
  expiresAt: string
}

export type ChurchViewer =
  | { isMember: false }
  | {
      isMember: true
      role: ChurchRole
      isPrimaryAdmin: boolean
      joinedAt: string
      permissions: ChurchPermission[]
      pendingPrimaryTransfer: PrimaryTransfer | null
    }

export type MemberViewer = Extract<ChurchViewer, { isMember: true }>

export type MyMembership = {
  membershipId: string
  role: ChurchRole
  isPrimaryAdmin: boolean
  church: { id: string; name: string; slug: string; logoUrl: string | null; roleLabels: RoleLabels }
}

export type Me = { user: { id: string }; memberships: MyMembership[] }

export type ChurchMemberRow = {
  membershipId: string
  role: ChurchRole
  isPrimaryAdmin: boolean
  joinedAt: string
  user: { userId: string; displayName: string; avatarUrl: string | null }
}

export type DirectoryChurch = Pick<ApiChurch, 'id' | 'name' | 'slug' | 'description' | 'logoUrl' | 'city' | 'country'> & {
  memberCount: number
}

type Page = { total: number; limit: number; offset: number }

export type NewChurch = { name: string; slug: string; description?: string; city?: string; country?: string }
export type ChurchUpdate = Partial<Pick<ApiChurch, 'name' | 'description' | 'city' | 'country'>> & {
  roleLabels?: RoleLabels
}

export const PAGE_SIZE = 20

const church = (id: string) => `/api/churches/${encodeURIComponent(id)}`

export const churchApi = {
  getMe: () => apiRequest<Me>('/api/me'),
  listChurches: (q: string, offset = 0) =>
    apiRequest<Page & { churches: DirectoryChurch[] }>('/api/churches', { query: { q, limit: PAGE_SIZE, offset } }),
  getChurch: (id: string) => apiRequest<{ church: ApiChurch; viewer: ChurchViewer }>(church(id)),
  createChurch: (input: NewChurch) => apiRequest<{ church: ApiChurch }>('/api/churches', { method: 'POST', body: input }),
  updateChurch: (id: string, input: ChurchUpdate) =>
    apiRequest<{ church: ApiChurch }>(church(id), { method: 'PATCH', body: input }),
  joinChurch: (id: string) => apiRequest<unknown>(`${church(id)}/join`, { method: 'POST' }),
  leaveChurch: (id: string) => apiRequest<unknown>(`${church(id)}/leave`, { method: 'POST' }),
  listMembers: (id: string, offset = 0) =>
    apiRequest<Page & { members: ChurchMemberRow[] }>(`${church(id)}/members`, { query: { limit: PAGE_SIZE, offset } }),
  changeRole: (id: string, membershipId: string, role: ChurchRole) =>
    apiRequest<unknown>(`${church(id)}/members/${encodeURIComponent(membershipId)}/role`, {
      method: 'PATCH',
      body: { role },
    }),
  removeMember: (id: string, membershipId: string) =>
    apiRequest<unknown>(`${church(id)}/members/${encodeURIComponent(membershipId)}`, { method: 'DELETE' }),
  offerPrimaryTransfer: (id: string, membershipId: string) =>
    apiRequest<unknown>(`${church(id)}/primary-transfer`, { method: 'POST', body: { membershipId } }),
  acceptPrimaryTransfer: (id: string) => apiRequest<unknown>(`${church(id)}/primary-transfer/accept`, { method: 'POST' }),
  cancelPrimaryTransfer: (id: string) => apiRequest<unknown>(`${church(id)}/primary-transfer/cancel`, { method: 'POST' }),
}
