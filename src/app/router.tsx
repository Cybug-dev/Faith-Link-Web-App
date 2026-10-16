import { Navigate, createBrowserRouter, type RouteObject } from 'react-router'
import { CreateAccountPage } from '@/features/auth/create-account-page'
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page'
import { ResetPasswordPage } from '@/features/auth/reset-password-page'
import { SignInPage } from '@/features/auth/sign-in-page'
import { VerifyEmailPage } from '@/features/auth/verify-email-page'
import { OnboardingGate } from '@/features/onboarding/onboarding-gate'
import { ONBOARDING_PATH } from '@/features/onboarding/onboarding-routes'
import { loadOrReload } from '@/lib/load-or-reload'
import { HomePlaceholderPage } from '@/pages/home-placeholder-page'
import { NotFoundPage } from '@/pages/not-found-page'

/** Shared with tests (createMemoryRouter) so the routes are defined once. */
export const routes: RouteObject[] = [
  // The app opens on sign in. Once sessions exist, signed-in visitors should go to /home instead.
  { path: '/', element: <Navigate to="/sign-in" replace /> },
  {
    path: '/home',
    element: (
      <OnboardingGate>
        <HomePlaceholderPage />
      </OnboardingGate>
    ),
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
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
