import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button-variants'
import { FOCUS_IMAGE_SRCSET, type FocusLesson } from './home-sample-data'
import './focus-card.scss'

/** "Today's focus": the lesson to do next, over a photo, with its verse. */
export function FocusCard({ lesson }: { lesson: FocusLesson }) {
  return (
    <article className="focus-card" aria-labelledby="focus-title">
      {/* The first thing on screen (LCP): load it straight away and let the CDN size it. */}
      <img
        className="focus-photo"
        src={lesson.image.src}
        srcSet={FOCUS_IMAGE_SRCSET}
        sizes="(min-width: 1024px) 720px, 100vw"
        alt={lesson.image.alt}
        width={800}
        height={533}
        fetchPriority="high"
        decoding="async"
      />
      <div className="focus-body">
        <p className="focus-tag">
          Today’s focus
          <span aria-hidden className="focus-tag-dot" />
          <Clock aria-hidden className="focus-tag-icon" />
          {lesson.minutes} min
        </p>
        <h2 id="focus-title" className="focus-title">
          {lesson.title}
        </h2>
        <blockquote className="focus-verse">
          <p className="focus-verse-text">“{lesson.verse.text}”</p>
          <cite className="focus-verse-ref">{lesson.verse.reference}</cite>
        </blockquote>
        <Link to={lesson.to} className={buttonVariants({ variant: 'primary', className: 'focus-action' })}>
          Continue lesson
          <ArrowRight aria-hidden className="focus-action-icon" />
        </Link>
      </div>
    </article>
  )
}
