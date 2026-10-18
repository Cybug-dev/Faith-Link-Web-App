import { BookOpen, ChartNoAxesColumn, Gamepad2, type LucideIcon, Users } from 'lucide-react'
import { Link } from 'react-router'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { HomeSection } from './home-section'
import './quick-actions.scss'

type QuickAction = {
  key: 'learn' | 'quiz' | 'church' | 'rank'
  title: string
  hint: string
  icon: LucideIcon
  /** Built pages navigate; the rest open the coming-soon popup. */
  to?: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'learn', title: 'Continue Learning', hint: 'Pick up where you left off', icon: BookOpen },
  { key: 'quiz', title: 'Join a Live Quiz', hint: 'Enter a game code', icon: Gamepad2 },
  { key: 'church', title: 'My Church', hint: 'View church activities', icon: Users, to: '/church' },
  { key: 'rank', title: 'View Leaderboard', hint: 'See top participants', icon: ChartNoAxesColumn },
]

export function QuickActions() {
  const showComingSoon = useComingSoon()
  return (
    <HomeSection
      id="quick-actions"
      title="Quick Actions"
      className="quick-actions"
      link={{
        label: 'See All',
        accessibleLabel: 'See all quick actions',
        onClick: () => showComingSoon('All quick actions'),
      }}
    >
      <ul className="quick-list">
        {QUICK_ACTIONS.map(({ key, title, hint, icon: Icon, to }) => {
          const className = `quick-card quick-card-${key}`
          const content = (
            <>
              <span aria-hidden className="quick-icon">
                <Icon className="quick-icon-svg" />
              </span>
              <span className="quick-text">
                <span className="quick-title">{title}</span>
                <span className="quick-hint">{hint}</span>
              </span>
            </>
          )
          return (
            <li key={key}>
              {to ? (
                <Link to={to} className={className}>
                  {content}
                </Link>
              ) : (
                <button type="button" className={className} onClick={() => showComingSoon(title)}>
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
