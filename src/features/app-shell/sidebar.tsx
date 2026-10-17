import { useRef, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink } from 'react-router'
import { CrossMark } from '@/components/brand/logo'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { SIDEBAR_NAV, type NavItem } from './nav-items'
import { SidebarArt } from './sidebar-art'
import './sidebar.scss'

function SidebarItem({ item }: { item: NavItem }) {
  const showComingSoon = useComingSoon()
  const Icon = item.icon
  // data-label feeds the CSS tooltip shown on hover and keyboard focus while collapsed.
  const content = (
    <>
      <Icon aria-hidden className="sidebar-icon" />
      <span className="sidebar-text">
        <span className="sidebar-label">{item.label}</span>
        {item.isSoon && <span className="sidebar-soon">Soon</span>}
      </span>
    </>
  )

  return (
    <li>
      {item.isSoon ? (
        <button
          type="button"
          className="sidebar-link"
          data-label={item.label}
          onClick={() => showComingSoon(item.label)}
        >
          {content}
        </button>
      ) : (
        <NavLink to={item.to} className="sidebar-link" data-label={item.label}>
          {content}
        </NavLink>
      )}
    </li>
  )
}

/**
 * Desktop sidebar (hidden on phones and tablets). Starts collapsed to icons.
 * Opens from the logo button (shows an "open" icon on hover) or a click on
 * any empty part of the sidebar; closes from the button at the top.
 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const logoButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  function handleEmptySpaceClick(event: MouseEvent<HTMLElement>) {
    if (isOpen) return
    if (event.target instanceof Element && event.target.closest('a, button')) return
    setIsOpen(true)
  }

  // The logo button hides itself once open, so focus moves to the close button.
  function openFromButton() {
    flushSync(() => setIsOpen(true))
    closeButtonRef.current?.focus()
  }

  // The close button disappears, so focus returns to the logo button.
  function close() {
    flushSync(() => setIsOpen(false))
    logoButtonRef.current?.focus()
  }

  return (
    // The empty-space click is a mouse convenience; the logo button opens it for keyboard and screen-reader users.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <aside className="sidebar" data-open={isOpen} aria-label="Sidebar" onClick={handleEmptySpaceClick}>
      <div className="sidebar-head">
        <button
          ref={logoButtonRef}
          type="button"
          className="sidebar-logo"
          aria-label="Open sidebar"
          aria-expanded={isOpen}
          // Open, the close button takes over; a mouse click on the logo still closes it.
          aria-hidden={isOpen || undefined}
          tabIndex={isOpen ? -1 : undefined}
          onClick={isOpen ? close : openFromButton}
        >
          <CrossMark className="sidebar-logo-mark" />
          <PanelLeftOpen aria-hidden className="sidebar-logo-open" />
        </button>
        <span aria-hidden className="sidebar-wordmark">
          FaithLink
        </span>
        {isOpen && (
          <button
            ref={closeButtonRef}
            type="button"
            className="sidebar-close"
            aria-label="Close sidebar"
            aria-expanded
            onClick={close}
          >
            <PanelLeftClose aria-hidden />
          </button>
        )}
      </div>

      <nav aria-label="Main">
        <ul className="sidebar-list">
          {SIDEBAR_NAV.map((item) => (
            <SidebarItem key={item.to} item={item} />
          ))}
        </ul>
      </nav>

      <div className="sidebar-foot">
        <SidebarArt className="sidebar-art" />
        <p className="sidebar-tagline">Faith, Community, Impact</p>
      </div>
    </aside>
  )
}
