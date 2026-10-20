/**
 * Derives the live-viewer shape from the Neon Auth session.
 * Falls back to safe placeholder values while loading or when the session has
 * no name (e.g. an old account created before the `name` field was stored).
 *
 * The hook re-fetches once on mount. A full real-time subscription can replace
 * the `useEffect` when the profile API exists.
 */
import { useEffect, useState } from 'react'
import { authClient } from '../auth/auth-client'
import { initialsFrom, SAMPLE_VIEWER, type Viewer } from './sample-viewer'

type LiveViewer = Pick<Viewer, 'firstName' | 'fullName' | 'initials' | 'photoUrl' | 'role' | 'unreadNotifications'>

function viewerFromName(name: string | null | undefined): LiveViewer {
  if (!name) {
    // No name yet — keep sample data so the UI never looks broken.
    return {
      firstName: SAMPLE_VIEWER.firstName,
      fullName: SAMPLE_VIEWER.fullName,
      initials: SAMPLE_VIEWER.initials,
      photoUrl: SAMPLE_VIEWER.photoUrl,
      role: SAMPLE_VIEWER.role,
      unreadNotifications: SAMPLE_VIEWER.unreadNotifications,
    }
  }
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] ?? name
  return {
    firstName,
    fullName: name,
    initials: initialsFrom(name),
    photoUrl: undefined,
    role: SAMPLE_VIEWER.role,                   // no role API yet
    unreadNotifications: SAMPLE_VIEWER.unreadNotifications, // no notifications API yet
  }
}

/** Returns the signed-in user derived from the live auth session. */
export function useViewer(): LiveViewer {
  const [viewer, setViewer] = useState<LiveViewer>(() => viewerFromName(undefined))

  useEffect(() => {
    let cancelled = false
    void authClient.getSession().then((session) => {
      if (!cancelled) setViewer(viewerFromName(session?.name))
    }).catch(() => {/* keep placeholder */})
    return () => { cancelled = true }
  }, [])

  return viewer
}
