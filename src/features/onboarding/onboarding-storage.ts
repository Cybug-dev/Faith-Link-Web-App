/**
 * Onboarding shows once per device (owner's choice), remembered in localStorage.
 * Storage can throw (private windows, blocked site data); the in-memory flag
 * then still lets the person through to home for this visit instead of looping
 * back to onboarding, and onboarding simply shows again next time.
 */
const KEY = 'faithlink.onboardingSeen'
let seenThisVisit = false

export function hasSeenOnboarding(): boolean {
  if (seenThisVisit) return true
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboardingSeen(): void {
  seenThisVisit = true
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    /* storage unavailable: the in-memory flag covers this visit */
  }
}
