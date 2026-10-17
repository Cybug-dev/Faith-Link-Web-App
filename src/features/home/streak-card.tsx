import { Check, Flame } from 'lucide-react'
import type { Streak } from './home-sample-data'
import './streak-card.scss'

/** Days in a row with a lesson or quiz, and which days this week count. A tally, never a score. */
export function StreakCard({ streak }: { streak: Streak }) {
  return (
    <article className="streak-card" aria-labelledby="streak-title">
      <div className="streak-head">
        <span aria-hidden className="streak-badge">
          <Flame className="streak-badge-icon" />
        </span>
        <p className="streak-label">Your streak</p>
      </div>
      <h2 id="streak-title" className="streak-days">
        {streak.days}-day streak
      </h2>
      <p className="streak-hint">Do a lesson or quiz today to keep it going.</p>
      <ol className="streak-week" aria-label="This week">
        {streak.week.map((day) => (
          <li key={day.name} className={day.isActive ? 'streak-day is-active' : 'streak-day'}>
            <span aria-hidden className="streak-day-dot">
              {day.isActive && <Check className="streak-day-check" />}
            </span>
            <span aria-hidden className="streak-day-label">
              {day.label}
            </span>
            <span className="streak-day-name">
              {day.name}: {day.isActive ? 'done' : 'not yet'}
            </span>
          </li>
        ))}
      </ol>
    </article>
  )
}
