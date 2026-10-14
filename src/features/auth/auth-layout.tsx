import type { ReactNode } from 'react'
import { Logo } from '@/components/brand/logo'
import { BRAND_LINE, SIGN_IN_SCRIPTURE, authImages, type Scripture } from './scripture'

type AuthLayoutProps = {
  children: ReactNode
  /** Photo for the phone banner and the desktop panel. Decorative. */
  image?: string
  /** Scripture shown over the desktop photo panel. */
  scripture?: Scripture
  /** Photo banner above the content on phone and tablet (sign in and create account only). */
  banner?: boolean
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
  banner = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-dvh desktop:grid desktop:grid-cols-2">
      <div className="flex min-h-dvh flex-col px-(--page-margin) py-6 desktop:px-16">
        <header>
          <Logo />
        </header>
        <main className="mx-auto flex w-full max-w-(--w-form) flex-1 flex-col justify-center py-8">
          {banner && (
            <div className="relative mb-4 h-44 overflow-hidden rounded-md shadow-raised tablet:h-52 desktop:hidden">
              <img src={image} alt="" className="size-full object-cover object-right" />
              <div className="absolute inset-0 bg-linear-to-t from-scrim-photo via-transparent to-transparent" />
              <p className="absolute inset-x-4 bottom-4 text-title-md text-fg-inverse">{BRAND_LINE}</p>
            </div>
          )}
          {children}
        </main>
      </div>

      <aside className="relative hidden overflow-hidden desktop:block">
        <img src={image} alt="" className="absolute inset-0 size-full object-cover object-right" />
        <div className="absolute inset-0 bg-linear-to-t from-scrim-photo via-scrim-photo/40 to-transparent" />
        <figure className="absolute inset-x-16 bottom-16 text-fg-inverse">
          <div className="scripture-rule max-w-(--measure-prose)">
            <blockquote className="text-scripture-lg">
              <p>{scripture.text}</p>
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
