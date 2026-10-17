import { Children, useEffect, useRef, type ReactNode } from 'react'
import './hero-carousel.scss'

/** Time each slide stays before the next one slides in. */
const SLIDE_INTERVAL_MS = 6000
/** Below this width the cards share one swipeable row; at and above it they sit side by side. */
const CAROUSEL_QUERY = '(max-width: 63.999rem)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Phones and tablets: one card at a time in a native scroll-snap row (swipe
 * works for free), sliding to the next card on its own; the next card peeks in
 * instead of dots. Desktop: every card stays visible side by side, no motion.
 *
 * Auto-advance pauses while the person touches, hovers or focuses the row, when
 * the tab is hidden, and never runs under reduced motion (WCAG 2.2.2).
 * Plain CSS + one interval: no animation library on the home screen.
 */
export function HeroCarousel({ label, children }: { label: string; children: ReactNode }) {
  const trackRef = useRef<HTMLElement>(null)
  const slides = Children.toArray(children)

  useEffect(() => {
    const track = trackRef.current
    if (!track || typeof window.matchMedia !== 'function') return
    const carousel = window.matchMedia(CAROUSEL_QUERY)
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    let timer: number | undefined
    let isHeld = false

    // Scroll position of each slide. Measured from the first slide because the row's
    // side padding (the peek) shifts every offsetLeft by the page margin.
    const slideStops = () => {
      const items = Array.from(track.children) as HTMLElement[]
      const first = items[0]?.offsetLeft ?? 0
      return items.map((item) => item.offsetLeft - first)
    }

    const advance = () => {
      if (document.hidden || isHeld) return
      const stops = slideStops()
      let current = 0
      stops.forEach((stop, index) => {
        if (Math.abs(stop - track.scrollLeft) < Math.abs((stops[current] ?? 0) - track.scrollLeft)) current = index
      })
      track.scrollTo({ left: stops[(current + 1) % stops.length] ?? 0, behavior: 'smooth' })
    }

    const restart = () => {
      window.clearInterval(timer)
      timer = undefined
      if (carousel.matches && !reducedMotion.matches && track.children.length > 1) {
        timer = window.setInterval(advance, SLIDE_INTERVAL_MS)
      }
    }

    const hold = () => {
      isHeld = true
    }
    // Letting go starts a fresh full interval, so a card never jumps right after a swipe.
    const release = () => {
      isHeld = false
      restart()
    }

    restart()
    carousel.addEventListener('change', restart)
    reducedMotion.addEventListener('change', restart)
    track.addEventListener('pointerenter', hold)
    track.addEventListener('pointerleave', release)
    track.addEventListener('touchstart', hold, { passive: true })
    track.addEventListener('touchend', release, { passive: true })
    track.addEventListener('focusin', hold)
    track.addEventListener('focusout', release)

    return () => {
      window.clearInterval(timer)
      carousel.removeEventListener('change', restart)
      reducedMotion.removeEventListener('change', restart)
      track.removeEventListener('pointerenter', hold)
      track.removeEventListener('pointerleave', release)
      track.removeEventListener('touchstart', hold)
      track.removeEventListener('touchend', release)
      track.removeEventListener('focusin', hold)
      track.removeEventListener('focusout', release)
    }
  }, [])

  return (
    <section className="hero-carousel" ref={trackRef} aria-roledescription="carousel" aria-label={label}>
      {slides.map((slide, index) => (
        // Slides are a fixed, ordered set of cards (each an article with its own heading); position is their identity.
        <div key={index} className="hero-slide">
          {slide}
        </div>
      ))}
    </section>
  )
}
