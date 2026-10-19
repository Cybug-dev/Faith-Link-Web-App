import '@fontsource-variable/caveat'
import { EllipsisVertical, Settings } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import type { Church } from './church-types'
import './church-header.scss'

export type ChurchTab = 'overview' | 'members'

const TABS: readonly { label: string; tab?: ChurchTab }[] = [
  { label: 'Overview', tab: 'overview' },
  { label: 'Members', tab: 'members' },
  { label: 'Announcements' },
  { label: 'Events' },
  { label: 'Resources' },
]

type ChurchHeaderProps = {
  church: Church
  activeTab: ChurchTab
  onTabChange: (tab: ChurchTab) => void
  /** Shown only to people allowed to edit the church. */
  onOpenSettings?: () => void
  onOpenMore: () => void
}

export function ChurchHeader({ church, activeTab, onTabChange, onOpenSettings, onOpenMore }: ChurchHeaderProps) {
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
          {onOpenSettings && (
            <Button variant="soft" size="xs" onClick={onOpenSettings}>
              <Settings aria-hidden className="church-action-icon" />
              Church Settings
            </Button>
          )}
          <Button variant="soft" size="xs" aria-label="More church options" onClick={onOpenMore}>
            <EllipsisVertical aria-hidden className="church-action-icon" />
          </Button>
        </div>
      </div>

      <nav aria-label="Church sections" className="church-tabs">
        <ul className="church-tab-list">
          {TABS.map(({ label, tab }) => (
            <li key={label}>
              {tab === activeTab ? (
                <span aria-current="page" className="church-tab church-tab-current">
                  {label}
                </span>
              ) : (
                <button
                  type="button"
                  className="church-tab"
                  onClick={() => (tab ? onTabChange(tab) : showComingSoon(`Church ${label.toLowerCase()}`))}
                >
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
