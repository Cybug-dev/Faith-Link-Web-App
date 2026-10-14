/**
 * The address awaiting verification, kept in sessionStorage so a refresh of
 * /verify-email doesn't strand the user. Storage can throw (private windows,
 * blocked site data), so every access is guarded and the app works without it.
 */
const KEY = 'faithlink.pendingEmail'

export function setPendingEmail(email: string): void {
  try {
    sessionStorage.setItem(KEY, email)
  } catch {
    /* storage unavailable: the verify screen falls back to the sign-up route */
  }
}

export function getPendingEmail(): string | null {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function clearPendingEmail(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* nothing to clear */
  }
}

/** "alex@gmail.com" -> "a***@gmail.com" */
export function maskEmail(email: string): string {
  const at = email.indexOf('@')
  if (at < 1) return email
  return `${email[0]}***${email.slice(at)}`
}
