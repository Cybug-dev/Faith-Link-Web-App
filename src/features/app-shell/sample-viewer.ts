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

export const SAMPLE_VIEWER: Viewer = {
  firstName: 'David',
  fullName: 'David Johnson',
  initials: 'DJ',
  role: 'Member',
  churchName: 'Grace Chapel',
  unreadNotifications: 3,
}
