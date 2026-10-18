import { BookOpen, Flame, type LucideIcon, Star, User } from 'lucide-react'
import type { Achievement } from './home-sample-data'
import './badge-list.scss'

const BADGE_ICONS: Record<Achievement['kind'], LucideIcon> = {
  quiz: Star,
  streak: Flame,
  explorer: BookOpen,
  member: User,
}

// Hexagon, point up, in a 48 x 48 box; the round stroke join softens the corners.
const HEXAGON = 'M24 4 L41.3 14 L41.3 34 L24 44 L6.7 34 L6.7 14 Z'

/** Earned badges: tinted tile, coloured hexagon, white icon (owner's reference). Used wherever badges show. */
export function BadgeList({ badges }: { badges: Achievement[] }) {
  return (
    <ul className="badge-list">
      {badges.map((badge) => {
        const Icon = BADGE_ICONS[badge.kind]
        return (
          <li key={badge.id} className={`badge badge-${badge.kind}`}>
            <span aria-hidden className="badge-tile">
              <svg viewBox="0 0 48 48" className="badge-hex">
                <path d={HEXAGON} />
              </svg>
              <Icon className="badge-icon" />
            </span>
            <span className="badge-name">{badge.name}</span>
          </li>
        )
      })}
    </ul>
  )
}
