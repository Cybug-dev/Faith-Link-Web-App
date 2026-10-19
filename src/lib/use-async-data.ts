import { type DependencyList, useCallback, useEffect, useState } from 'react'

export type AsyncData<T> = {
  data: T | undefined
  error: unknown
  isLoading: boolean
  /** Loads again, keeping the current data on screen until the new answer arrives. */
  reload: () => void
}

type Settled<T> = { load: unknown; attempt: number; data?: T; error?: unknown }

/** Runs `load` on mount and whenever `deps` change; ignores answers that arrive after a newer request. */
export function useAsyncData<T>(load: () => Promise<T>, deps: DependencyList): AsyncData<T> {
  // A new function identity per deps change marks a new request, so loading is derived, not stored.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps)
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T>>({ load: null, attempt: -1 })

  useEffect(() => {
    let isCurrent = true
    run().then(
      (data) => isCurrent && setSettled({ load: run, attempt, data }),
      (error: unknown) => isCurrent && setSettled((s) => ({ load: run, attempt, data: s.data, error })),
    )
    return () => {
      isCurrent = false
    }
  }, [run, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  const isLoading = settled.load !== run || settled.attempt !== attempt
  return { data: settled.data, error: isLoading ? undefined : settled.error, isLoading, reload }
}
