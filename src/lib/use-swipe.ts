import { useRef, type PointerEvent } from 'react'

/** A horizontal move shorter than this (px) is a tap or a wobble, not a swipe. */
const MIN_DISTANCE = 50

type Handlers = { onSwipeLeft: () => void; onSwipeRight: () => void }

/**
 * Touch swipe detection with pointer events, no library. Spread the result on
 * the swipe area and give it `touch-action: pan-y` so vertical scrolling still
 * works. Mouse drags are ignored so desktop text selection isn't hijacked.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight }: Handlers) {
  const start = useRef<{ x: number; y: number } | null>(null)

  return {
    onPointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse') return
      start.current = { x: event.clientX, y: event.clientY }
    },
    onPointerUp(event: PointerEvent) {
      const from = start.current
      start.current = null
      if (!from) return
      const dx = event.clientX - from.x
      const dy = event.clientY - from.y
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy)) return
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
    },
    onPointerCancel() {
      start.current = null
    },
  }
}
