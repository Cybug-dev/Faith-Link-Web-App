import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAsyncData } from '@/lib/use-async-data'
import { useDocumentTitle } from '@/lib/use-document-title'
import { churchApi } from './church-api'
import { ChurchPageSkeleton } from './church-skeleton'
import { ChurchWorkspace } from './church-workspace'
import { errorMessage } from './use-church-action'
import './my-church-page.scss'

/** One church you belong to, on its own page. Leaving it (or losing access) returns you to the Church page. */
export function ChurchPortalPage() {
  useDocumentTitle('My Church')
  const { churchId = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const me = useAsyncData(() => churchApi.getMe(), [])

  // Back to wherever you came from; straight to the Church page if this was opened directly.
  const goBack = () => (location.key === 'default' ? navigate('/church') : navigate(-1))

  if (!me.data) {
    return (
      <div className="my-church-page church-portal-page">
        {me.isLoading ? (
          <ChurchPageSkeleton />
        ) : (
          <Alert variant="danger" title="Couldn’t load your church">
            {errorMessage(me.error)}{' '}
            <Button variant="ghost" size="xs" onClick={me.reload}>
              Try again
            </Button>
          </Alert>
        )}
      </div>
    )
  }

  if (!me.data.memberships.some((m) => m.church.id === churchId)) return <Navigate to="/church" replace />

  return (
    <div className="my-church-page church-portal-page">
      <ChurchWorkspace churchId={churchId} myUserId={me.data.user.id} onMembershipChange={me.reload} onBack={goBack} />
    </div>
  )
}
