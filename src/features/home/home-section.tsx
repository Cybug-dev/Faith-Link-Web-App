import type { ReactNode } from 'react'
import { SectionLink, type SectionLinkProps } from './section-link'
import './home-section.scss'

type HomeSectionProps = {
  id: string
  title: string
  /** The shared "See All →" link on the right of the heading. */
  link?: SectionLinkProps
  className?: string
  children: ReactNode
}

/** A heading that sits above loose content (not inside a card), e.g. the quick action tiles. */
export function HomeSection({ id, title, link, className, children }: HomeSectionProps) {
  const headingId = `${id}-heading`
  return (
    <section aria-labelledby={headingId} className={className ? `home-section ${className}` : 'home-section'}>
      <div className="section-head">
        <h2 id={headingId} className="section-title">
          {title}
        </h2>
        {link && <SectionLink {...link} />}
      </div>
      {children}
    </section>
  )
}
