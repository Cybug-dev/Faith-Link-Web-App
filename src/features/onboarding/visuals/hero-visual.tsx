import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ONBOARDING_SCRIPTURE } from '@/features/auth/scripture'
import { onboardingImages } from '../onboarding-images'
import type { StepVisualProps } from '../onboarding-steps'
import './hero-visual.scss'

/** Chunky filled quotation mark, as in the reference. */
function QuoteMark() {
  const mark = 'M0 4a4 4 0 0 1 4-4h5a2 2 0 0 1 2 2v7c0 6-2.6 10.5-8.2 12.6L1.6 19c2.6-1.4 4-3.6 4.3-6.6H4a4 4 0 0 1-4-4z'
  return (
    <svg aria-hidden viewBox="0 0 26 22" className="onboarding-hero__quote-icon">
      <path d={mark} />
      <path d={mark} transform="translate(14 0)" />
    </svg>
  )
}

/**
 * Step 1: group photo with the verse card. Phones: the photo fills the lower
 * screen edge to edge, fading in at the top, with a warm frosted verse card and
 * the Next arrow (owner's choice). Desktop: framed photo on layered amber panels.
 */
export function HeroVisual({ onNext }: StepVisualProps) {
  const { text, reference, translation } = ONBOARDING_SCRIPTURE
  return (
    <div className="onboarding-hero">
      <span aria-hidden className="onboarding-hero__panel onboarding-hero__panel--back" />
      <span aria-hidden className="onboarding-hero__panel onboarding-hero__panel--front" />
      <img className="onboarding-hero__photo" src={onboardingImages.hero} alt="A group of young friends smiling at a tablet together" />
      <figure className="onboarding-hero__verse">
        <QuoteMark />
        <blockquote className="onboarding-hero__verse-text">“{text}”</blockquote>
        <figcaption className="onboarding-hero__verse-ref">
          {reference} ({translation})
        </figcaption>
        <Button size="icon" aria-label="Next" className="onboarding-hero__next" onClick={onNext}>
          <ArrowRight aria-hidden className="size-5" />
        </Button>
      </figure>
    </div>
  )
}
