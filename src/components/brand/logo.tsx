import { cn } from '@/lib/cn'

/** Slate tile with an amber cross; the same mark as public/favicon.svg. */
function LogoMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('flex size-7 items-center justify-center rounded-sm bg-inverse', className)}>
      <svg viewBox="0 0 32 32" className="size-7" fill="none">
        <path
          d="M16 7v18M9.5 13h13"
          stroke="var(--color-accent-bg)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

/** Bare amber cross, as in the onboarding design. Also used inside illustrations. */
export function CrossMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn('size-6', className)} fill="none">
      <path d="M12 3v18M6 9h12" stroke="var(--color-accent-bg)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

type LogoProps = {
  className?: string
  /** `tile` (default) is the favicon mark; `cross` is the bare cross from the onboarding design (owner is comparing the two). */
  mark?: 'tile' | 'cross'
  /** `inverse` sets the wordmark in light text for dark surfaces (desktop sidebar). */
  tone?: 'default' | 'inverse'
}

export function Logo({ className, mark = 'tile', tone = 'default' }: LogoProps) {
  return (
    <div className={cn('flex items-center', mark === 'tile' ? 'gap-3' : 'gap-1', className)}>
      {mark === 'tile' ? <LogoMark /> : <CrossMark className="size-7" />}
      <span
        className={cn(
          'text-title-lg',
          tone === 'inverse' ? 'text-fg-inverse' : 'text-fg',
          mark === 'cross' && 'font-bold',
        )}
      >
        FaithLink
      </span>
    </div>
  )
}
