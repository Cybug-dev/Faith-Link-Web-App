import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useComingSoon } from './coming-soon-context'

/** Friendlier names for addresses linked from the app before their pages exist. */
const FEATURE_NAMES: Record<string, string> = {
  terms: 'Terms of service',
  privacy: 'Privacy policy',
}

/** A malformed address (e.g. a stray %) must not crash the catch-all. */
function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

function featureNameFor(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? ''
  const knownName = Object.hasOwn(FEATURE_NAMES, segment) ? FEATURE_NAMES[segment] : undefined
  if (knownName) return knownName
  const words = safeDecode(segment).replace(/[-_]+/g, ' ').trim()
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'This page'
}

/**
 * Catch-all route (owner: no "page not found" screen). Any address without a page opens the
 * shared coming-soon popup and returns the person to where they were, or to the start if
 * they typed the address directly.
 */
export function UnbuiltRoute() {
  const showComingSoon = useComingSoon()
  const navigate = useNavigate()
  const { pathname, key } = useLocation()
  // StrictMode runs effects twice in development; going back twice would skip a page.
  const hasHandledRef = useRef(false)

  useEffect(() => {
    if (hasHandledRef.current) return
    hasHandledRef.current = true
    showComingSoon(featureNameFor(pathname))
    // The browser router keeps this entry's key and its position (idx) in history.state: idx above
    // 0 means an app page sits behind this one. Otherwise (typed address, reload as the first page)
    // going back would leave the app. Other routers (tests) fall back to the 'default' first key.
    const entry = window.history.state as { key?: string; idx?: number } | null
    const canGoBack = entry?.key === key && typeof entry.idx === 'number' ? entry.idx > 0 : key !== 'default'
    if (canGoBack) void navigate(-1)
    else void navigate('/', { replace: true })
  }, [showComingSoon, navigate, pathname, key])

  return null
}
