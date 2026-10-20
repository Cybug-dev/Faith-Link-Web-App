/**
 * Offline stand-in for the real auth client, used by every test (see setup.ts).
 *
 * Triggers so each UI state can be exercised:
 *   password "wrong-password"      -> INVALID_CREDENTIALS
 *   email containing "unverified"  -> EMAIL_NOT_VERIFIED (sign in)
 *   email "error@example.com"      -> UNKNOWN (any call taking an email)
 *   code "000000"                  -> INVALID_CODE
 *   code "999999"                  -> CODE_EXPIRED
 *   code "111111"                  -> TOO_MANY_ATTEMPTS
 * Anything else succeeds.
 */
import type { AuthClient, AuthSession } from '@/features/auth/auth-client'
import { AuthError } from '@/features/auth/auth-errors'

function failOnErrorEmail(email: string): void {
  if (email === 'error@example.com') throw new AuthError('UNKNOWN')
}

function checkCode(otp: string): void {
  if (otp === '000000') throw new AuthError('INVALID_CODE')
  if (otp === '999999') throw new AuthError('CODE_EXPIRED')
  if (otp === '111111') throw new AuthError('TOO_MANY_ATTEMPTS')
}

/** Signed out by default; a successful sign-in or verification signs in (see setup.ts for the reset). */
let session: AuthSession | null = null
/** Set by setup.ts to clear the app's remembered answer (importing session.ts here would loop). */
let onSessionChange: () => void = () => {}

export const fakeSession = {
  /** Start a test signed in. `isNewAccount` makes the account brand new (onboarding shows). */
  signIn({ isNewAccount = false }: { isNewAccount?: boolean } = {}) {
    session = { createdAt: isNewAccount ? new Date() : new Date('2025-01-01'), name: 'Alex Turner' }
    // The app must ask again rather than keep the "signed out" answer from the test's start.
    onSessionChange()
  },
  setOnSessionChange(listener: () => void) {
    onSessionChange = listener
  },
  reset() {
    session = null
  },
}

export const fakeAuthClient: AuthClient = {
  async signInWithEmail({ email, password }) {
    failOnErrorEmail(email)
    if (email.includes('unverified')) throw new AuthError('EMAIL_NOT_VERIFIED')
    if (password === 'wrong-password') throw new AuthError('INVALID_CREDENTIALS')
    fakeSession.signIn()
  },
  async signUpWithEmail({ email }) {
    failOnErrorEmail(email)
  },
  async verifyEmail({ otp }) {
    checkCode(otp)
    fakeSession.signIn({ isNewAccount: true })
  },
  async resendVerificationCode() {},
  async signInWithGoogle() {},
  async requestPasswordReset({ email }) {
    failOnErrorEmail(email)
  },
  async checkResetCode({ email, otp }) {
    failOnErrorEmail(email)
    checkCode(otp)
  },
  async resetPassword({ email, otp }) {
    failOnErrorEmail(email)
    checkCode(otp)
  },
  async getSession() {
    return session
  },
  async getApiToken() {
    return session ? 'fake-api-token' : null
  },
}
