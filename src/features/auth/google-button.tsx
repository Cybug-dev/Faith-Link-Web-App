import { useEffect, useState } from 'react'
import { GoogleIcon } from '@/components/brand/google-icon'
import { SplashScreen } from '@/components/splash/splash-screen'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { authClient } from './auth-client'
import { forgetSessionState } from './session'

/** If Google still hasn't been reached after this long, give the button back so they can retry. */
const REDIRECT_GRACE_MS = 15000

type GoogleState = 'idle' | 'starting' | 'leaving' | 'failed'

/** "Continue with Google" is the same label on sign in and create account. */
export function GoogleButton() {
  const [state, setState] = useState<GoogleState>('idle')
  const isBusy = state === 'starting' || state === 'leaving'

  // Once the redirect has started the browser needs a moment to reach Google. The branded
  // loading screen covers that gap (owner) so it never looks as if nothing happened.
  useEffect(() => {
    if (!isBusy) return
    const timer = setTimeout(() => setState('idle'), REDIRECT_GRACE_MS)
    // Coming back with the browser's Back button restores this page from cache: show the button again.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setState('idle')
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [isBusy])

  async function handleClick() {
    setState('starting')
    // Google returns to a fresh page load anyway; clearing makes sure no old "signed out" answer lingers.
    forgetSessionState()
    try {
      await authClient.signInWithGoogle()
      setState('leaving')
    } catch {
      setState('failed')
    }
  }

  return (
    <>
      <Button variant="surface" className="w-full" loading={isBusy} onClick={handleClick}>
        {!isBusy && <GoogleIcon className="size-5" />}
        Continue with Google
      </Button>
      {state === 'failed' && (
        <Alert variant="danger" className="mt-3">
          Google sign-in couldn’t start. Check your connection and try again.
        </Alert>
      )}
      {state === 'leaving' && <SplashScreen label="Signing you in with Google" covers />}
    </>
  )
}
