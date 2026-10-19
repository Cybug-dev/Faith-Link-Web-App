import { type FormEvent, useState } from 'react'
import { ArrowRight, BadgeCheck, BookOpen, Church, Clock, ListChecks, MapPin, Search, UserPlus, Users } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CardHead } from '@/features/home/card-head'
import { useAsyncData } from '@/lib/use-async-data'
import { churchApi, PAGE_SIZE } from './church-api'
import { ChurchEmblem } from './church-emblem'
import { SAMPLE_REGIONS, sampleExtrasFor } from './church-page-sample-data'
import { errorMessage, type ChurchAction } from './use-church-action'
import './church-directory.scss'
import './church-row.scss'

type ChurchDirectoryProps = { action: ChurchAction; onJoined: () => void }

const DETAIL_ICONS = { amber: BookOpen, green: ListChecks, plain: Clock } as const

/** Every church on FaithLink (Stitch "Featured & recommended"), searchable by name or city, each with Join. */
export function ChurchDirectory({ action, onJoined }: ChurchDirectoryProps) {
  const showComingSoon = useComingSoon()
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(1)
  const results = useAsyncData(
    () => Promise.all(Array.from({ length: shown }, (_, page) => churchApi.listChurches(query, page * PAGE_SIZE))),
    [query, shown],
  )
  const pages = results.data ?? []
  const churches = pages.flatMap((p) => p.churches)
  const total = pages[0]?.total ?? 0

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShown(1)
    setQuery(draft.trim())
  }

  async function join(id: string, name: string) {
    if (await action.run(() => churchApi.joinChurch(id), `Welcome to ${name}!`)) onJoined()
  }

  return (
    <section aria-labelledby="church-directory-heading" className="church-directory">
      <div className="directory-head">
        <CardHead
          id="church-directory-heading"
          title="Featured & recommended churches"
          subtitle="Churches with open services and active small groups"
          icon={<Church />}
        />
        <Select
          aria-label="Region"
          defaultValue={SAMPLE_REGIONS[0]}
          onChange={() => showComingSoon('Churches by region')}
          className="directory-region"
        >
          {SAMPLE_REGIONS.map((region) => (
            <option key={region}>{region}</option>
          ))}
        </Select>
      </div>

      <search>
        <form onSubmit={handleSearch}>
          <Input
            type="search"
            aria-label="Search churches by name or city"
            placeholder="Search churches by name, city or pastor"
            startIcon={Search}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={100}
            className="directory-search"
          />
        </form>
      </search>

      {results.error !== undefined && !results.data && (
        <Alert variant="danger" title="Couldn’t load churches">
          {errorMessage(results.error)}{' '}
          <Button variant="ghost" size="xs" onClick={results.reload}>
            Try again
          </Button>
        </Alert>
      )}
      {results.isLoading && <output className="directory-status">Loading churches…</output>}
      {results.data && churches.length === 0 && (
        <p className="directory-status">{query ? `No churches match “${query}”.` : 'No churches yet. Be the first to create one.'}</p>
      )}

      <ul className="directory-list">
        {churches.map((church) => {
          const place = [church.city, church.country].filter(Boolean).join(', ')
          const extras = sampleExtrasFor(church.id)
          const DetailIcon = extras.detail && DETAIL_ICONS[extras.detail.tone]
          return (
            <li key={church.id} className="directory-item church-row">
              <ChurchEmblem name={church.name} logoUrl={church.logoUrl} />
              <div className="row-body">
                <h3 className="row-name">
                  <span className="row-name-text">{church.name}</span>
                  {extras.isVerified && <BadgeCheck aria-label="Verified church" className="row-verified" />}
                </h3>
                <p className="row-pills">
                  {extras.pills?.map((pill) => (
                    <span key={pill.label} className={`row-pill row-pill-${pill.tone}`}>
                      {pill.tone === 'live' && <span aria-hidden className="row-pill-dot" />}
                      {pill.label}
                    </span>
                  ))}
                </p>
                <p className="row-meta">
                  {place && (
                    <span className="row-meta-item row-meta-place" title={place}>
                      <MapPin aria-hidden className="row-meta-icon" />
                      <span className="row-meta-text">{place}</span>
                    </span>
                  )}
                  <span className="row-meta-item">
                    <Users aria-hidden className="row-meta-icon" />
                    {`${church.memberCount} ${church.memberCount === 1 ? 'member' : 'members'}`}
                  </span>
                  {extras.detail && DetailIcon && (
                    <span className={`row-meta-item row-meta-${extras.detail.tone}`}>
                      <DetailIcon aria-hidden className="row-meta-icon" />
                      {extras.detail.label}
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                className="directory-join"
                disabled={action.isPending}
                aria-label={`Join ${church.name}`}
                onClick={() => join(church.id, church.name)}
              >
                <UserPlus aria-hidden className="directory-join-icon" />
                Join church
              </button>
            </li>
          )
        })}
      </ul>

      {churches.length < total && !results.isLoading && (
        <div className="directory-more">
          <button type="button" className="directory-more-button" onClick={() => setShown((n) => n + 1)}>
            View {total - churches.length} more churches
            <ArrowRight aria-hidden className="directory-more-icon" />
          </button>
        </div>
      )}
    </section>
  )
}
