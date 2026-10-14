import { BookOpen } from 'lucide-react'
import type { Scripture } from './scripture'

/**
 * Verse card under the form on phone and tablet (the Stitch "Daily Verse" card;
 * relabelled "Scripture" because the verse isn't daily). Desktop shows the verse
 * on the photo panel instead.
 */
export function ScriptureCard({ scripture }: { scripture: Scripture }) {
  return (
    <figure className="mt-6 rounded-md bg-subtle p-4 shadow-raised desktop:hidden">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-label-sm text-fg-secondary">
          <BookOpen aria-hidden className="size-4" />
          Scripture
        </span>
        <figcaption className="text-label-md text-fg-accent">
          {scripture.reference} ({scripture.translation})
        </figcaption>
      </div>
      <blockquote className="mt-2 text-body-sm italic text-fg-secondary">
        <p>“{scripture.text}”</p>
      </blockquote>
    </figure>
  )
}
