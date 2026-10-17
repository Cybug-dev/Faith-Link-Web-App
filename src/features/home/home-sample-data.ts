/**
 * SAMPLE DATA for the UI build only: the shapes the home screen expects from
 * the backend. Replace with API data (and live updates over the WebSocket)
 * when those endpoints exist. Only counts and real records, never points,
 * levels or ranks (DESIGN.md: the API has no points system).
 */

export type FocusLesson = {
  title: string
  minutes: number
  verse: { text: string; reference: string }
  to: string
  image: { src: string; alt: string }
}

export type WeekDay = { label: string; name: string; isActive: boolean }

export type Streak = {
  days: number
  week: WeekDay[]
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

const FOCUS_PHOTO = '1511632765486-a01980e01a18'

export const FOCUS_IMAGE_SRCSET = [480, 800, 1200].map((w) => `${unsplash(FOCUS_PHOTO, w)} ${w}w`).join(', ')

export const SAMPLE_FOCUS: FocusLesson = {
  title: 'The burning ones',
  minutes: 8,
  verse: {
    text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.',
    reference: 'Matthew 5:14',
  },
  to: '/lessons',
  image: { src: unsplash(FOCUS_PHOTO, 800), alt: 'Four friends with their arms around each other, watching the sunrise' },
}

export const SAMPLE_STREAK: Streak = {
  days: 4,
  week: [
    { label: 'M', name: 'Monday', isActive: true },
    { label: 'T', name: 'Tuesday', isActive: true },
    { label: 'W', name: 'Wednesday', isActive: true },
    { label: 'T', name: 'Thursday', isActive: true },
    { label: 'F', name: 'Friday', isActive: false },
    { label: 'S', name: 'Saturday', isActive: false },
    { label: 'S', name: 'Sunday', isActive: false },
  ],
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
