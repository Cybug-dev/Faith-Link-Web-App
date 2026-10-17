import { useState } from 'react'
import { useDocumentTitle } from '@/lib/use-document-title'
import { SAMPLE_VIEWER } from '@/features/app-shell/sample-viewer'
import { AchievementsRow } from './achievements-row'
import { FocusCard } from './focus-card'
import { HeroCarousel } from './hero-carousel'
import {
  SAMPLE_ACHIEVEMENTS,
  SAMPLE_ACTIVITIES,
  SAMPLE_FOCUS,
  SAMPLE_RECENT,
  SAMPLE_SERIES,
  SAMPLE_STATS,
  SAMPLE_STREAK,
} from './home-sample-data'
import { ProgressCard } from './progress-card'
import { QuickActions } from './quick-actions'
import { RecentActivity } from './recent-activity'
import { StreakCard } from './streak-card'
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
  // Read the clock once when the page opens, not on every render.
  const [timeOfDay] = useState(() => greetingFor(new Date().getHours()))
  const greeting = `${timeOfDay}, ${SAMPLE_VIEWER.firstName}`

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
        <HeroCarousel label="Today">
          <FocusCard lesson={SAMPLE_FOCUS} />
          <StreakCard streak={SAMPLE_STREAK} />
        </HeroCarousel>
      </div>

      <div className="home-actions">
        <QuickActions />
      </div>
      <div className="home-upcoming">
        <UpcomingActivities activities={SAMPLE_ACTIVITIES} />
      </div>
      <div className="home-progress">
        <ProgressCard series={SAMPLE_SERIES} stats={SAMPLE_STATS} />
      </div>
      <div className="home-recent">
        <RecentActivity items={SAMPLE_RECENT} />
      </div>
      <div className="home-achievements">
        <AchievementsRow achievements={SAMPLE_ACHIEVEMENTS} />
      </div>
    </div>
  )
}
