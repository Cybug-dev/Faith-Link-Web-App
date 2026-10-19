import { useCallback, useState } from 'react'
import { ApiError } from '@/lib/api-client'

export type ChurchAction = {
  /** Runs one change at a time; resolves true when it worked. */
  run: (change: () => Promise<unknown>, successMessage: string) => Promise<boolean>
  isPending: boolean
  error: string | null
  notice: string | null
  clear: () => void
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.'
}

/** Shared pending/error/success state for the church's buttons, so every action reports back the same way. */
export function useChurchAction(): ChurchAction {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const run = useCallback(async (change: () => Promise<unknown>, successMessage: string) => {
    setIsPending(true)
    setError(null)
    setNotice(null)
    try {
      await change()
      setNotice(successMessage)
      return true
    } catch (e) {
      setError(errorMessage(e))
      return false
    } finally {
      setIsPending(false)
    }
  }, [])

  const clear = useCallback(() => {
    setError(null)
    setNotice(null)
  }, [])

  return { run, isPending, error, notice, clear }
}
