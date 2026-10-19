/**
 * SAMPLE DATA for the Church page UI (Stitch "My Church - Ultra Modern Desktop"). The backend has no
 * stats, verified flag, live streams, groups or locations yet; swap these contents when it does.
 */

export const SAMPLE_CHURCH_STATS = [
  { id: 'churches', label: 'Churches', value: '142 Active', tone: 'live' },
  { id: 'community', label: 'Community', value: '18.4k Members' },
  { id: 'verified', label: 'Verified', value: '99.8%', tone: 'accent' },
] as const

export const SAMPLE_FILTERS = ['Explore all churches', 'Verified churches', 'Nearest to you (Lagos)', 'Church plants', 'Live streams'] as const

export const SAMPLE_SORT = 'Recommended proximity'

export const SAMPLE_REGIONS = ['Lagos, Nigeria', 'Abuja, Nigeria', 'London, UK', 'Online churches'] as const

/** Extra details a church row can show; every field is optional so real API rows render without them. */
export type ChurchExtras = {
  isVerified?: boolean
  pills?: { label: string; tone: 'live' | 'neutral' }[]
  detail?: { label: string; tone: 'amber' | 'green' | 'plain' }
}

const EXTRAS: ChurchExtras[] = [
  { isVerified: true, pills: [{ label: 'Live now', tone: 'live' }], detail: { label: '4 study groups', tone: 'amber' } },
  { isVerified: true, pills: [{ label: 'Interdenominational', tone: 'neutral' }], detail: { label: 'Daily 6:00 AM morning prayer', tone: 'plain' } },
  { isVerified: true, detail: { label: 'Weekly scripture quiz active', tone: 'green' } },
  {},
]

/** Picks the same sample extras for a church every time, from its id. */
export function sampleExtrasFor(churchId: string): ChurchExtras {
  const hash = [...churchId].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return EXTRAS[hash % EXTRAS.length] ?? {}
}

/** The joined church's banner details that the API doesn't return yet. */
export const SAMPLE_ACTIVE_CHURCH = {
  isVerified: true,
  live: 'Live stream in 2h',
  campus: 'Main campus & hybrid',
  cell: 'Assigned cell: Living Waters',
  nextService: 'Next service: Sunday 9:00 AM',
}

/** Countries and their main cities for the create form (owner chose a small built-in list for now). */
export const SAMPLE_LOCATIONS: Record<string, readonly string[]> = {
  Nigeria: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Benin City'],
  Ghana: ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow'],
  'United States': ['New York', 'Houston', 'Atlanta', 'Los Angeles', 'Chicago'],
  Canada: ['Toronto', 'Calgary', 'Vancouver', 'Montreal'],
}
