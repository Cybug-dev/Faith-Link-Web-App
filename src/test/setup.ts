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

afterEach(() => {
  sessionStorage.clear()
})
