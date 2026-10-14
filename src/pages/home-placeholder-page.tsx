import { Link } from 'react-router'
import { useDocumentTitle } from '@/lib/use-document-title'

/**
 * TEMPORARY landing page so sign-in and verification have somewhere to go.
 * Delete when the real church home (inside the app shell) exists.
 */
export function HomePlaceholderPage() {
  useDocumentTitle('Home')
  return (
    <main className="mx-auto flex min-h-dvh max-w-(--w-form) flex-col justify-center px-(--page-margin)">
      <h1 className="text-headline-lg">You’re signed in</h1>
      <p className="mt-2 text-body-md text-fg-secondary">The app itself is the next piece of work.</p>
      <p className="mt-6 text-body-md">
        <Link to="/sign-in" className="font-semibold text-fg-accent underline">
          Back to sign in
        </Link>
      </p>
    </main>
  )
}
