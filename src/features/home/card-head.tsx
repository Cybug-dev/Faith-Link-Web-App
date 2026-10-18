import type { ReactNode } from 'react'
import { SectionLink, type SectionLinkProps } from './section-link'
import './card-head.scss'

type CardHeadProps = {
  id: string
  title: string
  subtitle?: string
  /** Small amber tile with an icon to the left of the title. */
  icon?: ReactNode
  link?: SectionLinkProps
  /** Hairline under the heading, as Upcoming Events. */
  hasDivider?: boolean
}

/** Heading row of every home card: optional icon tile, title, subtitle, and the shared "See All →" link. */
export function CardHead({ id, title, subtitle, icon, link, hasDivider = false }: CardHeadProps) {
  return (
    <div className={hasDivider ? 'card-head card-head-divided' : 'card-head'}>
      {icon && (
        <span aria-hidden className="card-head-icon">
          {icon}
        </span>
      )}
      <div className="card-head-text">
        <h2 id={id} className="card-head-title">
          {title}
        </h2>
        {subtitle && <p className="card-head-subtitle">{subtitle}</p>}
      </div>
      {link && <SectionLink {...link} />}
    </div>
  )
}
