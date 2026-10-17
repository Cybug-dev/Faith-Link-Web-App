import './stat-icons.scss'

/**
 * Live icons for the welcome stats. Plain SVG + CSS keyframes (transform and
 * opacity only), so they cost no library and stay smooth on slow phones.
 * All motion stops under prefers-reduced-motion.
 */

/** A flame that flickers: the outer flame sways, the bright core breathes, a soft glow pulses. */
export function FlameIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="stat-svg stat-flame">
      <path
        className="flame-outer"
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
      <path
        className="flame-core"
        d="M12 21a3.5 3.5 0 0 0 3.5-3.5c0-1.8-1.3-3-2.2-4.5-.4 1.3-1.2 2.1-2.3 2.6-.8.4-2.5 1.2-2.5 1.9A3.5 3.5 0 0 0 12 21z"
      />
    </svg>
  )
}

/** A star that floats up and down a little and glows. */
export function StarIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="stat-svg stat-star">
      <path d="M11.53 2.3a.53.53 0 0 1 .94 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0l-4.62 2.43a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.91l5.16-.75a2.12 2.12 0 0 0 1.6-1.16z" />
    </svg>
  )
}

/** Three bars that grow one after another, smallest first, then start again. */
export function LevelIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="stat-svg stat-level">
      <rect className="level-bar level-bar-1" x="3" y="14" width="4.5" height="7" rx="1.5" />
      <rect className="level-bar level-bar-2" x="9.75" y="9" width="4.5" height="12" rx="1.5" />
      <rect className="level-bar level-bar-3" x="16.5" y="3" width="4.5" height="18" rx="1.5" />
    </svg>
  )
}
