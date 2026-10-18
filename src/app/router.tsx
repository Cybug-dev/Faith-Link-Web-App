import { Outlet, type RouteObject } from 'react-router'
import { ComingSoonProvider } from '@/components/coming-soon/coming-soon-provider'
import { UnbuiltRoute } from '@/components/coming-soon/unbuilt-route'
import { CreateAccountPage } from '@/features/auth/create-account-page'
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page'
import { ResetPasswordPage } from '@/features/auth/reset-password-page'
import { SignInPage } from '@/features/auth/sign-in-page'
import { VerifyEmailPage } from '@/features/auth/verify-email-page'
import { RedirectIfSignedIn } from './redirect-if-signed-in'
import { requireSignedIn, requireSignedInApp, startPage } from './route-guards'
import { ONBOARDING_PATH } from '@/features/onboarding/onboarding-routes'
import { loadOrReload } from '@/lib/load-or-reload'

const pageRoutes: RouteObject[] = [
  // The site's address: home when signed in, sign in otherwise.
  { path: '/', loader: startPage },
  // Signed-in area (a brand-new account sees onboarding once first), then the app shell (sidebar / bottom nav) around each page.
  // Shell and pages load on demand, in parallel, so sign-in never downloads them.
  {
    loader: requireSignedInApp,
    children: [
      {
        lazy: async () => ({
          Component: (await loadOrReload(() => import('@/features/app-shell/app-shell'))).AppShell,
        }),
        children: [
          {
            path: '/home',
            lazy: async () => ({
              Component: (await loadOrReload(() => import('@/features/home/home-page'))).HomePage,
            }),
          },
        ],
      },
    ],
  },
  // Loaded on demand: keeps the animation library and onboarding photos out of the sign-in download.
  {
    path: ONBOARDING_PATH,
    loader: requireSignedIn,
    lazy: async () => ({ Component: (await loadOrReload(() => import('@/features/onboarding/onboarding-page'))).OnboardingPage,
    }),
  },
  {
    path: '/sign-in',
    element: (
      <RedirectIfSignedIn>
        <SignInPage />
      </RedirectIfSignedIn>
    ),
  },
  {
    path: '/create-account',
    element: (
      <RedirectIfSignedIn>
        <CreateAccountPage />
      </RedirectIfSignedIn>
    ),
  },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  // No "page not found" screen (owner): unbuilt or unknown addresses open the coming-soon popup.
  { path: '*', element: <UnbuiltRoute /> },
]

/**
 * Shared with tests (createMemoryRouter) so the routes are defined once.
 * The coming-soon popup wraps every page, so auth screens and the app shell share one.
 */
export const routes: RouteObject[] = [
  {
    element: (
      <ComingSoonProvider>
        <Outlet />
      </ComingSoonProvider>
    ),
    // Shown while the first session check runs on a fresh page load: blank, so no wrong screen
    // flashes, with a status line so screen readers know something is happening.
    HydrateFallback: () => (
      <output className="sr-only">Loading FaithLink</output>
    ),
    children: pageRoutes,
  },
]
