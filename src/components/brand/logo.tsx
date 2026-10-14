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

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoMark />
      <span className="text-title-lg text-fg">FaithLink</span>
    </div>
  )
}
