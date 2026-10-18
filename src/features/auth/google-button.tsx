import { useState } from 'react'
import { GoogleIcon } from '@/components/brand/google-icon'
import { Button } from '@/components/ui/button'
import { authClient } from './auth-client'
import { forgetSessionState } from './session'

/** "Continue with Google" is the same label on sign in and create account. */
export function GoogleButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    // Google returns to a fresh page load anyway; clearing makes sure no old "signed out" answer lingers.
    forgetSessionState()
    try {
      await authClient.signInWithGoogle()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="surface" className="w-full" loading={loading} onClick={handleClick}>
      {!loading && <GoogleIcon className="size-5" />}
      Continue with Google
    </Button>
  )
}
