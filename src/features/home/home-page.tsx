import { useState } from 'react'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useViewer } from '@/features/app-shell/use-viewer'
import { FocusBanner } from './focus-banner'
import {
  SAMPLE_ACHIEVEMENTS,
  SAMPLE_ACTIVITIES,
  SAMPLE_FOCUS,
  SAMPLE_RECENT,
  SAMPLE_OVERVIEW,
  SAMPLE_STATS,
  SAMPLE_TRENDING,
  SAMPLE_WELCOME,
} from './home-sample-data'
import { ProgressCard } from './progress-card'
import { QuickActions } from './quick-actions'
import { RecentActivity } from './recent-activity'
import { TrendingCard } from './trending-card'
import { UpcomingActivities } from './upcoming-activities'
import './home-page.scss'

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Church home. Layout follows the desktop Stitch board ("FaithLink - Desktop
 * Home Dashboard"); phones get the same sections in the same order, stacked.
 * UI only for now: data comes from home-sample-data.ts until the API exists.
 */
export function HomePage() {
  useDocumentTitle('Home')
  const viewer = useViewer()
  // Read the clock once when the page opens, not on every render.
  const [timeOfDay] = useState(() => greetingFor(new Date().getHours()))
  const greeting = `${timeOfDay}, ${viewer.firstName}`

  return (
    <div className="home-page">
      <header className="home-greeting">
        <h1 className="home-title">
          {greeting}{' '}
          {/* Microsoft Fluent 3D emoji (MIT), resized to 64px: 5.7 kB. */}
          <img src="/images/waving-hand.png" alt="" width={64} height={64} decoding="async" className="home-wave" />
        </h1>
        <p className="home-subtitle">Here’s what’s next for you this week.</p>
      </header>

      <div className="home-hero">
        <FocusBanner lesson={SAMPLE_FOCUS} welcome={SAMPLE_WELCOME} firstName={viewer.firstName} />
      </div>

      <div className="home-actions">
        <QuickActions />
      </div>
      <div className="home-upcoming">
        <UpcomingActivities activities={SAMPLE_ACTIVITIES} />
      </div>
      <div className="home-progress">
        <ProgressCard overview={SAMPLE_OVERVIEW} stats={SAMPLE_STATS} badges={SAMPLE_ACHIEVEMENTS} />
      </div>
      <div className="home-recent">
        <RecentActivity items={SAMPLE_RECENT} />
      </div>
      <div className="home-trending">
        <TrendingCard items={SAMPLE_TRENDING} />
      </div>
    </div>
  )
}
