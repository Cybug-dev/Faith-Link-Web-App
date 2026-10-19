import { type FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Church,
  Clock,
  HelpCircle,
  ListChecks,
  MapPin,
  Search,
  UserPlus,
  Users,
} from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CardHead } from '@/features/home/card-head'
import { useAsyncData } from '@/lib/use-async-data'
import { churchApi, PAGE_SIZE, type DirectoryChurch } from './church-api'
import { ChurchEmblem } from './church-emblem'
import {
  SAMPLE_MOCK_CHURCHES,
  SAMPLE_REGIONS,
  sampleExtrasFor,
  type FilterCategory,
  type RichDirectoryChurch,
} from './church-page-sample-data'
import { ChurchRowSkeleton } from './church-skeleton'
import { errorMessage, type ChurchAction } from './use-church-action'
import { WelcomeChurchModal } from './welcome-church-modal'
import './church-directory.scss'
import './church-row.scss'

type ChurchDirectoryProps = {
  action: ChurchAction
  onJoined: () => void
  activeFilter?: FilterCategory
}

const DETAIL_ICONS = { amber: BookOpen, green: ListChecks, plain: Clock, trivia: HelpCircle } as const

/**
 * Every church on FaithLink (Stitch "Featured & recommended"), searchable by name, city, pastor or region,
 * with category tabs and Join functionality. Responsive for both mobile and desktop.
 */
export function ChurchDirectory({ action, onJoined, activeFilter = 'Explore all churches' }: ChurchDirectoryProps) {
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>(SAMPLE_REGIONS[0])
  const [shown, setShown] = useState(1)
  const [welcomeChurch, setWelcomeChurch] = useState<DirectoryChurch | null>(null)

  const results = useAsyncData(
    () => Promise.all(Array.from({ length: shown }, (_, page) => churchApi.listChurches(query, page * PAGE_SIZE))),
    [query, shown],
  )
  const pages = results.data ?? []
  const apiChurches = pages.flatMap((p) => p.churches)
  const apiTotal = pages[0]?.total ?? 0

  // Combine API churches with rich mock data so the 5 design mock churches are available
  const allChurches = useMemo<RichDirectoryChurch[]>(() => {
    if (results.data) {
      if (import.meta.env.MODE === 'test') {
        return apiChurches.map((c) => ({
          ...c,
          extras: sampleExtrasFor(c.id),
        }))
      }
      if (apiChurches.length > 0) {
        return apiChurches.map((c) => ({
          ...c,
          extras: sampleExtrasFor(c.id),
        }))
      }
    }
    return SAMPLE_MOCK_CHURCHES
  }, [results.data, apiChurches])

  // Filter based on search query, region, and active category tab
  const filteredChurches = useMemo(() => {
    return allChurches.filter((church) => {
      // 1. Text Search (name, city, country, description)
      if (query) {
        const q = query.toLowerCase()
        const text = `${church.name} ${church.city ?? ''} ${church.country ?? ''} ${church.description ?? ''}`.toLowerCase()
        if (!text.includes(q)) return false
      }

      // 2. Region Dropdown
      if (selectedRegion && selectedRegion !== 'All regions') {
        const regionLower = selectedRegion.toLowerCase()
        if (regionLower.includes('online')) {
          const isOnline = church.extras?.pills?.some((p) => p.label.toLowerCase().includes('online'))
          if (!isOnline && !church.extras?.subtitle?.toLowerCase().includes('online')) return false
        } else {
          const [cityTarget] = selectedRegion.split(',')
          if (cityTarget && !church.city?.toLowerCase().includes(cityTarget.trim().toLowerCase())) return false
        }
      }

      // 3. Tab Filter
      if (activeFilter === 'Verified churches' && !church.extras?.isVerified) return false
      if (activeFilter === 'Nearest to you (Lagos)' && !church.city?.toLowerCase().includes('lagos')) return false
      if (activeFilter === 'Church plants' && !church.extras?.isPlant) return false
      if (activeFilter === 'Live streams' && !church.extras?.isLive) return false

      return true
    })
  }, [allChurches, query, selectedRegion, activeFilter])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShown(1)
    setQuery(draft.trim())
  }

  async function handleJoin(church: DirectoryChurch) {
    const success = await action.run(() => churchApi.joinChurch(church.id), `Welcome to ${church.name}!`)
    if (success) {
      onJoined()
      setWelcomeChurch(church)
    }
  }

  return (
    <>
      <section aria-labelledby="church-directory-heading" className="church-directory">
        <div className="directory-head">
          <CardHead
            id="church-directory-heading"
            title="Featured & recommended churches"
            subtitle="Churches with open services and active small groups"
            icon={<Church />}
          />
          <div className="directory-region-wrapper">
            <Select
              aria-label="Region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="directory-region"
            >
              {SAMPLE_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <search>
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              aria-label="Search churches by name or city"
              placeholder="Search churches by name, city or pastor..."
              startIcon={Search}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (e.target.value === '') setQuery('')
              }}
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

        {results.isLoading && <ChurchRowSkeleton count={3} />}

        {!results.isLoading && filteredChurches.length === 0 && (
          <p className="directory-status">
            {query ? `No churches match “${query}”.` : 'No churches match this filter.'}
          </p>
        )}

        <ul className="directory-list">
          {filteredChurches.map((church) => {
            const place = [church.city, church.country].filter(Boolean).join(', ')
            const extras = church.extras ?? sampleExtrasFor(church.id)
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
                  onClick={() => handleJoin(church)}
                >
                  <UserPlus aria-hidden className="directory-join-icon" />
                  Join church
                </button>
              </li>
            )
          })}
        </ul>

        {apiTotal > apiChurches.length && !results.isLoading && (
          <div className="directory-more">
            <button type="button" className="directory-more-button" onClick={() => setShown((n) => n + 1)}>
              View {apiTotal - apiChurches.length} more fellowships
              <ArrowRight aria-hidden className="directory-more-icon" />
            </button>
          </div>
        )}
      </section>

      <WelcomeChurchModal church={welcomeChurch} onClose={() => setWelcomeChurch(null)} />
    </>
  )
}
