import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gamepad2,
  House,
  type LucideIcon,
  MessageSquare,
  Settings,
  SquareCheckBig,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  /** Not built yet: shows a "Soon" tag and opens the coming-soon popup instead of navigating. */
  isSoon?: boolean
}

/** Phone bottom bar: five places (DESIGN.md). Owner is still planning how it lines up with the sidebar. */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', to: '/home', icon: House },
  { label: 'Lessons', to: '/lessons', icon: BookOpen },
  { label: 'Quizzes', to: '/quizzes', icon: SquareCheckBig },
  { label: 'Activities', to: '/activities', icon: CalendarDays },
  { label: 'Progress', to: '/progress', icon: TrendingUp },
]

/** Desktop sidebar, in the order of the owner's Stitch desktop board. */
export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Home', to: '/home', icon: House },
  { label: 'Bible Lessons', to: '/lessons', icon: BookOpen, isSoon: true },
  { label: 'Quizzes', to: '/quizzes', icon: ClipboardList, isSoon: true },
  { label: 'Live Games', to: '/live-games', icon: Gamepad2, isSoon: true },
  { label: 'Groups', to: '/groups', icon: Users, isSoon: true },
  { label: 'Events', to: '/events', icon: CalendarDays, isSoon: true },
  { label: 'Leaderboard', to: '/leaderboard', icon: Trophy, isSoon: true },
  { label: 'Messages', to: '/messages', icon: MessageSquare, isSoon: true },
  { label: 'Settings', to: '/settings', icon: Settings, isSoon: true },
]
