import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import './section-link.scss'

export type SectionLinkProps =
  | { label: string; accessibleLabel: string; to: string; onClick?: never }
  /** For pages not built yet (e.g. opens the coming-soon popup). */
  | { label: string; accessibleLabel: string; onClick: () => void; to?: never }

/** The one "See All →" link used on every card and section: accent text and an arrow icon. */
export function SectionLink({ label, accessibleLabel, to, onClick }: SectionLinkProps) {
  const content = (
    <>
      {label}
      <ArrowRight aria-hidden className="section-link-icon" />
    </>
  )
  if (to !== undefined) {
    return (
      <Link to={to} className="section-link" aria-label={accessibleLabel}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" className="section-link" aria-label={accessibleLabel} onClick={onClick}>
      {content}
    </button>
  )
}
