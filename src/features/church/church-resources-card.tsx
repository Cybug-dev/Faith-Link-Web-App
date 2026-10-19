import { ArrowRight, BookOpen, Layers, Sparkles, Video } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import './church-resources-card.scss'

const RESOURCES = [
  {
    id: 'sermons',
    title: 'Sermon Study Kits',
    description: 'Weekly scripture outlines, discussion questions, and reflection prompts for home cell groups.',
    icon: BookOpen,
    tag: 'Weekly Kit',
  },
  {
    id: 'hybrid',
    title: 'Hybrid Gathering Guide',
    description: 'Checklist and guidelines to seamlessly bridge in-person fellowship and online live streams.',
    icon: Video,
    tag: 'Media Guide',
  },
  {
    id: 'leadership',
    title: 'Pastoral Care & Ministry Tracks',
    description: 'Structures for assigning ministry leaders, organizing prayer teams, and welcoming new converts.',
    icon: Layers,
    tag: 'Leadership',
  },
] as const

/**
 * Stitch-inspired resource toolkit card sitting underneath Register Your Church.
 * Gives fellowship leaders immediate access to study templates and guides.
 */
export function ChurchResourcesCard() {
  const showComingSoon = useComingSoon()

  return (
    <section aria-labelledby="church-resources-heading" className="church-resources-card">
      <div className="resources-head">
        <div className="resources-icon-wrapper">
          <Sparkles aria-hidden className="resources-icon" />
        </div>
        <div className="resources-head-text">
          <h2 id="church-resources-heading" className="resources-title">
            Fellowship Resources & Guides
          </h2>
          <p className="resources-subtitle">
            Curated tools to help church leaders, cell coordinators, and pastors build vibrant assemblies.
          </p>
        </div>
      </div>

      <ul className="resources-list">
        {RESOURCES.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className="resource-item">
              <span className="resource-item-icon">
                <Icon aria-hidden />
              </span>
              <div className="resource-item-content">
                <div className="resource-item-title-row">
                  <h3 className="resource-item-title">{item.title}</h3>
                  <span className="resource-item-tag">{item.tag}</span>
                </div>
                <p className="resource-item-desc">{item.description}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="resources-footer">
        <button
          type="button"
          className="resources-action-btn"
          onClick={() => showComingSoon('Fellowship Resource Library')}
        >
          Explore Leader Toolkit
          <ArrowRight aria-hidden className="resources-action-icon" />
        </button>
      </div>
    </section>
  )
}
