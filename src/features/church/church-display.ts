import type { ApiChurch, ChurchMemberRow } from './church-api'
import { roleLabel } from './church-roles'
import { SAMPLE_CHURCH } from './church-sample-data'
import type { Church, ChurchLeader } from './church-types'

/** Leaders are every member with a role above member, named with the church's own role labels. */
export function toLeaders(church: ApiChurch, members: readonly ChurchMemberRow[]): ChurchLeader[] {
  return members
    .filter((m) => m.role !== 'member')
    .map((m) => ({
      id: m.membershipId,
      name: m.user.displayName,
      role: roleLabel(m.role, church.roleLabels),
      photo: m.user.avatarUrl ?? undefined,
    }))
}

/**
 * Maps the backend church to the shape the existing screen renders.
 * The API has no cover photo or verses yet, so those stay as sample content.
 */
export function toDisplayChurch(church: ApiChurch, members: readonly ChurchMemberRow[], memberTotal: number): Church {
  const place = [church.city, church.country].filter(Boolean).join(', ')
  const leaders = toLeaders(church, members)
  return {
    name: church.name,
    tagline: place || 'On FaithLink',
    about: church.description?.trim() || 'This church hasn’t added a description yet.',
    coverVerse: SAMPLE_CHURCH.coverVerse,
    aboutVerse: SAMPLE_CHURCH.aboutVerse,
    cover: SAMPLE_CHURCH.cover,
    stats: [
      { id: 'members', value: String(memberTotal), label: memberTotal === 1 ? 'Member' : 'Members' },
      { id: 'leaders', value: String(leaders.length), label: leaders.length === 1 ? 'Leader' : 'Leaders' },
      { id: 'founded', value: `Since ${new Date(church.createdAt).getFullYear()}`, label: 'On FaithLink' },
    ],
    leaders,
  }
}
