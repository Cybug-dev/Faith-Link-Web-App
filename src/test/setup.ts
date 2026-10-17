/// <reference types="vitest/jsdom" />
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'

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

afterEach(() => {
  sessionStorage.clear()
  localStorage.clear()
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
