import { useCallback, useEffect, useState } from 'react'
import { type ChurchMemberRow, churchApi } from './church-api'

export type MemberList = {
  members: ChurchMemberRow[]
  total: number
  isLoading: boolean
  error: unknown
  hasMore: boolean
  loadMore: () => void
  /** Starts over from the first page (after a role change, removal or transfer). */
  reload: () => void
}

type Request = { offset: number; attempt: number }
type Settled = { request: Request | null; members: ChurchMemberRow[]; total: number; error?: unknown }

/** Pages through a church's members, appending each page; a newer request wins over a slower older one. */
export function useMemberList(churchId: string): MemberList {
  const [request, setRequest] = useState<Request>({ offset: 0, attempt: 0 })
  const [settled, setSettled] = useState<Settled>({ request: null, members: [], total: 0 })

  useEffect(() => {
    let isCurrent = true
    churchApi.listMembers(churchId, request.offset).then(
      (page) =>
        isCurrent &&
        setSettled((s) => ({
          request,
          members: request.offset === 0 ? page.members : [...s.members, ...page.members],
          total: page.total,
        })),
      (error: unknown) => isCurrent && setSettled((s) => ({ ...s, request, error })),
    )
    return () => {
      isCurrent = false
    }
  }, [churchId, request])

  const loadMore = useCallback(
    () => setRequest((r) => ({ ...r, offset: settled.members.length })),
    [settled.members.length],
  )
  const reload = useCallback(() => setRequest((r) => ({ offset: 0, attempt: r.attempt + 1 })), [])

  const isLoading = settled.request !== request
  return {
    members: settled.members,
    total: settled.total,
    isLoading,
    error: isLoading ? undefined : settled.error,
    hasMore: settled.members.length < settled.total,
    loadMore,
    reload,
  }
}
