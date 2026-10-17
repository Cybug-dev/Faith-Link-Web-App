import { Bell, Search } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Logo } from '@/components/brand/logo'
import { ComingSoonProvider } from '@/components/coming-soon/coming-soon-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PRIMARY_NAV } from './nav-items'
import { SAMPLE_VIEWER } from './sample-viewer'
import { Sidebar } from './sidebar'
import './app-shell.scss'

function NotificationsButton({ unread }: { unread: number }) {
  const label = unread > 0 ? `Notifications, ${unread} new` : 'Notifications'
  return (
    <Button variant="surface" size="icon" className="notify-button" aria-label={label}>
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
  const viewer = SAMPLE_VIEWER
  return (
    <ComingSoonProvider>
      <div className="app-shell">
        <Sidebar />

        <header className="topbar">
          <Logo mark="cross" className="topbar-logo" />
          <search className="topbar-search">
            {/* UI only: search results come with the backend. */}
            <form onSubmit={(event) => event.preventDefault()}>
              <Input
                type="search"
                startIcon={Search}
                placeholder="Search lessons, quizzes and activities"
                aria-label="Search"
              />
            </form>
          </search>
          <div className="topbar-actions">
            <NotificationsButton unread={viewer.unreadNotifications} />
            <button type="button" className="profile-button" aria-label={`Account menu for ${viewer.fullName}`}>
              <span aria-hidden className="avatar">
                {viewer.initials}
              </span>
              <span className="profile-text">
                <span className="profile-name">{viewer.fullName}</span>
                <span className="profile-role">{viewer.role}</span>
              </span>
            </button>
          </div>
        </header>

        <main id="main" className="app-content" tabIndex={-1}>
          <Outlet />
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
    </ComingSoonProvider>
  )
}
