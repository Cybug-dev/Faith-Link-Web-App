import '@fontsource-variable/caveat'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button-variants'
import { FOCUS_IMAGE_SRCSET, WELCOME_IMAGE_SRCSET, type FocusLesson, type WelcomeStats } from './home-sample-data'
import { FlameIcon, LevelIcon, StarIcon } from './stat-icons'
import './focus-banner.scss'

type Stat = { key: string; icon: ReactNode; value: string; label: string }

/**
 * Full-width "Today's focus" hero from the owner's reference images: the lesson
 * card and the welcome panel. One DOM, pure CSS layout (container queries in the .scss):
 * - wide: one photo card, the welcome panel sits inside it on the right
 * - tighter: the panel steps out beside the lesson as its own card with its own photo
 * - phones: the two cards sit in a swipeable row, the panel peeking in from the side
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
    { key: 'streak', icon: <FlameIcon />, value: String(welcome.streakDays), label: 'Day Streak' },
    { key: 'points', icon: <StarIcon />, value: welcome.points.toLocaleString('en'), label: 'Points' },
    { key: 'level', icon: <LevelIcon />, value: `Level ${welcome.level}`, label: welcome.levelName },
  ]

  return (
    <div className="focus-hero">
      <div className="focus-row">
        <article className="focus-card" aria-labelledby="focus-title">
          {/* The first thing on screen (LCP): load it straight away and let the CDN size it. */}
          <img
            className="hero-photo focus-photo"
            src={lesson.image.src}
            srcSet={FOCUS_IMAGE_SRCSET}
            sizes="(min-width: 1024px) 1200px, 100vw"
            alt={lesson.image.alt}
            width={1200}
            height={800}
            fetchPriority="high"
            decoding="async"
          />
          <p className="focus-tag">Today’s Focus</p>
          <h2 id="focus-title" className="focus-title">
            {lesson.title}
          </h2>
          <blockquote className="focus-verse">
            <p className="focus-verse-text">“{lesson.verse.text}”</p>
            <cite className="focus-verse-ref">{lesson.verse.reference}</cite>
          </blockquote>
          <Link to={lesson.to} className={buttonVariants({ variant: 'primary', className: 'focus-action' })}>
            Continue Learning
            <ArrowRight aria-hidden className="focus-action-icon" />
          </Link>
        </article>

        <section className="welcome-panel" aria-labelledby="welcome-title">
          {/* Only shown when the panel stands on its own; lazy so it costs nothing until then. */}
          <img
            className="hero-photo welcome-photo"
            src={welcome.image.src}
            srcSet={WELCOME_IMAGE_SRCSET}
            sizes="(min-width: 600px) 480px, 90vw"
            alt={welcome.image.alt}
            width={800}
            height={533}
            loading="lazy"
            decoding="async"
          />
          <div className="welcome-head">
            <div>
              <h2 id="welcome-title" className="welcome-title">
                Welcome back, {firstName}!
              </h2>
              <p className="welcome-message">{welcome.message}</p>
            </div>
            <blockquote className="welcome-verse">
              <p className="welcome-verse-text">“{welcome.verse.text}”</p>
              <cite className="welcome-verse-ref">{welcome.verse.reference}</cite>
            </blockquote>
          </div>
          <ul className="welcome-stats">
            {stats.map((stat) => (
              <li key={stat.key} className="welcome-stat">
                <span className="welcome-stat-icon">{stat.icon}</span>
                <span className="welcome-stat-text">
                  <span className="welcome-stat-value">{stat.value}</span>
                  <span className="welcome-stat-label">{stat.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
