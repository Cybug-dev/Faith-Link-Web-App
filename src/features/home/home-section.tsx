import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import './home-section.scss'

type HomeSectionProps = {
  id: string
  title: string
  /** Optional link on the right of the heading, e.g. "See all". */
  action?: { label: string; to: string; accessibleLabel: string }
  className?: string
  children: ReactNode
}

/** Heading row + content shared by every home section, so they all line up the same way. */
export function HomeSection({ id, title, action, className, children }: HomeSectionProps) {
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
      </div>
      {children}
    </section>
  )
}
