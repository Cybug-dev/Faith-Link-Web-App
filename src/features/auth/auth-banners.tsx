import { Sparkles } from 'lucide-react'
import { BANNER_TAG, BRAND_EYEBROW, BRAND_LINE, CREATE_ACCOUNT_BANNER_SCRIPTURE as verse } from './scripture'

/*
 * Text over the phone/tablet photo banner, as rendered in the Stitch "Mobile Auth UI Design"
 * screens. Stitch sizes from tablet up; one step smaller on phone (12px is the floor).
 */

/** Sign in: amber dot + uppercase eyebrow, then the brand line. */
export function SignInBanner() {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-label-sm uppercase tracking-wider text-fg-accent-on-photo">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        {BRAND_EYEBROW}
      </p>
      <p className="text-label-md tablet:text-title-md">{BRAND_LINE}</p>
    </div>
  )
}

/** Create account: amber tag, italic verse excerpt in quotation marks, white uppercase reference. */
export function CreateAccountBanner() {
  return (
    <figure>
      <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent/90 px-2 py-0.5 text-label-sm text-fg-on-accent">
        <Sparkles aria-hidden className="size-3.5" />
        {BANNER_TAG}
      </span>
      {/* text-caption carries a muted colour, so set white explicitly. */}
      <blockquote className="text-caption text-fg-inverse italic tablet:text-body-sm">
        <p>“{verse.text}”</p>
      </blockquote>
      <figcaption className="mt-1 text-label-sm uppercase tracking-wider">
        {verse.reference}
      </figcaption>
    </figure>
  )
}
