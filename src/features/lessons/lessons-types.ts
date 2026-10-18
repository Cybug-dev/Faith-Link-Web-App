// Shapes the lessons API will fill; components depend on these, not on the sample data.

export const LESSON_CATEGORIES = ['Old Testament', 'New Testament', 'Life Lessons', 'Characters'] as const
export type LessonCategory = (typeof LESSON_CATEGORIES)[number]

export type LessonSeries = {
  id: string
  title: string
  subtitle: string
  lessonCount: number
  /** Lessons the viewer has finished in this series. */
  lessonsDone: number
  categories: readonly LessonCategory[]
  topic: string
  image: { src: string; srcSet: string; alt: string }
}
