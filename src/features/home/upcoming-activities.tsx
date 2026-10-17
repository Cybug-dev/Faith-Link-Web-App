import { Check, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HomeSection } from './home-section'
import type { ActivityItem } from './home-sample-data'
import './upcoming-activities.scss'

export function UpcomingActivities({ activities }: { activities: ActivityItem[] }) {
  return (
    <HomeSection
      id="upcoming"
      title="Upcoming activities"
      action={{ label: 'See all', to: '/activities', accessibleLabel: 'See all activities' }}
      className="upcoming"
    >
      {activities.length === 0 ? (
        <p className="panel upcoming-empty">Nothing planned yet. Your church’s next activities will show here.</p>
      ) : (
        <ul className="panel upcoming-list">
          {activities.map((activity) => (
            <li key={activity.id} className="upcoming-row">
              <span className="date-tile">
                <span className="date-tile-month">{activity.month}</span>
                <span className="date-tile-day">{activity.day}</span>
              </span>
              <div className="upcoming-text">
                <p className="upcoming-title">{activity.title}</p>
                <p className="upcoming-meta">
                  <Clock aria-hidden className="upcoming-meta-icon" />
                  {activity.when}
                  <MapPin aria-hidden className="upcoming-meta-icon" />
                  {activity.place}
                </p>
              </div>
              {activity.isJoined ? (
                <span className="upcoming-joined">
                  <Check aria-hidden className="upcoming-meta-icon" />
                  Joined
                </span>
              ) : (
                <Button variant="outline" size="sm" className="upcoming-join" aria-label={`Join ${activity.title}`}>
                  Join
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  )
}
