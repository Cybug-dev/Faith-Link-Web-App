/**
 * SAMPLE DATA for the UI build only: the shapes the home screen expects from
 * the backend. Replace with API data (and live updates over the WebSocket)
 * when those endpoints exist.
 */

export type FocusLesson = {
  title: string
  reference: string
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
}

export type ActivityItem = {
  id: string
  title: string
  month: string
  day: string
  when: string
  place: string
  isJoined: boolean
}

export type SeriesProgress = {
  series: string
  lessonsDone: number
  lessonsTotal: number
  to: string
}

export type ProgressStat = { label: string; value: string }

export type RecentItem = {
  id: string
  kind: 'lesson' | 'achievement' | 'activity'
  text: string
  subject: string
  when: string
}

/** The most recently earned achievements. */
export type Achievement = { id: string; name: string }

/** Unsplash photo, sized by the CDN so phones never download desktop pixels. */
function unsplash(id: string, width: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${width}`
}

const FOCUS_PHOTO = '1508672019048-805c876b67e2'

export const FOCUS_IMAGE_SRCSET = [640, 1200, 1800].map((w) => `${unsplash(FOCUS_PHOTO, w)} ${w}w`).join(', ')

export const SAMPLE_FOCUS: FocusLesson = {
  title: 'The Burning Ones',
  reference: 'Matthew 5:14-16',
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
}

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', title: 'Youth fellowship', month: 'Oct', day: '18', when: 'Fri, 7:00 PM', place: 'Main hall', isJoined: false },
  { id: 'a2', title: 'Sunday Bible challenge', month: 'Oct', day: '20', when: 'Sun, 9:00 AM', place: 'Teens church hall', isJoined: true },
  { id: 'a3', title: 'Inter-church quiz practice', month: 'Oct', day: '26', when: 'Sat, 6:30 PM', place: 'Online', isJoined: false },
]

export const SAMPLE_SERIES: SeriesProgress = {
  series: 'Life of Christ',
  lessonsDone: 4,
  lessonsTotal: 7,
  to: '/lessons',
}

export const SAMPLE_STATS: ProgressStat[] = [
  { label: 'Lessons completed', value: '27' },
  { label: 'Quizzes completed', value: '12' },
  { label: 'Correct answers', value: '72%' },
  { label: 'Achievements', value: '5' },
]

export const SAMPLE_RECENT: RecentItem[] = [
  { id: 'r1', kind: 'lesson', text: 'You completed the lesson', subject: 'The life of Joseph', when: '2 hours ago' },
  { id: 'r2', kind: 'achievement', text: 'You earned the achievement', subject: '7-day streak', when: 'Yesterday' },
  { id: 'r3', kind: 'activity', text: 'You joined', subject: 'Sunday Bible challenge', when: '2 days ago' },
]

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  { id: 'b1', name: 'First quiz' },
  { id: 'b2', name: '7-day streak' },
  { id: 'b3', name: 'Book explorer' },
  { id: 'b4', name: 'Active member' },
]
