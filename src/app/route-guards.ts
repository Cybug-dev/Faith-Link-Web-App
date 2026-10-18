import { redirect } from 'react-router'
import { getSessionState } from '@/features/auth/session'
import { ONBOARDING_PATH } from '@/features/onboarding/onboarding-routes'
import { hasSeenOnboarding } from '@/features/onboarding/onboarding-storage'

/**
 * Route loaders (owner, 2026-10-18): a signed-in person always lands on home, a signed-out one
 * on sign in, and onboarding is only for brand-new accounts. Loaders run before a page renders,
 * so the wrong screen never flashes. Sign in and create account use RedirectIfSignedIn instead.
 */

/** The site's address: home when signed in, sign in otherwise. */
export async function startPage(): Promise<Response> {
  const { isSignedIn } = await getSessionState()
  return redirect(isSignedIn ? '/home' : '/sign-in')
}

/** Onboarding: only for someone signed in. */
export async function requireSignedIn(): Promise<Response | null> {
  const { isSignedIn } = await getSessionState()
  return isSignedIn ? null : redirect('/sign-in')
}

/** The app: signed in, and a brand-new account sees onboarding once first (e.g. after Google sign-up). */
export async function requireSignedInApp(): Promise<Response | null> {
  const { isSignedIn, isNewAccount } = await getSessionState()
  if (!isSignedIn) return redirect('/sign-in')
  if (isNewAccount && !hasSeenOnboarding()) return redirect(ONBOARDING_PATH)
  return null
}
