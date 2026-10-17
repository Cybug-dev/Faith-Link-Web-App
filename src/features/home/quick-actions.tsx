import { Award, BookOpen, Church, type LucideIcon, SquareCheckBig } from 'lucide-react'
import { Link } from 'react-router'
import { HomeSection } from './home-section'
import './quick-actions.scss'

type QuickAction = { title: string; hint: string; to: string; icon: LucideIcon }

const QUICK_ACTIONS: QuickAction[] = [
  { title: 'Continue learning', hint: 'Pick up where you left off', to: '/lessons', icon: BookOpen },
  { title: 'Take a quiz', hint: 'Practise what you learned', to: '/quizzes', icon: SquareCheckBig },
  { title: 'My church', hint: 'See what your church is doing', to: '/church', icon: Church },
  { title: 'Achievements', hint: 'See what you have earned', to: '/achievements', icon: Award },
]

export function QuickActions() {
  return (
    <HomeSection id="quick-actions" title="Quick actions" className="quick-actions">
      <ul className="quick-list">
        {QUICK_ACTIONS.map(({ title, hint, to, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className="quick-card">
              <span aria-hidden className="quick-icon">
                <Icon className="quick-icon-svg" />
              </span>
              <span className="quick-title">{title}</span>
              <span className="quick-hint">{hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
