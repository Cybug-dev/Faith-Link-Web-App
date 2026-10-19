import { BadgeCheck, Building2, ChevronDown, Compass, MapPin, Sprout } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import {
  SAMPLE_CHURCH_STATS,
  SAMPLE_FILTERS,
  SAMPLE_SORT,
  type FilterCategory,
} from './church-page-sample-data'
import './church-hero.scss'

const FILTER_ICONS = [Compass, BadgeCheck, MapPin, Sprout, null] as const

type ChurchHeroProps = {
  activeFilter?: FilterCategory
  onSelectFilter?: (filter: FilterCategory) => void
}

/** Page header band (Stitch): breadcrumb, title, sample stats, then the scrollable filter row. */
export function ChurchHero({ activeFilter = 'Explore all churches', onSelectFilter }: ChurchHeroProps) {
  const showComingSoon = useComingSoon()

  return (
    <header className="church-hero">
      <div className="hero-top">
        <div className="hero-text">
          <p className="hero-crumbs">
            <span className="hero-crumb-root">
              <Building2 aria-hidden className="hero-crumb-icon" />
              FaithLink ecosystem
            </span>
            <span aria-hidden className="hero-crumb-sep">
              /
            </span>
            <span className="hero-crumb">Churches</span>
          </p>
          <h1 className="hero-title">
            Find your church or <span className="hero-title-accent">Plant a church</span>
          </h1>
          <p className="hero-subtitle">
            Connect with your local church home, join weekly live streams, or set up your church’s space with member
            directories and sermon studies.
          </p>
        </div>
        <dl className="hero-stats">
          {SAMPLE_CHURCH_STATS.map((stat) => (
            <div key={stat.id} className="hero-stat">
              <dt className="hero-stat-label">{stat.label}</dt>
              <dd className={'tone' in stat ? `hero-stat-value hero-stat-${stat.tone}` : 'hero-stat-value'}>
                {stat.id === 'churches' && <span aria-hidden className="hero-stat-dot" />}
                {stat.id === 'verified' && <BadgeCheck aria-hidden className="hero-stat-icon" />}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <nav className="hero-filters" aria-label="Church categories">
        <ul className="hero-filter-list">
          {SAMPLE_FILTERS.map((label, index) => {
            const Icon = FILTER_ICONS[index]
            const isCurrent = activeFilter === label
            return (
              <li key={label}>
                <button
                  type="button"
                  aria-pressed={isCurrent}
                  className={isCurrent ? 'hero-filter hero-filter-current' : 'hero-filter'}
                  onClick={() => onSelectFilter?.(label)}
                >
                  {Icon ? <Icon aria-hidden className="hero-filter-icon" /> : <span aria-hidden className="hero-live-dot" />}
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="hero-sort">
          Sorting by:
          <button type="button" className="hero-sort-button" onClick={() => showComingSoon('Sorting')}>
            {SAMPLE_SORT}
            <ChevronDown aria-hidden className="hero-sort-icon" />
          </button>
        </p>
      </nav>
    </header>
  )
}
