import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { HomeSection } from '@/features/home/home-section'
import type { ChurchLeader } from './church-types'
import './church-leaders.scss'

function initials(name: string): string {
  return name
    .split(/s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

type ChurchLeadersProps = { leaders: readonly ChurchLeader[]; onViewAll: () => void }

export function ChurchLeaders({ leaders, onViewAll }: ChurchLeadersProps) {
  const showComingSoon = useComingSoon()
  return (
    <HomeSection
      id="church-leaders"
      title="Church Leaders"
      className="church-leaders"
      link={{ label: 'View All', accessibleLabel: 'View all church members', onClick: onViewAll }}
    >
      {leaders.length === 0 && <p className="leader-empty">No leaders have been named yet.</p>}
      <ul className="leader-list">
        {leaders.map((leader) => (
          <li key={leader.id}>
            <button type="button" className="leader-card" onClick={() => showComingSoon(`${leader.name}’s profile`)}>
              {leader.photo ? (
                <img
                  src={leader.photo}
                  alt=""
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="leader-photo"
                />
              ) : (
                <span aria-hidden className="leader-photo leader-initials">
                  {initials(leader.name)}
                </span>
              )}
              <span className="leader-name">{leader.name}</span>
              <span className="leader-role">{leader.role}</span>
            </button>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
