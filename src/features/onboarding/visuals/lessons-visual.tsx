import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/cn'
import { onboardingImages } from '../onboarding-images'
import './lessons-visual.scss'

const { lessons: img } = onboardingImages

/** Sample lessons for the illustration only; real lessons come from the API later. */
const SAMPLE_LESSONS = [
  { title: 'The life of Jesus', count: 12, src: img.lifeOfJesus },
  { title: 'Faith in daily life', count: 8, src: img.faithDaily },
  { title: 'The Bible basics', count: 10, src: img.bibleBasics },
  { title: 'Christian leadership', count: 7, src: img.leadership },
]

const TABS = ['Lessons', 'Devotionals', 'Plans']

/** Step 2: a preview of the Bible learning screen. Decorative: the step's text says what it shows. */
export function LessonsVisual() {
  return (
    <div className="onboarding-lessons" aria-hidden>
      <span className="onboarding-lessons__panel onboarding-lessons__panel--back" />
      <span className="onboarding-lessons__panel onboarding-lessons__panel--front" />
      <div className="onboarding-lessons__card">
        <p className="onboarding-lessons__heading">
          <BookOpen aria-hidden className="onboarding-lessons__heading-icon" />
          Bible learning
        </p>
        <div className="onboarding-lessons__tabs">
          {TABS.map((tab, i) => (
            <span key={tab} className={cn('onboarding-lessons__tab', i === 0 && 'onboarding-lessons__tab--active')}>
              {tab}
            </span>
          ))}
        </div>
        <ul className="onboarding-lessons__list">
          {SAMPLE_LESSONS.map((lesson) => (
            <li key={lesson.title} className="onboarding-lessons__row">
              <img className="onboarding-lessons__thumb" src={lesson.src} alt="" />
              <span>
                <span className="onboarding-lessons__title">{lesson.title}</span>
                <span className="onboarding-lessons__count">{lesson.count} lessons</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <span aria-hidden className="onboarding-lessons__badge">
        <BookOpen />
      </span>
    </div>
  )
}
