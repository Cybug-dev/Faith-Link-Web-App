import { useDocumentTitle } from '@/lib/use-document-title'
import { AboutChurch } from './about-church'
import { ChurchHeader } from './church-header'
import { ChurchLeaders } from './church-leaders'
import { SAMPLE_CHURCH } from './church-sample-data'
import { ChurchStats } from './church-stats'
import { ExploreCard } from './explore-card'
import { JoinChurchCard } from './join-church-card'
import './my-church-page.scss'

// Sample data until the church API exists.
export function MyChurchPage() {
  useDocumentTitle('My Church')
  const church = SAMPLE_CHURCH
  return (
    <div className="my-church-page">
      <ChurchHeader church={church} />
      <ChurchStats stats={church.stats} />
      <AboutChurch church={church} />
      <ChurchLeaders leaders={church.leaders} />
      <div className="church-join-row">
        <JoinChurchCard />
        <ExploreCard />
      </div>
    </div>
  )
}
