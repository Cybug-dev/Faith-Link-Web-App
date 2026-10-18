import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { getSessionState } from '@/features/auth/session'

/**
 * Sign in and create account: shown straight away (no blank wait on the network), then a
 * signed-in person is moved on to home as soon as the session check answers. Never while
 * they're using the form: moving them then would lose what they typed and their focus.
 */
export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true
    void getSessionState().then(({ isSignedIn }) => {
      const isUsingForm = document.activeElement?.closest('form') != null
      if (isActive && isSignedIn && !isUsingForm) void navigate('/home', { replace: true })
    })
    return () => {
      isActive = false
    }
  }, [navigate])

  return children
}
