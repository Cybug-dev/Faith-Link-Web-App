/**
 * SAMPLE DATA for the UI build only: the shapes the home screen expects from
 * the backend. Replace with API data (and live updates over the WebSocket)
 * when those endpoints exist.
 */

export type FocusLesson = {
  title: string
  verse: { text: string; reference: string }
  to: string
  image: { src: string; alt: string }
}

/** The stats panel on the focus banner (owner kept points and levels as designed, 2026-10-17). */
export type WelcomeStats = {
  message: string
  streakDays: number
  points: number
  level: number
  levelName: string
  verse: { text: string; reference: string }
  image: { src: string; alt: string }
}

export type ActivityItem = {
  id: string
  title: string
  month: string
  day: string
  /** Time range, e.g. "7:00 PM – 8:30 PM". */
  when: string
  place: string
  /** Small label next to the title ("Tomorrow", "Weekly", "Online"). */
  status: { label: string; tone: 'amber' | 'green' | 'blue' }
  /** "join" for events you can still join, "view" for ones you only look at. */
  action: 'join' | 'view'
}

export type ProgressStat = { label: string; value: string; tone: 'blue' | 'green' | 'amber' | 'purple' }

/** Overall share of weekly spiritual goals done, 0 to 100. */
export type ProgressOverview = { percent: number; to: string }

export type RecentItem = {
  id: string
  kind: 'lesson' | 'achievement' | 'activity'
  text: string
  subject: string
  when: string
}

/** The most recently earned achievements. */
export type Achievement = { id: string; name: string; kind: 'quiz' | 'streak' | 'explorer' | 'member' }

/** Unsplash photo, sized by the CDN so phones never download desktop pixels. */
function unsplash(id: string, width: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${width}`
}

const FOCUS_PHOTO = '1508672019048-805c876b67e2'
/** Behind the welcome panel when it stands on its own (decorative). */
const WELCOME_PHOTO = '1519904981063-b0cf448d479e'
export const WELCOME_IMAGE_SRCSET = [480, 800].map((w) => `${unsplash(WELCOME_PHOTO, w)} ${w}w`).join(', ')

export const FOCUS_IMAGE_SRCSET = [640, 1200, 1800].map((w) => `${unsplash(FOCUS_PHOTO, w)} ${w}w`).join(', ')

export const SAMPLE_FOCUS: FocusLesson = {
  title: 'The Burning Ones',
  verse: { text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.', reference: 'Matthew 5:14-16' },
  to: '/lessons',
  image: { src: unsplash(FOCUS_PHOTO, 1200), alt: 'A person sitting alone by a calm mountain lake' },
}

export const SAMPLE_WELCOME: WelcomeStats = {
  message: 'Keep going. You’re making an impact!',
  streakDays: 4,
  points: 1280,
  level: 14,
  levelName: 'Growing Strong',
  verse: { text: 'Be strong and courageous…', reference: 'Joshua 1:9' },
  image: { src: unsplash(WELCOME_PHOTO, 800), alt: '' },
}

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', title: 'Youth Fellowship', month: 'Oct', day: '18', when: '7:00 PM – 8:30 PM', place: 'DCC, Iyana Ipaja', status: { label: 'Tomorrow', tone: 'amber' }, action: 'join' },
  { id: 'a2', title: 'Sunday Bible Challenge', month: 'Oct', day: '20', when: '9:00 AM – 10:15 AM', place: 'Teens Church Hall', status: { label: 'Weekly', tone: 'green' }, action: 'join' },
  { id: 'a3', title: 'Inter-Church Quiz (Practice)', month: 'Oct', day: '26', when: '6:30 PM – 7:45 PM', place: 'Zoom Live Stream', status: { label: 'Online', tone: 'blue' }, action: 'view' },
]

export const SAMPLE_OVERVIEW: ProgressOverview = { percent: 72, to: '/progress' }

export const SAMPLE_STATS: ProgressStat[] = [
  { label: 'Lessons Completed', value: '27', tone: 'blue' },
  { label: 'Quiz Questions', value: '183', tone: 'green' },
  { label: 'Correct Answers', value: '72%', tone: 'amber' },
  { label: 'Scriptures Memorized', value: '14', tone: 'purple' },
]

export const SAMPLE_RECENT: RecentItem[] = [
  { id: 'r1', kind: 'lesson', text: 'You completed the lesson', subject: 'The life of Joseph', when: '2 hours ago' },
  { id: 'r2', kind: 'achievement', text: 'You earned the achievement', subject: '7-day streak', when: 'Yesterday' },
  { id: 'r3', kind: 'activity', text: 'You joined', subject: 'Sunday Bible challenge', when: '2 days ago' },
]

/** A lesson series people in the church are reading this week. */
export type TrendingItem = {
  id: string
  title: string
  kind: string
  lessons: number
  /** Decorative: the title next to it names the series. */
  image: { src: string; srcSet: string }
}

function photo(id: string): TrendingItem['image'] {
  return { src: unsplash(id, 480), srcSet: [320, 480].map((w) => `${unsplash(id, w)} ${w}w`).join(', ') }
}

export const SAMPLE_TRENDING: TrendingItem[] = [
  { id: 't1', title: 'The Brave Choice', kind: 'Bible Study', lessons: 12, image: photo('1501555088652-021faa106b9b') },
  { id: 't2', title: 'Light in the City', kind: 'Devotional', lessons: 8, image: photo('1477959858617-67f85cf4f1df') },
  { id: 't3', title: 'Faith in Daily Life', kind: 'Lessons', lessons: 10, image: photo('1523348837708-15d4a09cfac2') },
]

/** Behind the Join a Group banner (decorative). */
const GROUP_PHOTO = '1511632765486-a01980e01a18'
export const GROUP_IMAGE_SRCSET = [640, 1200].map((w) => `${unsplash(GROUP_PHOTO, w)} ${w}w`).join(', ')
export const GROUP_IMAGE_SRC = unsplash(GROUP_PHOTO, 640)

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  { id: 'b1', name: 'First Quiz', kind: 'quiz' },
  { id: 'b2', name: '7-Day Streak', kind: 'streak' },
  { id: 'b3', name: 'Book Explorer', kind: 'explorer' },
  { id: 'b4', name: 'Active Member', kind: 'member' },
]
