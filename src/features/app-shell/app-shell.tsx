import { useEffect, useRef } from 'react'
import { Bell, ChevronDown, Plus, Search } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { Logo } from '@/components/brand/logo'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PRIMARY_NAV } from './nav-items'
import { PageTransition } from './page-transition'
import { useViewer } from './use-viewer'
import { Sidebar } from './sidebar'
import './app-shell.scss'

const PROFILE_NAME_MAX_LENGTH = 12

// The pill after the wordmark names where you are (Stitch church board).
const PAGE_PILLS: Record<string, string> = { '/home': 'Home', '/church': 'Community hub', '/lessons': 'Bible lessons' }

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

function pagePill(pathname: string): string | undefined {
  const section = Object.keys(PAGE_PILLS).find((path) => pathname === path || pathname.startsWith(`${path}/`))
  return section && PAGE_PILLS[section]
}

function truncateName(name: string, maxLength: number): string {
  return name.length > maxLength ? `${name.slice(0, maxLength - 1)}…` : name
}

function NotificationsButton({ unread, onClick }: { unread: number; onClick: () => void }) {
  const label = unread > 0 ? `Notifications, ${unread} new` : 'Notifications'
  return (
    <Button variant="surface" size="icon" className="notify-button" aria-label={label} onClick={onClick}>
      <Bell aria-hidden className="notify-icon" />
      {unread > 0 && <span aria-hidden className="notify-dot" />}
    </Button>
  )
}

/**
 * Signed-in layout. Phone and tablet: top bar (logo, bell, avatar), content, bottom navigation.
 * Desktop (>= 1024px): collapsible dark sidebar, top bar with search, content.
 * The shell stays mounted between pages so only the content changes.
 */
export function AppShell() {
  const viewer = useViewer()
  const showComingSoon = useComingSoon()
  const { pathname } = useLocation()
  const pill = pagePill(pathname)
  const searchRef = useRef<HTMLInputElement>(null)

  // Cmd/Ctrl + K jumps to search, as the hint in the field says.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar />

      <header className="topbar">
        <Logo mark="cross" className="topbar-logo" />
        <div className="topbar-brand">
          <span className="topbar-wordmark">
            FaithLink
            <span aria-hidden className="topbar-wordmark-dot" />
          </span>
          {pill && <span className="topbar-pill">{pill}</span>}
        </div>
        <search className="topbar-search">
          {/* Search results come with the backend; until then Enter opens the coming-soon popup. */}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              showComingSoon('Search')
            }}
          >
            <Input
              type="search"
              startIcon={Search}
              placeholder="Search lessons, quizzes and activities"
              aria-label="Search"
              className="topbar-search-input"
              ref={searchRef}
            />
            <kbd aria-hidden className="topbar-kbd">
              {IS_MAC ? '⌘' : 'Ctrl'} K
            </kbd>
          </form>
        </search>
        <div className="topbar-actions">
          <button type="button" className="topbar-invite" onClick={() => showComingSoon('Invites')}>
            <Plus aria-hidden className="topbar-invite-icon" />
            New Invite
          </button>
          <NotificationsButton unread={viewer.unreadNotifications} onClick={() => showComingSoon('Notifications')} />
          <span aria-hidden className="topbar-divider" />
          <button
            type="button"
            className="profile-button"
            aria-label={`${viewer.fullName}, ${viewer.role}, account menu`}
            onClick={() => showComingSoon('Account menu')}
          >
            <span aria-hidden className="avatar">
              {viewer.photoUrl ? <img src={viewer.photoUrl} alt="" className="avatar-photo" /> : viewer.initials}
              <span className="avatar-online" />
            </span>
            <span className="profile-text">
              <span className="profile-name">{truncateName(viewer.firstName, PROFILE_NAME_MAX_LENGTH)}</span>
              <span className="profile-role">{viewer.role}</span>
            </span>
            <ChevronDown aria-hidden className="profile-chevron" />
          </button>
        </div>
      </header>

      <main id="main" className="app-content" tabIndex={-1}>
        <PageTransition />
      </main>

      <nav className="bottom-nav" aria-label="Main">
        <ul className="bottom-nav-list">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink to={item.to} className="bottom-nav-link">
                  <span className="bottom-nav-pill">
                    <Icon aria-hidden className="bottom-nav-icon" />
                  </span>
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
