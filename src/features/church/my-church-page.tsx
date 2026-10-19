import { useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useAsyncData } from '@/lib/use-async-data'
import { useDocumentTitle } from '@/lib/use-document-title'
import { ActiveChurchBanner } from './active-church-banner'
import { AdminSuiteCard } from './admin-suite-card'
import { churchApi } from './church-api'
import { ChurchDirectory } from './church-directory'
import { ChurchHero } from './church-hero'
import type { FilterCategory } from './church-page-sample-data'
import { ChurchResourcesCard } from './church-resources-card'
import { ChurchPageSkeleton } from './church-skeleton'
import { CreateChurchForm } from './create-church-form'
import { JourneyCard } from './journey-card'
import { PasscodeCard } from './passcode-card'
import { RegisterChurchCard } from './register-church-card'
import { errorMessage, useChurchAction } from './use-church-action'
import './my-church-page.scss'

/**
 * The Church page (Stitch "My Church - Ultra Modern Desktop"): a stack of independent sections.
 * Members also see a banner per church they belong to, leading to that church's own page.
 */
export function MyChurchPage() {
  useDocumentTitle('My Church')
  const me = useAsyncData(() => churchApi.getMe(), [])
  const action = useChurchAction()
  const [isRegistering, setIsRegistering] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Explore all churches')

  if (!me.data) {
    return (
      <div className="my-church-page">
        {me.isLoading ? (
          <ChurchPageSkeleton />
        ) : (
          <Alert variant="danger" title="Couldn’t load My Church">
            {errorMessage(me.error)}{' '}
            <Button variant="ghost" size="xs" onClick={me.reload}>
              Try again
            </Button>
          </Alert>
        )}
      </div>
    )
  }

  const { memberships } = me.data

  return (
    <div className="my-church-page">
      <ChurchHero activeFilter={activeFilter} onSelectFilter={setActiveFilter} />
      {memberships.map((membership) => (
        <ActiveChurchBanner key={membership.church.id} membership={membership} />
      ))}
      {action.error && (
        <Alert variant="danger" title="That didn’t work">
          {action.error}
        </Alert>
      )}
      {action.notice && <Alert variant="success">{action.notice}</Alert>}

      <div className="church-columns">
        <div className="church-column-main">
          <ChurchDirectory action={action} onJoined={me.reload} activeFilter={activeFilter} />
          <RegisterChurchCard onStart={() => setIsRegistering(true)} />
          <ChurchResourcesCard />
        </div>
        <div className="church-column-side">
          <PasscodeCard />
          {memberships.length === 0 && <JourneyCard />}
          <AdminSuiteCard />
        </div>
      </div>

      <Modal
        open={isRegistering}
        onClose={() => setIsRegistering(false)}
        size="full-mobile"
        hideCloseButton
      >
        <CreateChurchForm
          action={action}
          isModal
          onCreated={() => {
            setIsRegistering(false)
            me.reload()
          }}
          onCancel={() => setIsRegistering(false)}
        />
      </Modal>
    </div>
  )
}
