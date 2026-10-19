import { ArrowRight, BookOpen, ChartLine, CircleHelp, type LucideIcon, ShieldUser, Users, BellRing } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import './admin-suite-card.scss'

type Perk = { title: string; text: string; icon: LucideIcon }

const PERKS: Perk[] = [
  { title: 'Member directory & care', text: 'Safely organise members, cell leaders and prayer requests.', icon: Users },
  { title: 'Custom sermon quizzes', text: 'Publish weekly reviews and scripture challenges.', icon: CircleHelp },
  { title: 'Live service alerts', text: 'Notify members before Sunday service and mid-week prayer.', icon: BellRing },
  { title: 'Leadership analytics & growth', text: 'Track attendance, engagement and small-group health.', icon: ChartLine },
]

/** Stitch "Church admin privileges", renamed "Admin suite" (owner). */
export function AdminSuiteCard() {
  const showComingSoon = useComingSoon()
  return (
    <section aria-labelledby="admin-suite-heading" className="admin-suite">
      <div className="suite-head">
        <div className="suite-head-text">
          <p className="suite-pill">
            <span aria-hidden className="suite-pill-dot" />
            Admin suite
          </p>
          <h2 id="admin-suite-heading" className="suite-title">
            Church admin privileges
          </h2>
          <p className="suite-subtitle">Digital tools for leading your church</p>
        </div>
        <span aria-hidden className="suite-icon">
          <ShieldUser />
        </span>
      </div>

      <ul className="suite-list">
        {PERKS.map(({ title, text, icon: Icon }) => (
          <li key={title} className="suite-perk">
            <span aria-hidden className="suite-perk-icon">
              <Icon />
            </span>
            <span className="suite-perk-text">
              <span className="suite-perk-title">{title}</span>
              <span className="suite-perk-body">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <button type="button" className="suite-playbook" onClick={() => showComingSoon('Admin playbook')}>
        <BookOpen aria-hidden className="suite-playbook-icon" />
        <span className="suite-playbook-text">
          <span className="suite-playbook-eyebrow">Need onboarding?</span>
          <span className="suite-playbook-title">Read the admin playbook</span>
        </span>
        <span aria-hidden className="suite-playbook-arrow">
          <ArrowRight />
        </span>
      </button>
    </section>
  )
}
