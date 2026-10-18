import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { SplashScreen } from '@/components/splash/splash-screen'
import { getSessionState, peekSessionState, type SessionState } from '@/features/auth/session'

/**
 * Sign in and create account. A signed-out person gets the form at once when the answer is
 * already known; otherwise the branded loading screen covers the short check, so a signed-in
 * person typing these addresses never sees the form flash before being moved to home (owner).
 */
export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [session, setSession] = useState<SessionState | undefined>(peekSessionState)

  useEffect(() => {
    if (session) return
    let isActive = true
    void getSessionState().then((state) => {
      if (isActive) setSession(state)
    })
    return () => {
      isActive = false
    }
  }, [session])

  useEffect(() => {
    if (session?.isSignedIn) void navigate('/home', { replace: true })
  }, [session, navigate])

  if (!session || session.isSignedIn) return <SplashScreen />
  return children
}
