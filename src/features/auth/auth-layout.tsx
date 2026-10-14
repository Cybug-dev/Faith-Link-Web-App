import { Quote } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/cn'
import { SIGN_IN_SCRIPTURE, authImages, type AuthImage, type Scripture } from './scripture'

type AuthLayoutProps = {
  children: ReactNode
  /** Photo for the phone banner and the desktop panel. Decorative. */
  image?: AuthImage
  /** Scripture shown over the desktop photo panel. */
  scripture?: Scripture
  /** Text over the photo banner shown above the content on phone and tablet. No banner when omitted. */
  banner?: ReactNode
}

/**
 * Signed-out shell: no app navigation, no avatar.
 * Phone and tablet: one column, form width capped at 420px, optional photo banner.
 * Desktop (>= 1024px): form column beside a full-height photo panel carrying scripture.
 */
export function AuthLayout({
  children,
  image = authImages.signIn,
  scripture = SIGN_IN_SCRIPTURE,
  banner,
}: AuthLayoutProps) {
  return (
    <div className="min-h-dvh desktop:grid desktop:grid-cols-2">
      <div className="flex min-h-dvh flex-col px-(--page-margin) py-6 desktop:px-16">
        <header>
          <Logo />
        </header>
        <main className="mx-auto flex w-full max-w-(--w-form) flex-1 flex-col justify-center py-8 [view-transition-name:auth-content]">
          {banner && (
            <div className="relative mb-4 h-44 overflow-hidden rounded-md shadow-raised tablet:h-52 desktop:hidden">
              <img src={image.src} alt="" className={cn('size-full object-cover', image.position)} />
              <div className="absolute inset-0 bg-linear-to-t from-scrim-photo via-scrim-photo/40 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-fg-inverse">{banner}</div>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Pinned to the viewport height so the photo doesn't grow (and zoom) as the form gets longer. */}
      <aside className="relative hidden overflow-hidden desktop:sticky desktop:top-0 desktop:block desktop:h-dvh">
        <img src={image.src} alt="" className={cn('absolute inset-0 size-full object-cover', image.position)} />
        <div className="absolute inset-0 bg-linear-to-t from-scrim-photo via-scrim-photo/40 to-transparent" />
        <figure className="absolute inset-x-16 bottom-16 text-fg-inverse">
          <Quote aria-hidden className="mb-4 size-8 fill-accent text-accent" />
          <div className="scripture-rule max-w-(--measure-prose)">
            <blockquote className="text-scripture-lg italic">
              <p>“{scripture.text}”</p>
            </blockquote>
            <figcaption className="mt-4 text-label-md">
              {scripture.reference} ({scripture.translation})
            </figcaption>
          </div>
        </figure>
      </aside>
    </div>
  )
}
