import './church-emblem.scss'

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

type ChurchEmblemProps = {
  name: string
  logoUrl?: string | null
  /** Green emblem with an online dot, for the church you belong to. */
  isActive?: boolean
}

/** A church's logo, or its initials on the shared amber emblem when it has none. */
export function ChurchEmblem({ name, logoUrl, isActive = false }: ChurchEmblemProps) {
  return (
    <span aria-hidden className={isActive ? 'church-emblem church-emblem-active' : 'church-emblem'}>
      {logoUrl ? <img src={logoUrl} alt="" className="church-emblem-logo" /> : initialsOf(name)}
      {isActive && <span className="church-emblem-dot" />}
    </span>
  )
}
