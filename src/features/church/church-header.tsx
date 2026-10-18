import '@fontsource-variable/caveat'
import { EllipsisVertical, Settings } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import type { Church } from './church-types'
import './church-header.scss'

const TABS = [
  { label: 'Overview', isBuilt: true },
  { label: 'Members', isBuilt: false },
  { label: 'Announcements', isBuilt: false },
  { label: 'Events', isBuilt: false },
  { label: 'Resources', isBuilt: false },
] as const

export function ChurchHeader({ church }: { church: Church }) {
  const showComingSoon = useComingSoon()
  return (
    <header className="church-header">
      <div className="church-cover">
        <img
          src={church.cover.src}
          srcSet={church.cover.srcSet}
          sizes="(min-width: 64rem) 70vw, 100vw"
          alt={church.cover.alt}
          width={1200}
          height={400}
          fetchPriority="high"
          className="church-cover-photo"
        />
        <figure className="church-cover-verse">
          <blockquote className="church-cover-verse-text">“{church.coverVerse.text}”</blockquote>
          <figcaption className="church-cover-verse-ref">{church.coverVerse.reference}</figcaption>
        </figure>
      </div>

      <div className="church-title-row">
        <div className="church-title-text">
          <h1 className="church-name">{church.name}</h1>
          <p className="church-tagline">{church.tagline}</p>
        </div>
        <div className="church-actions">
          <Button variant="soft" size="xs" onClick={() => showComingSoon('Church settings')}>
            <Settings aria-hidden className="church-action-icon" />
            Church Settings
          </Button>
          <Button variant="soft" size="xs" aria-label="More church options" onClick={() => showComingSoon('More church options')}>
            <EllipsisVertical aria-hidden className="church-action-icon" />
          </Button>
        </div>
      </div>

      <nav aria-label="Church sections" className="church-tabs">
        <ul className="church-tab-list">
          {TABS.map(({ label, isBuilt }) => (
            <li key={label}>
              {isBuilt ? (
                <span aria-current="page" className="church-tab church-tab-current">
                  {label}
                </span>
              ) : (
                <button type="button" className="church-tab" onClick={() => showComingSoon(`Church ${label.toLowerCase()}`)}>
                  {label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
