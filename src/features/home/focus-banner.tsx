import '@fontsource-variable/caveat'
import { ArrowRight, ChartNoAxesColumnIncreasing, Flame, Star, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button-variants'
import { FOCUS_IMAGE_SRCSET, type FocusLesson, type WelcomeStats } from './home-sample-data'
import './focus-banner.scss'

type Stat = { icon: LucideIcon; tone: 'streak' | 'points' | 'level'; value: string; label: string }

function StatTile({ stat }: { stat: Stat }) {
  const Icon = stat.icon
  return (
    <li className="banner-stat">
      <Icon aria-hidden className={`banner-stat-icon banner-stat-icon-${stat.tone}`} />
      <span className="banner-stat-text">
        <span className="banner-stat-value">{stat.value}</span>
        <span className="banner-stat-label">{stat.label}</span>
      </span>
    </li>
  )
}

/**
 * Full-width "Today's focus" banner from the owner's reference: the lesson to
 * continue over a photo, and a night panel with the welcome, stats and a verse.
 * Desktop: panel on the right of the photo. Phone: panel below the photo.
 */
export function FocusBanner({
  lesson,
  welcome,
  firstName,
}: {
  lesson: FocusLesson
  welcome: WelcomeStats
  firstName: string
}) {
  const stats: Stat[] = [
    { icon: Flame, tone: 'streak', value: String(welcome.streakDays), label: 'Day Streak' },
    { icon: Star, tone: 'points', value: welcome.points.toLocaleString('en'), label: 'Points' },
    { icon: ChartNoAxesColumnIncreasing, tone: 'level', value: `Level ${welcome.level}`, label: welcome.levelName },
  ]

  return (
    <article className="focus-banner" aria-labelledby="focus-title">
      {/* The first thing on screen (LCP): load it straight away and let the CDN size it. */}
      <img
        className="banner-photo"
        src={lesson.image.src}
        srcSet={FOCUS_IMAGE_SRCSET}
        sizes="(min-width: 1024px) 1120px, 100vw"
        alt={lesson.image.alt}
        width={1200}
        height={800}
        fetchPriority="high"
        decoding="async"
      />

      <div className="banner-focus">
        <p className="banner-tag">Today’s Focus</p>
        <h2 id="focus-title" className="banner-title">
          {lesson.title}
        </h2>
        <p className="banner-reference">{lesson.reference}</p>
        <Link to={lesson.to} className={buttonVariants({ variant: 'primary', className: 'banner-action' })}>
          Continue Learning
          <ArrowRight aria-hidden className="banner-action-icon" />
        </Link>
      </div>

      <section className="banner-panel" aria-labelledby="welcome-title">
        <div className="banner-panel-head">
          <div>
            <h2 id="welcome-title" className="banner-welcome">
              Welcome back, {firstName}!
            </h2>
            <p className="banner-message">{welcome.message}</p>
          </div>
          <blockquote className="banner-verse">
            <p className="banner-verse-text">“{welcome.verse.text}”</p>
            <cite className="banner-verse-ref">{welcome.verse.reference}</cite>
          </blockquote>
        </div>
        <ul className="banner-stats">
          {stats.map((stat) => (
            <StatTile key={stat.tone} stat={stat} />
          ))}
        </ul>
      </section>
    </article>
  )
}
