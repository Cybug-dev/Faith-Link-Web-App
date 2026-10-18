import { afterEach, vi } from 'vitest'
import { authClient } from './auth-client'
import { forgetSessionState, getSessionState } from './session'

describe('Session check', () => {
  afterEach(() => vi.restoreAllMocks())

  it('asks once and shares the answer until it is forgotten', async () => {
    const spy = vi.spyOn(authClient, 'getSession').mockResolvedValue({ createdAt: new Date('2025-01-01') })
    expect(await getSessionState()).toEqual({ isSignedIn: true, isNewAccount: false })
    await getSessionState()
    expect(spy).toHaveBeenCalledTimes(1)

    forgetSessionState()
    await getSessionState()
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('counts an account made in the last half hour as new', async () => {
    vi.spyOn(authClient, 'getSession').mockResolvedValue({ createdAt: new Date() })
    expect(await getSessionState()).toEqual({ isSignedIn: true, isNewAccount: true })
  })

  it('treats a failed check as signed out without remembering it', async () => {
    const spy = vi
      .spyOn(authClient, 'getSession')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ createdAt: null })
    expect(await getSessionState()).toEqual({ isSignedIn: false, isNewAccount: false })
    // The next page asks again instead of keeping the failure.
    expect(await getSessionState()).toEqual({ isSignedIn: true, isNewAccount: false })
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
