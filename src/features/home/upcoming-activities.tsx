import { Calendar, Clock } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import { CardHead } from './card-head'
import type { ActivityItem } from './home-sample-data'
import './upcoming-activities.scss'

/** The base component (owner, 2026-10-18): Stitch "Upcoming Events" on the Desktop Home board. */
export function UpcomingActivities({ activities }: { activities: ActivityItem[] }) {
  const showComingSoon = useComingSoon()
  return (
    <section aria-labelledby="upcoming-heading" className="upcoming">
      <CardHead
        id="upcoming-heading"
        title="Upcoming Events"
        subtitle="Fellowship and gatherings this week"
        icon={<Calendar />}
        link={{ label: 'See All', to: '/activities', accessibleLabel: 'See all events' }}
        hasDivider
      />
      {activities.length === 0 ? (
        <p className="upcoming-empty">Nothing planned yet. Your church’s next events will show here.</p>
      ) : (
        <ul className="upcoming-list">
          {activities.map((activity) => {
            const canJoin = activity.action === 'join'
            return (
              <li key={activity.id} className="upcoming-row">
                <span className={canJoin ? 'date-tile' : 'date-tile date-tile-quiet'}>
                  <span className="date-tile-month">{activity.month}</span>{' '}
                  <span className="date-tile-day">{activity.day}</span>
                </span>
                <div className="upcoming-text">
                  <div className="upcoming-title-line">
                    <h3 className="upcoming-title">{activity.title}</h3>
                    <span className={`upcoming-status upcoming-status-${activity.status.tone}`}>
                      {activity.status.label}
                    </span>
                  </div>
                  <p className="upcoming-meta">
                    <span className="upcoming-time">
                      <Clock aria-hidden className="upcoming-time-icon" />
                      {activity.when}
                    </span>
                    <span aria-hidden className="upcoming-meta-dot" />
                    <span className="visually-hidden">, </span>
                    <span className="upcoming-place">{activity.place}</span>
                  </p>
                </div>
                <Button
                  variant={canJoin ? 'solid' : 'soft'}
                  size="xs"
                  className={canJoin ? 'upcoming-action' : 'upcoming-action upcoming-action-quiet'}
                  aria-label={`${canJoin ? 'Join' : 'View'} ${activity.title}`}
                  onClick={() => showComingSoon(canJoin ? 'Joining events' : 'Event details')}
                >
                  {canJoin ? 'Join' : 'View'}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
