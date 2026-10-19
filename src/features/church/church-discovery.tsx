import { Alert } from '@/components/ui/alert'
import { ChurchDirectory } from './church-directory'
import { CreateChurchForm } from './create-church-form'
import { ExploreCard } from './explore-card'
import { JoinChurchCard } from './join-church-card'
import { useChurchAction } from './use-church-action'

/** What someone who hasn't joined a church sees: find and join one, or create one. */
export function ChurchDiscovery({ onMembershipChange }: { onMembershipChange: () => void }) {
  const action = useChurchAction()
  return (
    <>
      <h1 className="church-discovery-title">My Church</h1>
      {action.error && (
        <Alert variant="danger" title="That didn’t work">
          {action.error}
        </Alert>
      )}
      <ChurchDirectory action={action} onJoined={onMembershipChange} />
      <CreateChurchForm action={action} onCreated={onMembershipChange} />
      <div className="church-join-row">
        <JoinChurchCard />
        <ExploreCard />
      </div>
    </>
  )
}
