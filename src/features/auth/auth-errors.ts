/** UI-level auth failures. Kept apart from the SDK client so tests can import it without Neon. */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'RATE_LIMITED'
  | 'UNKNOWN'

export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}
