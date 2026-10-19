import { ArrowRight, BadgeCheck, Church, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ChurchEmblem } from './church-emblem'
import type { DirectoryChurch } from './church-api'
import './welcome-church-modal.scss'

type WelcomeChurchModalProps = {
  church: DirectoryChurch | null
  onClose: () => void
}

/**
 * Premium Welcome modal displayed when a user successfully joins a church fellowship.
 * Responsive on both mobile and desktop with ambient glow, church details, and portal link.
 */
export function WelcomeChurchModal({ church, onClose }: WelcomeChurchModalProps) {
  if (!church) return null

  const location = [church.city, church.country].filter(Boolean).join(', ')

  return (
    <Modal open={Boolean(church)} onClose={onClose} size="md" className="welcome-church-dialog">
      <div className="welcome-church-content">
        <div className="welcome-church-glow-icon">
          <span className="welcome-icon-ring">
            <Sparkles aria-hidden className="welcome-icon-svg" />
          </span>
        </div>

        <h2 className="welcome-church-heading">Welcome to the Fellowship!</h2>
        <p className="welcome-church-subtext">
          You have officially joined <strong className="welcome-church-name">{church.name}</strong>. Your church
          home is ready with sermon studies, prayer groups, and upcoming services.
        </p>

        <div className="welcome-church-card">
          <ChurchEmblem name={church.name} logoUrl={church.logoUrl} />
          <div className="welcome-card-info">
            <div className="welcome-card-title-row">
              <span className="welcome-card-name">{church.name}</span>
              <BadgeCheck aria-label="Verified assembly" className="welcome-card-verified" />
            </div>
            {location && <p className="welcome-card-location">{location}</p>}
            <p className="welcome-card-stats">
              <span className="welcome-card-pill">
                <Church aria-hidden className="welcome-card-icon" />
                Active Assembly
              </span>
              <span className="welcome-card-members">{church.memberCount} members</span>
            </p>
          </div>
        </div>

        <div className="welcome-church-actions">
          <Link to={`/church/${church.id}`} className="welcome-portal-btn" onClick={onClose}>
            Go to church portal
            <ArrowRight aria-hidden className="welcome-btn-icon" />
          </Link>
          <Button variant="ghost" className="welcome-dismiss-btn" onClick={onClose}>
            Continue exploring
          </Button>
        </div>
      </div>
    </Modal>
  )
}
