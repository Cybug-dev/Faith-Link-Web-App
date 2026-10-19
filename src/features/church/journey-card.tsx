import { ArrowRight, Compass, Headphones } from 'lucide-react'
import { Link } from 'react-router'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import './journey-card.scss'

/** Stitch dark "Individual journey" card, for people not in a church yet: keep growing on your own. */
export function JourneyCard() {
  const showComingSoon = useComingSoon()
  return (
    <section aria-labelledby="journey-heading" className="journey-card">
      <div className="journey-body">
        <p className="journey-pill">
          <Compass aria-hidden className="journey-pill-icon" />
          Individual journey
        </p>
        <h2 id="journey-heading" className="journey-title">
          Not part of a church yet?
        </h2>
        <figure className="journey-quote">
          <blockquote className="journey-quote-text">
            “For where two or three are gathered together in my name, there am I in the midst of them.”
          </blockquote>
          <figcaption className="journey-quote-ref">— Matthew 18:20</figcaption>
        </figure>
        <p className="journey-text">
          Keep building daily scripture habits, take open quizzes, and study the foundations of the faith at your own
          pace.
        </p>
      </div>
      <div className="journey-actions">
        <Link to="/lessons" className="journey-explore">
          Explore lessons
          <ArrowRight aria-hidden className="journey-explore-icon" />
        </Link>
        <button type="button" className="journey-audio" aria-label="Audio lessons" onClick={() => showComingSoon('Audio lessons')}>
          <Headphones aria-hidden className="journey-audio-icon" />
        </button>
      </div>
    </section>
  )
}
