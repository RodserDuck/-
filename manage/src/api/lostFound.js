import http from './http'
import { normalizePage } from './utils'

export async function fetchLostFoundList(pageNum = 1, pageSize = 10, type, status, keyword) {
  const raw = await http.get('/admin/lost-found/list', {
    params: {
      pageNum,
      pageSize,
      type: type === '' || type == null ? undefined : type,
      status: status === '' || status == null ? undefined : status,
      keyword: keyword || undefined
    }
  })
  return normalizePage(raw)
}

export function updateLostFoundStatus(id, status) {
  return http.put(`/admin/lost-found/${id}/status`, null, { params: { status } })
}
