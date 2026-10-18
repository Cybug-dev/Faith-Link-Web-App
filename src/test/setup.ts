/// <reference types="vitest/jsdom" />
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { forgetSessionState, getSessionState } from '@/features/auth/session'
import { fakeSession } from './fake-auth-client'

// Tests never reach Neon Auth: keep the real types and AuthError, swap the client.
vi.mock('@/features/auth/auth-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/auth/auth-client')>()
  const { fakeAuthClient } = await import('./fake-auth-client')
  return { ...actual, authClient: fakeAuthClient }
})

// jsdom doesn't implement elementFromPoint; input-otp calls it to place the caret.
document.elementFromPoint ??= () => null

// Node 25+ has its own localStorage global (disabled without --localstorage-file) that
// hides jsdom's. Point the global back at jsdom's working storage.
if (typeof globalThis.localStorage?.clear !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: jsdom.window.localStorage,
    configurable: true,
  })
}

// Every test starts signed out with that answer already known, as for a real signed-out visitor
// once the first check is done, so sign in renders at once. fakeSession.signIn() clears it.
fakeSession.setOnSessionChange(forgetSessionState)
beforeEach(async () => {
  await getSessionState()
})

afterEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  fakeSession.reset()
  forgetSessionState()
})

// jsdom has no <dialog> modal API yet; a minimal stand-in so popups can open and close in tests.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
