import { Award } from 'lucide-react'
import { HomeSection } from './home-section'
import type { Achievement } from './home-sample-data'
import './achievements-row.scss'

export function AchievementsRow({ achievements }: { achievements: Achievement[] }) {
  return (
    <HomeSection
      id="achievements"
      title="Recent achievements"
      action={{ label: 'See all', to: '/achievements', accessibleLabel: 'See all achievements' }}
      className="achievements"
    >
      {achievements.length === 0 ? (
        <p className="panel achievements-empty">Finish your first lesson or quiz to earn an achievement.</p>
      ) : (
        <ul className="panel achievement-list">
          {achievements.map((achievement) => (
            <li key={achievement.id} className="achievement">
              <span aria-hidden className="achievement-badge">
                <Award className="achievement-icon" />
              </span>
              <span className="achievement-name">{achievement.name}</span>
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  )
}
