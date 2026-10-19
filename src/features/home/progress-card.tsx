import { useEffect, useRef, useState } from 'react'
import { BadgeList } from './badge-list'
import { CardHead } from './card-head'
import type { Achievement, ProgressOverview, ProgressStat } from './home-sample-data'
import { SectionLink } from './section-link'
import './progress-card.scss'

const RING_RADIUS = 48
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
const FILL_DURATION_MS = 1400

// Slow start, quick middle, soft landing, so the fill feels physical rather than linear.
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function canAnimate(): boolean {
  return typeof IntersectionObserver !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/** Counts from 0 to `target` once the element is fully on screen; jumps straight to it when motion is off. */
function useFillOnView<T extends HTMLElement>(target: number) {
  const ref = useRef<T>(null)
  const [value, setValue] = useState(() => (canAnimate() ? 0 : target))

  useEffect(() => {
    const node = ref.current
    if (!node || !canAnimate()) return
    let frame = 0
    // "Fully in view", or as much of it as the screen can hold when the card is taller than the screen.
    const threshold = Math.min(1, window.innerHeight / node.getBoundingClientRect().height) * 0.95
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / FILL_DURATION_MS, 1)
          setValue(target * easeInOutCubic(progress))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target])

  return [ref, value] as const
}

type ProgressCardProps = {
  overview: ProgressOverview
  stats: ProgressStat[]
  badges: Achievement[]
}

/** Overall weekly progress as a ring, a colour-keyed tally list, then the latest badges. Real tallies only. */
export function ProgressCard({ overview, stats, badges }: ProgressCardProps) {
  const percent = Number.isFinite(overview.percent) ? Math.round(Math.min(Math.max(overview.percent, 0), 100)) : 0
  const [cardRef, shown] = useFillOnView<HTMLElement>(percent)
  return (
    <section ref={cardRef} aria-labelledby="progress-heading" className="progress">
      <CardHead
        id="progress-heading"
        title="Your Progress"
        subtitle="Weekly spiritual goals"
        link={{ label: 'View Details', to: overview.to, accessibleLabel: 'View details of your progress' }}
        hasDivider
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
              strokeDashoffset={RING_LENGTH * (1 - shown / 100)}
            />
          </svg>
          <span className="ring-text">
            {/* The counting number is for the eye; screen readers get the final value once. */}
            <span aria-hidden className="ring-percent">
              {Math.round(shown)}%
            </span>
            <span className="ring-caption">
              <span className="visually-hidden">{percent}% </span>
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
