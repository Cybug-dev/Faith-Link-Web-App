import { Award, BookOpen, CalendarCheck, type LucideIcon } from 'lucide-react'
import { CardHead } from './card-head'
import type { RecentItem } from './home-sample-data'
import './recent-activity.scss'

const KIND_ICON: Record<RecentItem['kind'], LucideIcon> = {
  lesson: BookOpen,
  achievement: Award,
  activity: CalendarCheck,
}

export function RecentActivity({ items }: { items: RecentItem[] }) {
  return (
    <section aria-labelledby="recent-heading" className="recent">
      <CardHead id="recent-heading" title="Recent Activity" subtitle="What you did this week" hasDivider />
      {items.length === 0 ? (
        <p className="recent-empty">Lessons, quizzes and activities you finish will show here.</p>
      ) : (
        <ul className="recent-list">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind]
            return (
              <li key={item.id} className={`recent-row recent-row-${item.kind}`}>
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
    </section>
  )
}
