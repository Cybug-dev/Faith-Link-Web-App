import { fakeSession } from '@/test/fake-auth-client'
import { ApiError, apiRequest } from './api-client'

function respond(status: number, body: unknown) {
  return vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status }))
}

describe('apiRequest', () => {
  beforeEach(() => vi.stubEnv('VITE_API_BASE_URL', 'http://api.test'))
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('sends the signed-in user’s token, the JSON body and the query', async () => {
    fakeSession.signIn()
    const fetchMock = respond(200, { ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/api/churches', { method: 'POST', body: { name: 'Grace' }, query: { q: 'lagos', offset: 0, skip: undefined } })

    const [url, init] = fetchMock.mock.lastCall!
    expect(String(url)).toBe('http://api.test/api/churches?q=lagos&offset=0')
    expect(init?.headers).toEqual({ Authorization: 'Bearer fake-api-token', 'Content-Type': 'application/json' })
    expect(init?.body).toBe('{"name":"Grace"}')
  })

  it('turns a backend error into a readable message with its code', async () => {
    vi.stubGlobal('fetch', respond(409, { error: 'Conflict: A church with this slug already exists', code: 'SLUG_TAKEN' }))
    const error = await apiRequest('/api/churches').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 409, code: 'SLUG_TAKEN', message: 'A church with this slug already exists' })
  })

  it('reports a lost connection plainly', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(apiRequest('/api/me')).rejects.toMatchObject({ status: 0, code: 'NETWORK' })
  })

  it('refuses to run without a configured server address', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    await expect(apiRequest('/api/me')).rejects.toMatchObject({ code: 'CONFIG' })
  })
})
