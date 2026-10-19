import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { CardHead } from '@/features/home/card-head'
import { type ApiChurch, churchApi, type MemberViewer } from './church-api'
import type { ChurchAction } from './use-church-action'
import './church-more-actions.scss'

type ChurchMoreActionsProps = {
  church: ApiChurch
  viewer: MemberViewer
  action: ChurchAction
  onLeft: () => void
  onClose: () => void
}

export function ChurchMoreActions({ church, viewer, action, onLeft, onClose }: ChurchMoreActionsProps) {
  const id = useId()

  async function leave() {
    if (!window.confirm(`Leave ${church.name}? You can join again later as a member.`)) return
    if (await action.run(() => churchApi.leaveChurch(church.id), `You left ${church.name}.`)) onLeft()
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="church-more-actions">
      <CardHead id={`${id}-heading`} title="Church options" />
      {viewer.isPrimaryAdmin ? (
        <p className="more-actions-note">
          You are the primary admin. To leave, first offer this role to another member from the Members tab; once they accept,
          you can leave.
        </p>
      ) : (
        <Button variant="soft" size="sm" disabled={action.isPending} onClick={leave}>
          Leave church
        </Button>
      )}
      <Button variant="text" size="sm" onClick={onClose}>
        Close
      </Button>
    </section>
  )
}
