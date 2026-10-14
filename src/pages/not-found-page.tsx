import { Link } from 'react-router'
import { AuthLayout } from '@/features/auth/auth-layout'
import { useDocumentTitle } from '@/lib/use-document-title'

/** Also the landing spot for links whose pages don't exist yet (forgot password, terms, privacy). */
export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <AuthLayout>
      <h1 className="text-headline-lg">Page not found</h1>
      <p className="mt-2 text-body-md text-fg-secondary">
        This page doesn’t exist or hasn’t been built yet.
      </p>
      <p className="mt-6 text-body-md">
        <Link to="/sign-in" className="font-semibold text-fg-accent underline">
          Go to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
