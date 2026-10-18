import { CalendarDays, type LucideIcon, ShieldCheck, Users, UsersRound } from 'lucide-react'
import type { ChurchStat } from './church-types'
import './church-stats.scss'

const STAT_LOOK: Record<ChurchStat['id'], { icon: LucideIcon; tone: 'green' | 'amber' | 'purple' | 'blue' }> = {
  members: { icon: Users, tone: 'green' },
  leaders: { icon: ShieldCheck, tone: 'amber' },
  groups: { icon: UsersRound, tone: 'purple' },
  founded: { icon: CalendarDays, tone: 'blue' },
}

export function ChurchStats({ stats }: { stats: readonly ChurchStat[] }) {
  return (
    <ul aria-label="Church at a glance" className="church-stats">
      {stats.map((stat) => {
        const { icon: Icon, tone } = STAT_LOOK[stat.id]
        return (
          <li key={stat.id} className={`church-stat church-stat-${tone}`}>
            <span aria-hidden className="church-stat-icon">
              <Icon />
            </span>
            <span className="church-stat-text">
              <span className="church-stat-value">{stat.value}</span>
              <span className="church-stat-label">{stat.label}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
