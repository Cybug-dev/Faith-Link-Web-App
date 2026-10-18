import { ChevronRight, Users } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { CardHead } from './card-head'
import { GROUP_IMAGE_SRC, GROUP_IMAGE_SRCSET, type TrendingItem } from './home-sample-data'
import './trending-card.scss'

/** Owner's reference: three trending lesson series, then a "Join a Group" banner. Pages not built yet. */
export function TrendingCard({ items }: { items: TrendingItem[] }) {
  const showComingSoon = useComingSoon()
  return (
    <section aria-labelledby="trending-heading" className="trending">
      <CardHead
        id="trending-heading"
        title="Trending This Week"
        subtitle="What your church is reading"
        link={{
          label: 'View All',
          accessibleLabel: 'View all trending lessons',
          onClick: () => showComingSoon('Trending lessons'),
        }}
      />
      {items.length === 0 ? (
        <p className="trending-empty">Nothing trending yet. Popular lessons in your church will show here.</p>
      ) : (
        <ul className="trending-list">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="trending-item" onClick={() => showComingSoon(item.title)}>
                <span className="trending-photo-frame">
                  <img
                    src={item.image.src}
                    srcSet={item.image.srcSet}
                    sizes="(min-width: 37.5rem) 12rem, 6rem"
                    alt=""
                    width={480}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="trending-photo"
                  />
                </span>
                <span className="trending-title">{item.title}</span>
                <span className="trending-meta">
                  {item.kind}
                  <span aria-hidden className="trending-dot" />
                  <span className="visually-hidden">, </span>
                  {item.lessons} {item.lessons === 1 ? 'lesson' : 'lessons'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="group-banner" onClick={() => showComingSoon('Groups')}>
        <img
          src={GROUP_IMAGE_SRC}
          srcSet={GROUP_IMAGE_SRCSET}
          sizes="(min-width: 64rem) 66vw, 100vw"
          alt=""
          width={640}
          height={240}
          loading="lazy"
          decoding="async"
          className="group-photo"
        />
        <span aria-hidden className="group-icon">
          <Users />
        </span>
        <span className="group-text">
          <span className="group-title">Join a Group</span>
          <span className="group-hint">Find your people. Grow together.</span>
        </span>
        <ChevronRight aria-hidden className="group-chevron" />
      </button>
    </section>
  )
}
