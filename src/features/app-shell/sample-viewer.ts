/**
 * SAMPLE DATA for the UI build only. Replace with the signed-in profile and
 * church from the backend (Neon Auth session + profile API) when it exists.
 */
export type Viewer = {
  firstName: string
  fullName: string
  initials: string
  photoUrl?: string
  role: 'Member' | 'Leader' | 'Pastor' | 'Admin'
  churchName: string
  unreadNotifications: number
}

/**
 * Derives 2-letter initials from a full name.
 * "David Johnson" → "DJ", "Madonna" → "MA".
 */
export function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts.at(0)
  if (!first) return '?'
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()

  const last = parts.at(-1)
  if (!last) return '?'
  return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase()
}

export const SAMPLE_VIEWER: Viewer = {
  firstName: 'David',
  fullName: 'David Johnson',
  initials: 'DJ',
  role: 'Member',
  churchName: 'Grace Chapel',
  unreadNotifications: 3,
}
