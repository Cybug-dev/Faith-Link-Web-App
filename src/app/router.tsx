import { Navigate, Outlet, createBrowserRouter, type RouteObject } from 'react-router'
import { ComingSoonProvider } from '@/components/coming-soon/coming-soon-provider'
import { UnbuiltRoute } from '@/components/coming-soon/unbuilt-route'
import { CreateAccountPage } from '@/features/auth/create-account-page'
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page'
import { ResetPasswordPage } from '@/features/auth/reset-password-page'
import { SignInPage } from '@/features/auth/sign-in-page'
import { VerifyEmailPage } from '@/features/auth/verify-email-page'
import { OnboardingGate } from '@/features/onboarding/onboarding-gate'
import { ONBOARDING_PATH } from '@/features/onboarding/onboarding-routes'
import { loadOrReload } from '@/lib/load-or-reload'

const pageRoutes: RouteObject[] = [
  // The app opens on sign in. Once sessions exist, signed-in visitors should go to /home instead.
  { path: '/', element: <Navigate to="/sign-in" replace /> },
  // Signed-in area: onboarding first, then the app shell (sidebar / bottom nav) around each page.
  // Shell and pages load on demand, in parallel, so sign-in never downloads them.
  {
    element: (
      <OnboardingGate>
        <Outlet />
      </OnboardingGate>
    ),
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
    lazy: async () => ({ Component: (await loadOrReload(() => import('@/features/onboarding/onboarding-page'))).OnboardingPage,
    }),
  },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/create-account', element: <CreateAccountPage /> },
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
    children: pageRoutes,
  },
]

export const router = createBrowserRouter(routes)
