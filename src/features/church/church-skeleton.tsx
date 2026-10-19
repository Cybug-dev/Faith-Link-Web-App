import { Skeleton } from '@/components/ui/skeleton'
import './church-skeleton.scss'

/**
 * Skeleton placeholder for church directory rows during API fetch.
 */
export function ChurchRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="church-directory-skeleton-list" aria-label="Loading church list…">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="church-row-skeleton">
          <Skeleton variant="circular" className="skeleton-emblem" />
          <div className="skeleton-body">
            <div className="skeleton-title-row">
              <Skeleton variant="text" className="skeleton-name" />
              <Skeleton variant="badge" className="skeleton-badge" />
            </div>
            <div className="skeleton-pills-row">
              <Skeleton variant="badge" className="skeleton-pill" />
            </div>
            <div className="skeleton-meta-row">
              <Skeleton variant="text" className="skeleton-meta" />
              <Skeleton variant="text" className="skeleton-meta-short" />
            </div>
          </div>
          <Skeleton variant="button" className="skeleton-action" />
        </div>
      ))}
    </div>
  )
}

/**
 * Full page skeleton layout for MyChurchPage during initial data load.
 */
export function ChurchPageSkeleton() {
  return (
    <div className="church-page-skeleton" aria-label="Loading church page…">
      <div className="skeleton-hero-card">
        <Skeleton variant="text" className="skeleton-hero-crumb" />
        <Skeleton variant="text" className="skeleton-hero-title" />
        <Skeleton variant="text" className="skeleton-hero-subtitle" />
        <div className="skeleton-hero-tabs">
          <Skeleton variant="button" className="skeleton-tab" />
          <Skeleton variant="button" className="skeleton-tab" />
          <Skeleton variant="button" className="skeleton-tab" />
          <Skeleton variant="button" className="skeleton-tab" />
        </div>
      </div>

      <div className="skeleton-columns">
        <div className="skeleton-column-main">
          <div className="skeleton-directory-box">
            <div className="skeleton-dir-head">
              <Skeleton variant="text" className="skeleton-dir-title" />
              <Skeleton variant="button" className="skeleton-dir-select" />
            </div>
            <Skeleton variant="rectangular" className="skeleton-search-bar" />
            <ChurchRowSkeleton count={4} />
          </div>
        </div>
        <div className="skeleton-column-side">
          <Skeleton variant="rectangular" className="skeleton-side-card" />
          <Skeleton variant="rectangular" className="skeleton-side-card" />
        </div>
      </div>
    </div>
  )
}
