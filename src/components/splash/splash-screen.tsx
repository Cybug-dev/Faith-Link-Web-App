import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CrossMark } from '@/components/brand/logo'
import './splash-screen.scss'

type SplashScreenProps = {
  /** What screen readers hear while it shows, e.g. "Signing you in with Google". */
  label?: string
  /**
   * Shown over a page that is still there (e.g. sign in while the browser leaves for Google):
   * drawn above everything, and the page behind is locked so it can't be reached or scrolled.
   */
  covers?: boolean
}

/**
 * Full-screen branded wait (owner, 2026-10-18): the warm canvas, the FaithLink mark and a soft
 * amber glow that slowly breathes. Covers every moment the app is busy but has nothing to show
 * yet: the first sign-in check, leaving for Google and coming back, and moving a signed-in
 * person off sign in. Motion stops under reduced motion.
 */
export function SplashScreen({ label = 'Loading FaithLink', covers = false }: SplashScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLOutputElement>(null)

  // Written in after the screen appears: a status region that arrives already holding its text
  // is often not read out.
  useEffect(() => {
    if (statusRef.current) statusRef.current.textContent = label
  }, [label])

  useEffect(() => {
    if (!covers) return
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    screenRef.current?.focus()
    return () => {
      root?.removeAttribute('inert')
      document.body.style.overflow = overflow
    }
  }, [covers])

  const screen = (
    <div ref={screenRef} className="splash-screen" tabIndex={-1}>
      <div aria-hidden className="splash-mark">
        <span className="splash-glow" />
        <span className="splash-tile">
          <CrossMark className="splash-cross" />
        </span>
      </div>
      <p aria-hidden className="splash-name">
        FaithLink
      </p>
      <span aria-hidden className="splash-bar">
        <span className="splash-bar-fill" />
      </span>
      <output ref={statusRef} className="splash-status" />
    </div>
  )

  // Outside the page (#root), so no transformed parent can trap it and inert can't reach it.
  return covers ? createPortal(screen, document.body) : screen
}
