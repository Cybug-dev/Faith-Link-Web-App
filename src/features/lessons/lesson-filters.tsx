import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LESSON_CATEGORIES, type LessonCategory } from './lessons-types'
import './lesson-filters.scss'

export const ALL_TOPICS = ''

type LessonFiltersProps = {
  query: string
  onQueryChange: (query: string) => void
  topic: string
  topics: readonly string[]
  onTopicChange: (topic: string) => void
  category: LessonCategory | null
  onCategoryChange: (category: LessonCategory | null) => void
}

export function LessonFilters({
  query,
  onQueryChange,
  topic,
  topics,
  onTopicChange,
  category,
  onCategoryChange,
}: LessonFiltersProps) {
  const chips: { label: string; value: LessonCategory | null }[] = [
    { label: 'All', value: null },
    ...LESSON_CATEGORIES.map((value) => ({ label: value, value })),
  ]

  return (
    <div className="lesson-filters">
      <div className="lesson-filter-row">
        <Input
          type="search"
          aria-label="Search lessons"
          placeholder="Search lessons..."
          startIcon={Search}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <Select isCompactOnPhone aria-label="Topic" value={topic} onChange={(event) => onTopicChange(event.target.value)}>
          <option value={ALL_TOPICS}>All Topics</option>
          {topics.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="lesson-chips">
        <legend className="visually-hidden">Category</legend>
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            aria-pressed={category === chip.value}
            className="lesson-chip"
            onClick={() => onCategoryChange(chip.value)}
          >
            {chip.label}
          </button>
        ))}
      </fieldset>
    </div>
  )
}
