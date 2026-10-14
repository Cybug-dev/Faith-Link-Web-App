import { useCallback, useEffect, useState } from 'react'

/**
 * Counts down once per second. Starts at `initial` (defaults to `seconds`);
 * `restart()` jumps back to `seconds`.
 */
export function useCountdown(
  seconds: number,
  initial: number = seconds,
): { remaining: number; restart: () => void } {
  const [remaining, setRemaining] = useState(initial)

  useEffect(() => {
    if (remaining <= 0) return
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => window.clearTimeout(id)
  }, [remaining])

  const restart = useCallback(() => setRemaining(seconds), [seconds])
  return { remaining, restart }
}

/** 42 -> "0:42", 125 -> "2:05" */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
