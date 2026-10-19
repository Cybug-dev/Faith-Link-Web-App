import { ArrowRight, BadgeCheck, CalendarDays, IdCard, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import type { MyMembership } from './church-api'
import { ChurchEmblem } from './church-emblem'
import { SAMPLE_ACTIVE_CHURCH } from './church-page-sample-data'
import './active-church-banner.scss'
import './church-row.scss'

/** A church you belong to (Stitch "Your active church"), with the way into its own page. */
export function ActiveChurchBanner({ membership }: { membership: MyMembership }) {
  const { church } = membership
  const sample = SAMPLE_ACTIVE_CHURCH
  return (
    <section aria-label={`Your church: ${church.name}`} className="active-church church-row">
      <ChurchEmblem name={church.name} logoUrl={church.logoUrl} isActive />
      <div className="row-body">
        <h2 className="row-name active-church-name">
          <span className="row-name-text">{church.name}</span>
          {sample.isVerified && <BadgeCheck aria-label="Verified church" className="row-verified" />}
        </h2>
        <p className="row-pills">
          <span className="row-pill row-pill-active">
            <span aria-hidden className="row-pill-dot" />
            Your active church
          </span>
          <span className="row-pill row-pill-live">
            <span aria-hidden className="row-pill-dot" />
            {sample.live}
          </span>
        </p>
        <p className="row-meta">
          <span className="row-meta-item row-meta-place">
            <MapPin aria-hidden className="row-meta-icon" />
            <span className="row-meta-text">{sample.campus}</span>
          </span>
          <span className="row-meta-item">
            <IdCard aria-hidden className="row-meta-icon" />
            {sample.cell}
          </span>
          <span className="row-meta-item row-meta-amber">
            <CalendarDays aria-hidden className="row-meta-icon" />
            {sample.nextService}
          </span>
        </p>
      </div>
      <Link to={`/church/${church.id}`} className="active-church-go">
        Go to church portal
        <ArrowRight aria-hidden className="active-church-go-icon" />
      </Link>
    </section>
  )
}
