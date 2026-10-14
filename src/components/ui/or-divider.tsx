import type { ReactNode } from 'react'

/** Labelled rule between alternative methods. Sentence case, never uppercase. */
export function OrDivider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-body-sm text-fg-secondary">
      <span aria-hidden className="h-px flex-1 bg-line" />
      <span>{children}</span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  )
}
