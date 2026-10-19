import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { type ApiChurch, churchApi, type PrimaryTransfer } from './church-api'
import type { ChurchAction } from './use-church-action'
import './primary-transfer-banner.scss'

type PrimaryTransferBannerProps = {
  church: ApiChurch
  transfer: PrimaryTransfer
  myUserId: string
  /** Display name of the other person, when known from the member list. */
  otherName: string | undefined
  action: ChurchAction
  onChanged: () => void
}

/** An open offer of the primary admin role, shown to the person offering it and the person offered it. */
export function PrimaryTransferBanner({ church, transfer, myUserId, otherName, action, onChanged }: PrimaryTransferBannerProps) {
  const isForMe = transfer.toUserId === myUserId
  const until = new Date(transfer.expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })

  async function accept() {
    if (await action.run(() => churchApi.acceptPrimaryTransfer(church.id), `You are now the primary admin of ${church.name}.`)) onChanged()
  }

  async function cancel() {
    const done = isForMe ? 'You declined the offer.' : 'Offer withdrawn.'
    if (await action.run(() => churchApi.cancelPrimaryTransfer(church.id), done)) onChanged()
  }

  return (
    <Alert title={isForMe ? 'You’ve been offered the primary admin role' : 'Primary admin offer pending'} className="primary-transfer-banner">
      <p>
        {isForMe
          ? `${otherName ?? 'The primary admin'} wants you to take over as the protected admin of ${church.name}. Open until ${until}.`
          : `Waiting for ${otherName ?? 'the member'} to accept. Open until ${until}.`}
      </p>
      <div className="transfer-buttons">
        {isForMe && (
          <Button variant="solid" size="xs" disabled={action.isPending} onClick={accept}>
            Accept
          </Button>
        )}
        <Button variant="soft" size="xs" disabled={action.isPending} onClick={cancel}>
          {isForMe ? 'Decline' : 'Withdraw offer'}
        </Button>
      </div>
    </Alert>
  )
}
