import { onboardingImages } from './onboarding-images'

/**
 * Warms the browser cache while the person is still on the sign-in screens: the
 * onboarding page code and the first photo. Runs when the browser is idle, so
 * it never competes with the screen being used. After sign-in the first step
 * then appears straight away instead of after a wait.
 */
export function preloadOnboarding(): void {
  const run = () => {
    void import('./onboarding-page')
    new Image().src = onboardingImages.hero
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 1500)
}
