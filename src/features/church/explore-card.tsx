import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import './explore-card.scss'

const PHOTO = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=70'

export function ExploreCard() {
  const showComingSoon = useComingSoon()
  return (
    <section aria-labelledby="explore-heading" className="explore-card">
      <img
        src={`${PHOTO}&w=640`}
        srcSet={`${PHOTO}&w=480 480w, ${PHOTO}&w=960 960w`}
        sizes="(min-width: 64rem) 40vw, (min-width: 37.5rem) 50vw, 100vw"
        alt=""
        width={640}
        height={360}
        loading="lazy"
        decoding="async"
        className="explore-photo"
      />
      <h2 id="explore-heading" className="explore-title">
        Not part of a church yet?
      </h2>
      <p className="explore-text">
        Don’t stop there. Explore lessons, join public quizzes, and grow in your faith journey.
      </p>
      <Button variant="surface" size="sm" className="explore-button" onClick={() => showComingSoon('Explore')}>
        Explore Now
      </Button>
    </section>
  )
}
