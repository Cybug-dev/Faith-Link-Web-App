import type { LessonSeries } from './lessons-types'
import './lesson-card.scss'

type LessonCardProps = {
  series: LessonSeries
  onOpen: (series: LessonSeries) => void
}

// Same tile as Trending This Week: photo, title, meta line; plus the series progress.
export function LessonCard({ series, onOpen }: LessonCardProps) {
  const percent = series.lessonCount > 0 ? Math.round((series.lessonsDone / series.lessonCount) * 100) : 0
  const countLabel = `${series.lessonCount} ${series.lessonCount === 1 ? 'lesson' : 'lessons'}`

  return (
    <button
      type="button"
      aria-label={`${series.title}, ${series.subtitle}, ${countLabel}, ${percent}% complete`}
      className="lesson-card"
      onClick={() => onOpen(series)}
    >
      <span className="lesson-photo-frame">
        <img
          src={series.image.src}
          srcSet={series.image.srcSet}
          sizes="(min-width: 64rem) 16rem, (min-width: 37.5rem) 50vw, 40vw"
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="lesson-photo"
        />
      </span>
      <span className="lesson-title">{series.title}</span>
      <span className="lesson-meta">
        {series.subtitle}
        <span aria-hidden className="lesson-dot" />
        {countLabel}
      </span>
      <span className="lesson-progress">
        <span className="lesson-track">
          <span className="lesson-fill" style={{ width: `${percent}%` }} />
        </span>
        <span className="lesson-percent">{percent}%</span>
      </span>
    </button>
  )
}
