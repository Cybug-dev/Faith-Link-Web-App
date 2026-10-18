import { ArrowRight, ChevronLeft } from 'lucide-react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useSwipe } from '@/lib/use-swipe'
import { markOnboardingSeen } from './onboarding-storage'
import { ONBOARDING_STEPS } from './onboarding-steps'
import './onboarding.scss'

const LAST = ONBOARDING_STEPS.length - 1

/*
 * Step change: the old screen slides out and fades, the new one slides in from
 * the side you're heading to. Motion takes numbers, not CSS variables, so these
 * mirror the motion tokens (--motion-duration-base / -slow, --motion-ease-out).
 * Under "reduce motion" MotionConfig drops the slide and keeps only the fade.
 */
const SLIDE_PX = 40
const RISE_PX = 16
const EASE_OUT = [0.2, 0, 0, 1] as const
/** Direction 0 is the very first arrival: no sideways slide, the content rises in instead. */
const slide: Variants = {
  enter: (direction: number) => ({ x: direction * SLIDE_PX, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: EASE_OUT, staggerChildren: 0.08 } },
  exit: (direction: number) => ({ x: direction * -SLIDE_PX, opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }),
}
/** Text first, then the illustration, each easing up a little behind the one before. */
const rise: Variants = {
  enter: { y: RISE_PX, opacity: 0 },
  center: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
}
/** Header and footer settle in from their edges on arrival. */
const edge = (from: number): Variants => ({
  hidden: { y: from, opacity: 0 },
  shown: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT, delay: 0.1 } },
})
const fromTop = edge(-RISE_PX)
const fromBottom = edge(RISE_PX)

/** Elements that already act on Enter themselves. */
const ENTER_HANDLED = 'button, a, input, textarea, select'

export function OnboardingPage() {
  useDocumentTitle('Welcome')
  const navigate = useNavigate()
  const [[index, direction], setStep] = useState<[number, number]>([0, 0])
  const step = ONBOARDING_STEPS[index] ?? ONBOARDING_STEPS[0]
  const isFirst = index === 0
  const isLast = index === LAST

  const finish = useCallback(() => {
    markOnboardingSeen()
    navigate('/home', { replace: true })
  }, [navigate])

  const next = useCallback(() => {
    if (index === LAST) finish()
    else setStep([index + 1, 1])
  }, [index, finish])

  const back = useCallback(() => {
    if (index > 0) setStep([index - 1, -1])
  }, [index])

  const swipe = useSwipe({ onSwipeLeft: next, onSwipeRight: back })

  // Desktop keyboard: arrows move between steps, Enter goes forward.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight') next()
      else if (event.key === 'ArrowLeft') back()
      else if (event.key === 'Enter' && !(event.target as Element).closest(ENTER_HANDLED)) next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, back])

  // Warm the cache for the next step's photos.
  useEffect(() => {
    ONBOARDING_STEPS[index + 1]?.images.forEach((src) => {
      new Image().src = src
    })
  }, [index])

  const position = `Step ${index + 1} of ${ONBOARDING_STEPS.length}`
  const { Visual } = step

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="onboarding">
          <m.header className="onboarding__header" variants={fromTop} initial="hidden" animate="shown">
            <Logo mark="cross" />
            <Button variant="text" size="sm" onClick={finish}>
              Skip
            </Button>
          </m.header>

          {/* Visual only; the announcer below carries "Step X of 4" for screen readers. */}
          <m.div className="onboarding__progress" aria-hidden variants={fromTop} initial="hidden" animate="shown">
            {ONBOARDING_STEPS.map((s, i) => (
              <span key={s.id} className={cn('onboarding__segment', i === index && 'onboarding__segment--current')} />
            ))}
          </m.div>

          {/* Says which step this is and announces each change (a replaced heading isn't reported by screen readers). */}
          <p className="onboarding__announcer" aria-live="polite">
            {`${position}: ${step.title}`}
          </p>

          <main className="onboarding__main" {...swipe}>
            <AnimatePresence mode="wait" custom={direction}>
              <m.section
                key={step.id}
                className={cn('onboarding__step', step.bleed && 'onboarding__step--bleed')}
                aria-labelledby={`onboarding-${step.id}`}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <m.div className="onboarding__text" variants={rise}>
                  <p className="onboarding__eyebrow" aria-hidden>
                    {position}
                  </p>
                  <h1 id={`onboarding-${step.id}`} className="onboarding__title">
                    {step.title}
                  </h1>
                  <p className="onboarding__body">{step.body}</p>
                  <ul className="onboarding__features">
                    {step.features.map(({ icon: Icon, title, detail }) => (
                      <li key={title} className="onboarding__feature">
                        <span className="onboarding__feature-icon">
                          <Icon aria-hidden />
                        </span>
                        <span>
                          <span className="onboarding__feature-title">{title}</span>
                          {detail && <span className="onboarding__feature-detail">{detail}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </m.div>
                <m.div className={cn('onboarding__visual', step.bleed && 'onboarding__visual--bleed')} variants={rise}>
                  <Visual onNext={next} />
                </m.div>
              </m.section>
            </AnimatePresence>
          </main>

          <m.footer
            className={cn('onboarding__footer', isFirst && 'onboarding__footer--first')}
            variants={fromBottom}
            initial="hidden"
            animate="shown"
          >
            {!isFirst && (
              <Button variant="surface" size="icon" aria-label="Back" className="onboarding__back" onClick={back}>
                <ChevronLeft aria-hidden className="size-5" />
              </Button>
            )}
            <Button className="onboarding__next" onClick={next}>
              {isLast ? 'Get started' : 'Next'}
              <ArrowRight aria-hidden className="size-5" />
            </Button>
          </m.footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
