import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from 'motion/react'
import { useState } from 'react'
import { useLocation, useOutlet } from 'react-router'

// Mirror the motion tokens: --motion-duration-fast / -slow and --motion-ease-out.
const EASE_OUT = [0.2, 0, 0, 1] as const
const RISE_PX = 8

const PAGE_VARIANTS: Variants = {
  enter: { opacity: 0, y: RISE_PX },
  shown: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } },
}

// Keeps the leaving page on screen while it fades out, instead of swapping to the new one mid-fade.
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

/** Signed-in pages fade out, then the next one fades in with a small rise. "Reduce motion" keeps only the fade. */
export function PageTransition() {
  const { pathname } = useLocation()
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={pathname} variants={PAGE_VARIANTS} initial="enter" animate="shown" exit="exit">
            <FrozenOutlet />
          </m.div>
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  )
}
