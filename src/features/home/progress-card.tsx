import { Link } from 'react-router'
import { HomeSection } from './home-section'
import type { ProgressStat, SeriesProgress } from './home-sample-data'
import './progress-card.scss'

const RING_RADIUS = 26
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/** Progress through the current lesson series, then lifetime counts. Real tallies only. */
export function ProgressCard({ series, stats }: { series: SeriesProgress; stats: ProgressStat[] }) {
  const share = series.lessonsTotal > 0 ? Math.min(series.lessonsDone / series.lessonsTotal, 1) : 0
  return (
    <HomeSection
      id="progress"
      title="Your progress"
      action={{ label: 'Details', to: '/progress', accessibleLabel: 'See your progress in detail' }}
      className="progress"
    >
      <div className="panel progress-panel">
        <Link to={series.to} className="series">
          <svg className="series-ring" viewBox="0 0 64 64" aria-hidden>
            <circle className="series-ring-track" cx="32" cy="32" r={RING_RADIUS} />
            <circle
              className="series-ring-fill"
              cx="32"
              cy="32"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - share)}
            />
          </svg>
          <span className="series-text">
            <span className="series-label">Current series</span>
            <span className="series-name">{series.series}</span>
            <span className="series-count">
              {series.lessonsDone} of {series.lessonsTotal} lessons done
            </span>
          </span>
        </Link>
        <dl className="stat-list">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-row">
              <dt className="stat-label">{stat.label}</dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </HomeSection>
  )
}
