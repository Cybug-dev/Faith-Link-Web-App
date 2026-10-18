import { authClient, type AuthSession } from './auth-client'

/** An account this young counts as new, so a first Google sign-in also gets onboarding. */
const NEW_ACCOUNT_WINDOW_MS = 30 * 60 * 1000
/** A session check that hangs longer than this counts as failed, so the page is never stuck blank. */
const SESSION_TIMEOUT_MS = 8000

export type SessionState = { isSignedIn: boolean; isNewAccount: boolean }

const SIGNED_OUT: SessionState = { isSignedIn: false, isNewAccount: false }

let cached: Promise<SessionState> | null = null

function toState(session: AuthSession | null): SessionState {
  if (!session) return SIGNED_OUT
  const age = session.createdAt ? Date.now() - session.createdAt.getTime() : Infinity
  return { isSignedIn: true, isNewAccount: age < NEW_ACCOUNT_WINDOW_MS }
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Session check timed out')), SESSION_TIMEOUT_MS)
    promise.then(resolve, reject).finally(() => clearTimeout(timer))
  })
}

/**
 * Whether someone is signed in, asked once per page load and shared by every route guard,
 * so moving between pages never waits on the network again. A failed or hung check counts
 * as signed out for that moment but is not remembered, so the next page asks again.
 */
export function getSessionState(): Promise<SessionState> {
  if (cached) return cached
  const attempt = withTimeout(authClient.getSession()).then(toState, () => {
    if (cached === attempt) cached = null
    return SIGNED_OUT
  })
  cached = attempt
  return attempt
}

/** Call right after signing in or out, so the next guard asks again instead of using the old answer. */
export function forgetSessionState(): void {
  cached = null
}
