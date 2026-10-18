import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { HomeSection } from '@/features/home/home-section'
import type { ChurchLeader } from './church-types'
import './church-leaders.scss'

export function ChurchLeaders({ leaders }: { leaders: readonly ChurchLeader[] }) {
  const showComingSoon = useComingSoon()
  return (
    <HomeSection
      id="church-leaders"
      title="Church Leaders"
      className="church-leaders"
      link={{ label: 'View All', accessibleLabel: 'View all church leaders', onClick: () => showComingSoon('Church leaders') }}
    >
      <ul className="leader-list">
        {leaders.map((leader) => (
          <li key={leader.id}>
            <button type="button" className="leader-card" onClick={() => showComingSoon(`${leader.name}’s profile`)}>
              <img
                src={leader.photo}
                alt=""
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
                className="leader-photo"
              />
              <span className="leader-name">{leader.name}</span>
              <span className="leader-role">{leader.role}</span>
            </button>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
