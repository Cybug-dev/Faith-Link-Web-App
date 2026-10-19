import type { ChurchMemberRow, ChurchRole, RoleLabels } from './church-api'

export const CHURCH_ROLES: readonly ChurchRole[] = ['admin', 'pastor', 'leader', 'member']

export const DEFAULT_ROLE_LABELS: Record<ChurchRole, string> = {
  admin: 'Admin',
  pastor: 'Pastor',
  leader: 'Leader',
  member: 'Member',
}

/** The church's own name for a role, or the default. Display only: permissions follow the role. */
export function roleLabel(role: ChurchRole, labels: RoleLabels): string {
  return labels[role]?.trim() || DEFAULT_ROLE_LABELS[role]
}

type Viewer = { userId: string; role: ChurchRole; canAssign: boolean }

/**
 * Roles the viewer may give this member, mirroring the backend rules so only usable controls show.
 * The backend still decides; an empty list means no role control.
 */
export function assignableRoles(viewer: Viewer, target: ChurchMemberRow): readonly ChurchRole[] {
  if (!viewer.canAssign || target.user.userId === viewer.userId || target.isPrimaryAdmin) return []
  if (viewer.role === 'admin') return CHURCH_ROLES
  const pastorRoles: readonly ChurchRole[] = ['member', 'leader']
  if (viewer.role === 'pastor' && pastorRoles.includes(target.role)) return pastorRoles
  return []
}

/** Lowercase, hyphenated web address part, as the backend requires (e.g. "Grace Chapel" → "grace-chapel"). */
export function slugify(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}
