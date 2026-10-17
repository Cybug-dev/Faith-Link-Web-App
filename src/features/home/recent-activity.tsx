import { Award, BookOpen, CalendarCheck, type LucideIcon } from 'lucide-react'
import { HomeSection } from './home-section'
import type { RecentItem } from './home-sample-data'
import './recent-activity.scss'

const KIND_ICON: Record<RecentItem['kind'], LucideIcon> = {
  lesson: BookOpen,
  achievement: Award,
  activity: CalendarCheck,
}

export function RecentActivity({ items }: { items: RecentItem[] }) {
  return (
    <HomeSection id="recent" title="Recent activity" className="recent">
      {items.length === 0 ? (
        <p className="panel recent-empty">Lessons, quizzes and activities you finish will show here.</p>
      ) : (
        <ul className="panel recent-list">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind]
            return (
              <li key={item.id} className="recent-row">
                <span aria-hidden className="recent-icon">
                  <Icon className="recent-icon-svg" />
                </span>
                <p className="recent-text">
                  {item.text} <strong>{item.subject}</strong>
                </p>
                <span className="recent-when">{item.when}</span>
              </li>
            )
          })}
        </ul>
      )}
    </HomeSection>
  )
}
