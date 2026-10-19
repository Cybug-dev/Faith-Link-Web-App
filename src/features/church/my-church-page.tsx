import { useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useAsyncData } from '@/lib/use-async-data'
import { useDocumentTitle } from '@/lib/use-document-title'
import { churchApi } from './church-api'
import { ChurchDiscovery } from './church-discovery'
import { ChurchWorkspace } from './church-workspace'
import { errorMessage } from './use-church-action'
import './my-church-page.scss'

/** Discovery for people without a church; the church workspace for members (with a switcher if they have several). */
export function MyChurchPage() {
  useDocumentTitle('My Church')
  const me = useAsyncData(() => churchApi.getMe(), [])
  const [selectedChurchId, setSelectedChurchId] = useState<string | null>(null)

  if (!me.data) {
    return (
      <div className="my-church-page">
        {me.isLoading ? (
          <output>Loading your church…</output>
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

  const { memberships, user } = me.data
  const active = memberships.find((m) => m.church.id === selectedChurchId) ?? memberships[0]

  return (
    <div className="my-church-page">
      {!active ? (
        <ChurchDiscovery onMembershipChange={me.reload} />
      ) : (
        <>
          {memberships.length > 1 && (
            <Select
              aria-label="Choose a church"
              value={active.church.id}
              onChange={(e) => setSelectedChurchId(e.target.value)}
              isCompactOnPhone
              className="church-switcher"
            >
              {memberships.map((m) => (
                <option key={m.church.id} value={m.church.id}>
                  {m.church.name}
                </option>
              ))}
            </Select>
          )}
          <ChurchWorkspace key={active.church.id} churchId={active.church.id} myUserId={user.id} onMembershipChange={me.reload} />
        </>
      )}
    </div>
  )
}
