/**
 * SAMPLE DATA for the Church page UI (Stitch "My Church - Ultra Modern Desktop"). The backend has no
 * stats, verified flag, live streams, groups or locations yet; swap these contents when it does.
 */
import type { DirectoryChurch } from './church-api'

export const SAMPLE_CHURCH_STATS = [
  { id: 'churches', label: 'Churches', value: '142 Active', tone: 'live' },
  { id: 'community', label: 'Community', value: '18.4k Members' },
  { id: 'verified', label: 'Verified', value: '99.8%', tone: 'accent' },
] as const

export const SAMPLE_FILTERS = [
  'Explore all churches',
  'Verified churches',
  'Nearest to you (Lagos)',
  'Church plants',
  'Live streams',
] as const

export type FilterCategory = (typeof SAMPLE_FILTERS)[number]

export const SAMPLE_SORT = 'Recommended proximity'

export const SAMPLE_REGIONS = [
  'All regions',
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  'Port Harcourt, Nigeria',
  'London, UK',
  'Online churches',
] as const

/** Extra details a church row can show; every field is optional so real API rows render without them. */
export type ChurchExtras = {
  isVerified?: boolean
  verifiedLabel?: string
  pills?: { label: string; tone: 'live' | 'neutral' | 'active' | 'trivia' }[]
  detail?: { label: string; tone: 'amber' | 'green' | 'plain' }
  subtitle?: string
  isPlant?: boolean
  isLive?: boolean
}

export type RichDirectoryChurch = DirectoryChurch & {
  extras: ChurchExtras
}

/** 5 diverse mock churches matching the Stitch design boards and mobile spec. */
export const SAMPLE_MOCK_CHURCHES: RichDirectoryChurch[] = [
  {
    id: 'church-mock-1',
    name: 'Grace City Fellowship',
    slug: 'grace-city-fellowship',
    description: 'A vibrant community of believers focused on Christ-centered worship and authentic discipleship.',
    logoUrl: null,
    city: 'Lagos',
    country: 'Nigeria',
    memberCount: 480,
    extras: {
      isVerified: true,
      verifiedLabel: 'Verified Assembly',
      pills: [{ label: 'Live Now', tone: 'live' }],
      detail: { label: '4 study groups', tone: 'amber' },
      subtitle: 'Ikeja, Lagos • Hybrid',
      isLive: true,
    },
  },
  {
    id: 'church-mock-2',
    name: 'Prayer Charge International',
    slug: 'prayer-charge-international',
    description: 'An interdenominational prayer gathering committed to spiritual revival and intercession.',
    logoUrl: null,
    city: 'Lagos',
    country: 'Nigeria',
    memberCount: 1200,
    extras: {
      isVerified: true,
      verifiedLabel: 'Verified Fellowship',
      pills: [{ label: 'Interdenominational', tone: 'neutral' }],
      detail: { label: 'Daily 6:00 AM morning vow', tone: 'plain' },
      subtitle: 'Lekki, Lagos • Online & In-Person',
      isLive: false,
    },
  },
  {
    id: 'church-mock-3',
    name: "The King's Assembly Hybrid Hub",
    slug: 'the-kings-assembly',
    description: 'Empowering kingdom leaders and young believers to fulfill divine purpose in their cities.',
    logoUrl: null,
    city: 'Port Harcourt',
    country: 'Nigeria',
    memberCount: 850,
    extras: {
      isVerified: true,
      verifiedLabel: 'Verified Assembly',
      pills: [{ label: 'Trivia Active', tone: 'trivia' }],
      detail: { label: 'Weekly scripture trivia active', tone: 'green' },
      subtitle: 'Port Harcourt & Global Stream • Hybrid',
      isLive: false,
    },
  },
  {
    id: 'church-mock-4',
    name: 'Elevation Worship Center',
    slug: 'elevation-worship-center',
    description: 'Modern gospel fellowship dedicated to raising disciples through faith, praise, and community service.',
    logoUrl: null,
    city: 'Abuja',
    country: 'Nigeria',
    memberCount: 620,
    extras: {
      isVerified: true,
      verifiedLabel: 'Verified Community',
      pills: [{ label: 'Youth & Young Adults', tone: 'neutral' }],
      detail: { label: 'Midweek Bible study on Wednesdays', tone: 'amber' },
      subtitle: 'Maitama, Abuja • Hybrid',
      isPlant: true,
      isLive: false,
    },
  },
  {
    id: 'church-mock-5',
    name: 'Living Waters Global Church',
    slug: 'living-waters-global',
    description: 'A global digital and physical congregation anchored on grace, truth, and missionary outreach.',
    logoUrl: null,
    city: 'London',
    country: 'United Kingdom',
    memberCount: 2450,
    extras: {
      isVerified: true,
      verifiedLabel: 'Verified Assembly',
      pills: [
        { label: 'Global Online', tone: 'live' },
        { label: 'Church Plant', tone: 'neutral' },
      ],
      detail: { label: 'Sunday service at 10:00 AM BST', tone: 'plain' },
      subtitle: 'London & Worldwide • Online & Hybrid',
      isPlant: true,
      isLive: true,
    },
  },
]

const EXTRAS: ChurchExtras[] = [
  { isVerified: true, verifiedLabel: 'Verified Assembly', pills: [{ label: 'Live now', tone: 'live' }], detail: { label: '4 study groups', tone: 'amber' }, subtitle: 'Ikeja, Lagos • Hybrid' },
  { isVerified: true, verifiedLabel: 'Verified Fellowship', pills: [{ label: 'Interdenominational', tone: 'neutral' }], detail: { label: 'Daily 6:00 AM morning vow', tone: 'plain' }, subtitle: 'Lekki, Lagos • Online & In-Person' },
  { isVerified: true, verifiedLabel: 'Verified Assembly', pills: [{ label: 'Trivia Active', tone: 'trivia' }], detail: { label: 'Weekly scripture trivia active', tone: 'green' }, subtitle: 'Port Harcourt • Hybrid' },
  { isVerified: true, verifiedLabel: 'Verified Community', pills: [{ label: 'Youth Chapter', tone: 'neutral' }], detail: { label: 'Midweek Bible study', tone: 'amber' }, subtitle: 'Abuja • Hybrid', isPlant: true },
]

/** Picks sample extras for a church id. */
export function sampleExtrasFor(churchId: string): ChurchExtras {
  const mock = SAMPLE_MOCK_CHURCHES.find((c) => c.id === churchId)
  if (mock) return mock.extras
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
