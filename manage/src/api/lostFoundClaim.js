import http from './http'
import { normalizePage } from './utils'

export async function fetchLostFoundClaimList(pageNum = 1, pageSize = 10, status, keyword) {
  const raw = await http.get('/admin/lost-found-claim/list', {
    params: {
      pageNum,
      pageSize,
      status: status === '' || status == null ? undefined : status,
      keyword: keyword || undefined
    }
  })
  return normalizePage(raw)
}

export function fetchLostFoundClaimDetail(id) {
  return http.get(`/admin/lost-found-claim/detail/${id}`)
}

export function approveLostFoundClaim(id) {
  return http.put(`/admin/lost-found-claim/${id}/approve`)
}

export function rejectLostFoundClaim(id) {
  return http.put(`/admin/lost-found-claim/${id}/reject`)
}
