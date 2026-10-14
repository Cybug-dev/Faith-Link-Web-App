/**
 * Auth boundary for the UI.
 *
 * TEMPORARY STUB. The UI is built against this interface; replace the
 * implementation below with `@neondatabase/auth` (createAuthClient) when the
 * backend is wired. Contract: Faith-Link-Backend/docs/AI/FEATURES/auth-and-profile.md.
 *
 * Demo triggers so every UI state can be reviewed without a backend:
 *   password "wrong-password"      -> INVALID_CREDENTIALS
 *   email containing "unverified"  -> EMAIL_NOT_VERIFIED (sign in)
 *   email "error@example.com"      -> UNKNOWN (sign in and create account)
 *   code "000000"                  -> INVALID_CODE
 *   code "999999"                  -> CODE_EXPIRED
 * Anything else succeeds.
 */

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'UNKNOWN'

export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}

export type AuthClient = {
  signInWithEmail(input: { email: string; password: string }): Promise<void>
  /** Always resolves for a well-formed request, even for an existing email (anti-enumeration). */
  signUpWithEmail(input: { name: string; email: string; password: string }): Promise<void>
  verifyEmail(input: { email: string; otp: string }): Promise<void>
  resendVerificationCode(input: { email: string }): Promise<void>
  signInWithGoogle(): Promise<void>
}

const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 600
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS))

export const authClient: AuthClient = {
  async signInWithEmail({ email, password }) {
    await wait()
    if (email === 'error@example.com') throw new AuthError('UNKNOWN')
    if (email.includes('unverified')) throw new AuthError('EMAIL_NOT_VERIFIED')
    if (password === 'wrong-password') throw new AuthError('INVALID_CREDENTIALS')
  },
  async signUpWithEmail({ email }) {
    await wait()
    if (email === 'error@example.com') throw new AuthError('UNKNOWN')
  },
  async verifyEmail({ otp }) {
    await wait()
    if (otp === '000000') throw new AuthError('INVALID_CODE')
    if (otp === '999999') throw new AuthError('CODE_EXPIRED')
  },
  async resendVerificationCode() {
    await wait()
  },
  async signInWithGoogle() {
    await wait()
  },
}
