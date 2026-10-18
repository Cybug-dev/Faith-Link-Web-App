import { BadgeList } from './badge-list'
import { CardHead } from './card-head'
import type { Achievement } from './home-sample-data'
import './achievements-row.scss'

export function AchievementsRow({ achievements }: { achievements: Achievement[] }) {
  return (
    <section aria-labelledby="achievements-heading" className="achievements">
      <CardHead
        id="achievements-heading"
        title="Recent Achievements"
        subtitle="Badges you earned lately"
        link={{ label: 'See All', to: '/achievements', accessibleLabel: 'See all achievements' }}
      />
      {achievements.length === 0 ? (
        <p className="achievements-empty">Finish your first lesson or quiz to earn an achievement.</p>
      ) : (
        <BadgeList badges={achievements} />
      )}
    </section>
  )
}
