import { type FormEvent, useState } from 'react'
import { Search } from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HomeSection } from '@/features/home/home-section'
import { useAsyncData } from '@/lib/use-async-data'
import { churchApi, PAGE_SIZE } from './church-api'
import { errorMessage, type ChurchAction } from './use-church-action'
import './church-directory.scss'

type ChurchDirectoryProps = { action: ChurchAction; onJoined: () => void }

/** Every church on FaithLink, searchable by name or city, each with a Join button. */
export function ChurchDirectory({ action, onJoined }: ChurchDirectoryProps) {
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
    <HomeSection id="church-directory" title="Find your church" className="church-directory">
      <search>
        <form className="directory-search" onSubmit={handleSearch}>
        <Input
          aria-label="Search churches by name or city"
          placeholder="Search by name or city"
          startIcon={Search}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={100}
        />
        <Button type="submit" variant="soft" size="sm">
          Search
        </Button>
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
          return (
            <li key={church.id} className="directory-row">
              <div className="directory-info">
                <span className="directory-name">{church.name}</span>
                <span className="directory-meta">
                  {[place, `${church.memberCount} ${church.memberCount === 1 ? 'member' : 'members'}`].filter(Boolean).join(' · ')}
                </span>
              </div>
              <Button
                variant="solid"
                size="xs"
                disabled={action.isPending}
                aria-label={`Join ${church.name}`}
                onClick={() => join(church.id, church.name)}
              >
                Join
              </Button>
            </li>
          )
        })}
      </ul>
      {churches.length < total && !results.isLoading && (
        <Button variant="soft" size="sm" onClick={() => setShown((n) => n + 1)}>
          Show more churches
        </Button>
      )}
    </HomeSection>
  )
}
