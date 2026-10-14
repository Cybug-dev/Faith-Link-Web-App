import { Navigate, createBrowserRouter, type RouteObject } from 'react-router'
import { CreateAccountPage } from '@/features/auth/create-account-page'
import { SignInPage } from '@/features/auth/sign-in-page'
import { VerifyEmailPage } from '@/features/auth/verify-email-page'
import { HomePlaceholderPage } from '@/pages/home-placeholder-page'
import { NotFoundPage } from '@/pages/not-found-page'

/** Shared with tests (createMemoryRouter) so the routes are defined once. */
export const routes: RouteObject[] = [
  // The app opens on sign in. Once sessions exist, signed-in visitors should go to /home instead.
  { path: '/', element: <Navigate to="/sign-in" replace /> },
  { path: '/home', element: <HomePlaceholderPage /> },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/create-account', element: <CreateAccountPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
