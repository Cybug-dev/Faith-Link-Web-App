import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { FROM_ONBOARDING, ONBOARDING_PATH } from './onboarding-routes'
import { hasSeenOnboarding } from './onboarding-storage'

/**
 * Wraps home so every way of signing in (password, email code, Google, password
 * reset) passes through onboarding, without each auth page having to know about it.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const state = useLocation().state as Partial<typeof FROM_ONBOARDING> | null
  if (!state?.fromOnboarding && !hasSeenOnboarding()) return <Navigate to={ONBOARDING_PATH} replace />
  return children
}
