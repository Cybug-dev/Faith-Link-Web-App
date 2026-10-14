import { useState } from 'react'
import { GoogleIcon } from '@/components/brand/google-icon'
import { Button } from '@/components/ui/button'
import { authClient } from './auth-client'

/** "Continue with Google" is the same label on sign in and create account. */
export function GoogleButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
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
