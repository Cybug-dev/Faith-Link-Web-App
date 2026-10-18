import { useState } from 'react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/lib/use-document-title'
import { LessonCard } from './lesson-card'
import { ALL_TOPICS, LessonFilters } from './lesson-filters'
import { SAMPLE_LESSON_SERIES } from './lessons-sample-data'
import type { LessonCategory, LessonSeries } from './lessons-types'
import './lessons-page.scss'

function matches(series: LessonSeries, query: string, topic: string, category: LessonCategory | null): boolean {
  const text = `${series.title} ${series.subtitle}`.toLowerCase()
  return (
    text.includes(query.trim().toLowerCase()) &&
    (topic === ALL_TOPICS || series.topic === topic) &&
    (category === null || series.categories.includes(category))
  )
}

// Sample data until the lessons API exists.
export function LessonsPage() {
  useDocumentTitle('Bible Learning')
  const showComingSoon = useComingSoon()
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState(ALL_TOPICS)
  const [category, setCategory] = useState<LessonCategory | null>(null)

  const allSeries = SAMPLE_LESSON_SERIES
  const topics = [...new Set(allSeries.map((series) => series.topic))].sort()
  const shown = allSeries.filter((series) => matches(series, query, topic, category))
  const countMessage =
    shown.length === 0
      ? 'No lessons match your search. Try another word or topic.'
      : `${shown.length} lesson series shown`

  function clearFilters() {
    setQuery('')
    setTopic(ALL_TOPICS)
    setCategory(null)
  }

  return (
    <div className="lessons-page">
      <header>
        <h1 className="lessons-title">Bible Learning</h1>
        <p className="lessons-subtitle">Explore lessons, study plans, and grow in God’s word.</p>
      </header>

      <LessonFilters
        query={query}
        onQueryChange={setQuery}
        topic={topic}
        topics={topics}
        onTopicChange={setTopic}
        category={category}
        onCategoryChange={setCategory}
      />

      {/* Always in the page so screen readers announce each new result count. */}
      <output className="lessons-count">{countMessage}</output>

      {shown.length === 0 ? (
        <div className="lessons-empty">
          <p aria-hidden>{countMessage}</p>
          <Button variant="soft" size="xs" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ul aria-label="Lesson series" className="lessons-grid">
          {shown.map((series) => (
            <li key={series.id}>
              <LessonCard series={series} onOpen={(item) => showComingSoon(item.title)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
