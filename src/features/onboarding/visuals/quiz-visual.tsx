import { Check, Crown } from 'lucide-react'
import { CrossMark } from '@/components/brand/logo'
import { cn } from '@/lib/cn'
import { onboardingImages } from '../onboarding-images'
import './quiz-visual.scss'

/** Sample question for the illustration only. */
const OPTIONS = [
  { letter: 'A', text: 'Wealth and success' },
  { letter: 'B', text: 'Obedience to God', chosen: true },
  { letter: 'C', text: 'Popularity' },
  { letter: 'D', text: 'Comfort and ease' },
]

/** Static flecks around the card, as in the reference (positions in the stylesheet). */
const CONFETTI = [1, 2, 3, 4, 5, 6, 7]

/** Step 3: a preview of a live quiz question (desktop design, used on every screen size). Decorative: the step's text says what it shows. */
export function QuizVisual() {
  return (
    <div className="onboarding-quiz" aria-hidden>
      <span className="onboarding-quiz__panel onboarding-quiz__panel--back" />
      <span className="onboarding-quiz__panel onboarding-quiz__panel--front" />
      <span className="onboarding-quiz__confetti">
        {CONFETTI.map((n) => (
          <span key={n} />
        ))}
      </span>
      <Crown aria-hidden className="onboarding-quiz__crown" />
      <div className="onboarding-quiz__card">
        <div className="onboarding-quiz__top">
          <span className="onboarding-quiz__label">
            <CrossMark className="onboarding-quiz__cross" />
            Live quiz
          </span>
          <span className="onboarding-quiz__points">+100 pts</span>
        </div>
        <svg className="onboarding-quiz__timer" viewBox="0 0 48 48" aria-hidden>
          <circle className="onboarding-quiz__timer-track" cx="24" cy="24" r="21" />
          <circle className="onboarding-quiz__timer-arc" cx="24" cy="24" r="21" pathLength="100" />
          <text x="24" y="28" textAnchor="middle">
            00:28
          </text>
        </svg>
        <p className="onboarding-quiz__question">What does the Bible say about true happiness?</p>
        <ul className="onboarding-quiz__options">
          {OPTIONS.map((option) => (
            <li key={option.letter} className={cn('onboarding-quiz__option', option.chosen && 'onboarding-quiz__option--chosen')}>
              <span className="onboarding-quiz__letter">{option.letter}</span>
              {option.text}
              {option.chosen && <Check aria-hidden className="onboarding-quiz__check" />}
            </li>
          ))}
        </ul>
        <div className="onboarding-quiz__players">
          {onboardingImages.players.map((src) => (
            <img key={src} className="onboarding-quiz__avatar" src={src} alt="" />
          ))}
        </div>
      </div>
    </div>
  )
}
