import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { HomeSection } from '@/features/home/home-section'
import { type ApiChurch, type ChurchMemberRow, type ChurchRole, churchApi, type MemberViewer } from './church-api'
import { assignableRoles, roleLabel } from './church-roles'
import { type ChurchAction, errorMessage } from './use-church-action'
import type { MemberList } from './use-member-list'
import './church-members.scss'

type ChurchMembersProps = {
  church: ApiChurch
  viewer: MemberViewer
  myUserId: string
  list: MemberList
  action: ChurchAction
  onChanged: () => void
}

export function ChurchMembers({ church, viewer, myUserId, list, action, onChanged }: ChurchMembersProps) {
  const can = (p: (typeof viewer.permissions)[number]) => viewer.permissions.includes(p)
  const hasPendingTransfer = viewer.pendingPrimaryTransfer !== null

  async function changeRole(member: ChurchMemberRow, role: ChurchRole) {
    const name = member.user.displayName
    const ok = await action.run(
      () => churchApi.changeRole(church.id, member.membershipId, role),
      `${name} is now ${roleLabel(role, church.roleLabels)}.`,
    )
    if (ok) onChanged()
  }

  async function remove(member: ChurchMemberRow) {
    const name = member.user.displayName
    if (!window.confirm(`Remove ${name} from ${church.name}? They won’t be able to rejoin on their own.`)) return
    if (await action.run(() => churchApi.removeMember(church.id, member.membershipId), `${name} was removed.`)) onChanged()
  }

  async function offerPrimary(member: ChurchMemberRow) {
    const name = member.user.displayName
    const question = `Offer the primary admin role to ${name}? Once they accept, you stay an admin but they hold the church’s protected role.`
    if (!window.confirm(question)) return
    const sent = await action.run(
      () => churchApi.offerPrimaryTransfer(church.id, member.membershipId),
      `Offer sent to ${name}. It stays open for 7 days.`,
    )
    if (sent) onChanged()
  }

  return (
    <HomeSection id="church-members" title={`Members (${list.total})`} className="church-members">
      {list.error !== undefined && list.members.length === 0 ? (
        <Alert variant="danger" title="Couldn’t load members">
          {errorMessage(list.error)}{' '}
          <Button variant="ghost" size="xs" onClick={list.reload}>
            Try again
          </Button>
        </Alert>
      ) : (
        <ul className="member-list">
          {list.members.map((member) => {
            const isMe = member.user.userId === myUserId
            const roles = assignableRoles({ userId: myUserId, role: viewer.role, canAssign: can('roles.assign') }, member)
            const canRemove = can('members.remove') && !isMe && !member.isPrimaryAdmin
            const canOfferPrimary = viewer.isPrimaryAdmin && !isMe && !hasPendingTransfer
            return (
              <li key={member.membershipId} className="member-row">
                <div className="member-info">
                  <span className="member-name">
                    {member.user.displayName}
                    {isMe && ' (you)'}
                  </span>
                  <span className="member-role">
                    {roleLabel(member.role, church.roleLabels)}
                    {member.isPrimaryAdmin && ' · Primary admin'}
                  </span>
                </div>
                <div className="member-actions">
                  {roles.length > 0 && (
                    <Select
                      aria-label={`Role for ${member.user.displayName}`}
                      value={member.role}
                      disabled={action.isPending}
                      isCompactOnPhone
                      onChange={(e) => changeRole(member, e.target.value as ChurchRole)}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {roleLabel(role, church.roleLabels)}
                        </option>
                      ))}
                    </Select>
                  )}
                  {canOfferPrimary && (
                    <Button variant="soft" size="xs" disabled={action.isPending} onClick={() => offerPrimary(member)}>
                      Make primary admin
                    </Button>
                  )}
                  {canRemove && (
                    <Button
                      variant="soft"
                      size="xs"
                      disabled={action.isPending}
                      aria-label={`Remove ${member.user.displayName}`}
                      onClick={() => remove(member)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {list.isLoading && <p className="member-status">Loading members…</p>}
      {list.hasMore && !list.isLoading && (
        <Button variant="soft" size="sm" onClick={list.loadMore}>
          Show more members
        </Button>
      )}
    </HomeSection>
  )
}
