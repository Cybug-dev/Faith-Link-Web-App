import { BadgeList } from './badge-list'
import { CardHead } from './card-head'
import type { Achievement, ProgressOverview, ProgressStat } from './home-sample-data'
import { SectionLink } from './section-link'
import './progress-card.scss'

const RING_RADIUS = 52
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

type ProgressCardProps = {
  overview: ProgressOverview
  stats: ProgressStat[]
  badges: Achievement[]
}

/** Overall weekly progress as a ring, a colour-keyed tally list, then the latest badges. Real tallies only. */
export function ProgressCard({ overview, stats, badges }: ProgressCardProps) {
  const percent = Number.isFinite(overview.percent) ? Math.round(Math.min(Math.max(overview.percent, 0), 100)) : 0
  const share = percent / 100
  return (
    <section aria-labelledby="progress-heading" className="progress">
      <CardHead
        id="progress-heading"
        title="Your Progress"
        subtitle="Weekly spiritual goals"
        link={{ label: 'View Details', to: overview.to, accessibleLabel: 'View details of your progress' }}
      />
      <div className="progress-body">
        <div className="progress-ring">
          <svg viewBox="0 0 120 120" aria-hidden>
            <circle className="ring-track" cx="60" cy="60" r={RING_RADIUS} />
            <circle
              className="ring-fill"
              cx="60"
              cy="60"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - share)}
            />
          </svg>
          <span className="ring-text">
            <span className="ring-percent">{percent}%</span>
            <span className="ring-caption">
              Overall<span className="visually-hidden"> of weekly goals done</span>
            </span>
          </span>
        </div>
        <dl className="stat-list">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-row">
              <dt className="stat-label">
                <span aria-hidden className={`stat-dot stat-dot-${stat.tone}`} />
                {stat.label}
              </dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="badges">
        <div className="badges-head">
          <h3 className="badges-title">Recent Badges</h3>
          <SectionLink label="View All" to="/achievements" accessibleLabel="View all badges" />
        </div>
        {badges.length === 0 ? (
          <p className="badges-empty">Finish your first lesson or quiz to earn a badge.</p>
        ) : (
          <BadgeList badges={badges} />
        )}
      </div>
    </section>
  )
}
