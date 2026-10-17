import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ChevronRight } from 'lucide-react'
import './home-section.scss'

type HomeSectionProps = {
  id: string
  title: string
  /** Optional link on the right of the heading, e.g. "See all". */
  action?: { label: string; to: string; accessibleLabel: string }
  /** Same look as `action`, but a button, for pages not built yet (e.g. opens the coming-soon popup). */
  onAction?: { label: string; accessibleLabel: string; onClick: () => void }
  className?: string
  children: ReactNode
}

/** Heading row + content shared by every home section, so they all line up the same way. */
export function HomeSection({ id, title, action, onAction, className, children }: HomeSectionProps) {
  const headingId = `${id}-heading`
  return (
    <section aria-labelledby={headingId} className={className ? `home-section ${className}` : 'home-section'}>
      <div className="section-head">
        <h2 id={headingId} className="section-title">
          {title}
        </h2>
        {action && (
          <Link to={action.to} className="section-link" aria-label={action.accessibleLabel}>
            {action.label}
            <ChevronRight aria-hidden className="section-link-icon" />
          </Link>
        )}
        {onAction && (
          <button
            type="button"
            className="section-link"
            aria-label={onAction.accessibleLabel}
            onClick={onAction.onClick}
          >
            {onAction.label}
            <ArrowRight aria-hidden className="section-link-icon" />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}
