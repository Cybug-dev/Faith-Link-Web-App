import { useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAsyncData } from '@/lib/use-async-data'
import { AboutChurch } from './about-church'
import { churchApi } from './church-api'
import { toDisplayChurch } from './church-display'
import { ChurchHeader, type ChurchTab } from './church-header'
import { ChurchLeaders } from './church-leaders'
import { ChurchMembers } from './church-members'
import { ChurchMoreActions } from './church-more-actions'
import { ChurchSettingsForm } from './church-settings-form'
import { ChurchPageSkeleton } from './church-skeleton'
import { ChurchStats } from './church-stats'
import { PrimaryTransferBanner } from './primary-transfer-banner'
import { errorMessage, useChurchAction } from './use-church-action'
import { useMemberList } from './use-member-list'

type ChurchWorkspaceProps = {
  churchId: string
  myUserId: string
  /** Membership changed in a way the page must re-read (left the church, became primary admin). */
  onMembershipChange: () => void
  onBack?: () => void
}

/** One church the viewer belongs to. Every control shown comes from the backend's `viewer.permissions`. */
export function ChurchWorkspace({ churchId, myUserId, onMembershipChange, onBack }: ChurchWorkspaceProps) {
  const churchData = useAsyncData(() => churchApi.getChurch(churchId), [churchId])
  const memberList = useMemberList(churchId)
  const action = useChurchAction()
  const [tab, setTab] = useState<ChurchTab>('overview')
  const [panel, setPanel] = useState<'settings' | 'more' | null>(null)

  if (!churchData.data) {
    if (churchData.isLoading) return <ChurchPageSkeleton />
    return (
      <Alert variant="danger" title="Couldn’t load your church">
        {errorMessage(churchData.error)}{' '}
        <Button variant="ghost" size="xs" onClick={churchData.reload}>
          Try again
        </Button>
      </Alert>
    )
  }

  const { church, viewer } = churchData.data
  // The backend only returns the member view to active members; anything else means we were removed meanwhile.
  if (!viewer.isMember) {
    return (
      <Alert variant="danger" title="You’re no longer a member of this church">
        <Button variant="ghost" size="xs" onClick={onMembershipChange}>
          Refresh
        </Button>
      </Alert>
    )
  }

  const display = toDisplayChurch(church, memberList.members, memberList.total)
  const transfer = viewer.pendingPrimaryTransfer
  const otherUserId = transfer && (transfer.toUserId === myUserId ? transfer.fromUserId : transfer.toUserId)
  const otherName = memberList.members.find((m) => m.user.userId === otherUserId)?.user.displayName

  const refresh = () => {
    churchData.reload()
    memberList.reload()
  }
  const refreshAll = () => {
    refresh()
    onMembershipChange()
  }
  const togglePanel = (next: 'settings' | 'more') => {
    action.clear()
    setPanel((current) => (current === next ? null : next))
  }

  return (
    <>
      <ChurchHeader
        church={display}
        activeTab={tab}
        onTabChange={setTab}
        onOpenSettings={viewer.permissions.includes('church.update') ? () => togglePanel('settings') : undefined}
        onOpenMore={() => togglePanel('more')}
        onBack={onBack}
      />

      {action.error && (
        <Alert variant="danger" title="That didn’t work">
          {action.error}
        </Alert>
      )}
      {action.notice && <Alert variant="success">{action.notice}</Alert>}

      {transfer && (
        <PrimaryTransferBanner
          church={church}
          transfer={transfer}
          myUserId={myUserId}
          otherName={otherName}
          action={action}
          onChanged={refreshAll}
        />
      )}

      {panel === 'settings' && (
        <ChurchSettingsForm
          church={church}
          action={action}
          onSaved={() => {
            setPanel(null)
            refreshAll()
          }}
          onClose={() => setPanel(null)}
        />
      )}
      {panel === 'more' && (
        <ChurchMoreActions church={church} viewer={viewer} action={action} onLeft={onMembershipChange} onClose={() => setPanel(null)} />
      )}

      {tab === 'overview' ? (
        <>
          <ChurchStats stats={display.stats} />
          <AboutChurch church={display} />
          <ChurchLeaders leaders={display.leaders} onViewAll={() => setTab('members')} />
        </>
      ) : (
        <ChurchMembers church={church} viewer={viewer} myUserId={myUserId} list={memberList} action={action} onChanged={refresh} />
      )}
    </>
  )
}
