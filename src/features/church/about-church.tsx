import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { CardHead } from '@/features/home/card-head'
import { SectionLink } from '@/features/home/section-link'
import type { Church } from './church-types'
import './about-church.scss'

export function AboutChurch({ church }: { church: Church }) {
  const showComingSoon = useComingSoon()
  return (
    <section aria-labelledby="about-church-heading" className="about-church">
      <div className="about-church-text">
        <CardHead id="about-church-heading" title="About Our Church" />
        <p className="about-church-body">{church.about}</p>
        <SectionLink
          label="Read More"
          accessibleLabel="Read more about our church"
          onClick={() => showComingSoon('Church profile')}
        />
      </div>
      <figure className="about-church-verse">
        <blockquote className="about-church-verse-text">“{church.aboutVerse.text}”</blockquote>
        <figcaption className="about-church-verse-ref">{church.aboutVerse.reference}</figcaption>
      </figure>
    </section>
  )
}
