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
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const SAMPLE_VIEWER: Viewer = {
  firstName: 'David',
  fullName: 'David Johnson',
  initials: 'DJ',
  role: 'Member',
  churchName: 'Grace Chapel',
  unreadNotifications: 3,
}
