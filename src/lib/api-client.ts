import { authClient } from '@/features/auth/auth-client'

/** A failed FaithLink API call. `code` is the backend's machine code (e.g. SLUG_TAKEN); `status` 0 means no response. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string | undefined

  constructor(status: number, code: string | undefined, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

// Backend errors read "Conflict: A church with this slug already exists"; the prefix is for logs, not people.
function readableMessage(error: unknown, status: number): string {
  if (typeof error === 'string' && error.trim()) return error.replace(/^[A-Za-z ]+:\s*/, '')
  return status >= 500 ? 'Something went wrong on our side. Please try again.' : 'That didn’t work. Please try again.'
}

/** Calls the FaithLink API as the signed-in user and returns the parsed JSON, or throws ApiError. */
export async function apiRequest<T>(path: string, { method = 'GET', body, query, signal }: RequestOptions = {}): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base) throw new ApiError(0, 'CONFIG', 'The app is not connected to the FaithLink server yet.')

  const url = new URL(path, base)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  const token = await authClient.getApiToken().catch(() => null)
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError(0, 'NETWORK', 'Can’t reach FaithLink. Check your connection and try again.')
  }

  const data = (await response.json().catch(() => null)) as { error?: unknown; code?: unknown } | null
  if (!response.ok) {
    const code = typeof data?.code === 'string' ? data.code : undefined
    throw new ApiError(response.status, code, readableMessage(data?.error, response.status))
  }
  return data as T
}
