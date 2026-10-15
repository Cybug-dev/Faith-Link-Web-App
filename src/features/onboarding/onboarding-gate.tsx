import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { hasSeenOnboarding } from './onboarding-storage'

export const ONBOARDING_PATH = '/onboarding'

/**
 * Wraps home so every way of signing in (password, email code, Google, password
 * reset) passes through onboarding once on this device, without each auth page
 * having to know about it.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  if (!hasSeenOnboarding()) return <Navigate to={ONBOARDING_PATH} replace />
  return children
}
