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
import type { AuthClient } from '@/features/auth/auth-client'
import { AuthError } from '@/features/auth/auth-errors'

function failOnErrorEmail(email: string): void {
  if (email === 'error@example.com') throw new AuthError('UNKNOWN')
}

function checkCode(otp: string): void {
  if (otp === '000000') throw new AuthError('INVALID_CODE')
  if (otp === '999999') throw new AuthError('CODE_EXPIRED')
  if (otp === '111111') throw new AuthError('TOO_MANY_ATTEMPTS')
}

export const fakeAuthClient: AuthClient = {
  async signInWithEmail({ email, password }) {
    failOnErrorEmail(email)
    if (email.includes('unverified')) throw new AuthError('EMAIL_NOT_VERIFIED')
    if (password === 'wrong-password') throw new AuthError('INVALID_CREDENTIALS')
  },
  async signUpWithEmail({ email }) {
    failOnErrorEmail(email)
  },
  async verifyEmail({ otp }) {
    checkCode(otp)
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
}
