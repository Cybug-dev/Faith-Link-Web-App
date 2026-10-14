import { NavLink } from 'react-router'
import { cn } from '@/lib/cn'

const tabs = [
  { to: '/sign-in', label: 'Sign in' },
  { to: '/create-account', label: 'Create account' },
]

/**
 * Switches between the two entry screens. Same place on both, so it never jumps.
 * On switch, the active pill slides to the other tab (view transition names, see global.css).
 */
export function AuthTabs() {
  return (
    <nav
      aria-label="Account"
      className="grid grid-cols-2 gap-1 rounded-full bg-subtle p-1 shadow-raised [view-transition-name:auth-tabs]"
    >
      {tabs.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          viewTransition
          className={({ isActive }) =>
            cn(
              'flex h-11 items-center justify-center rounded-full text-label-lg no-underline transition-colors duration-(--motion-duration-fast)',
              isActive
                ? 'bg-accent text-fg-on-accent shadow-raised [view-transition-name:auth-tab-active]'
                : 'text-fg-secondary hover:text-fg',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
