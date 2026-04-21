import http from './http'
import { normalizePage } from './utils'

export async function fetchTradeRecordList(pageNum = 1, pageSize = 10, status, keyword, userKeyword) {
  const raw = await http.get('/admin/trade/list', {
    params: {
      pageNum,
      pageSize,
      status: status === '' || status == null ? undefined : status,
      keyword: keyword || undefined,
      userKeyword: userKeyword || undefined
    }
  })
  return normalizePage(raw)
}

export function updateTradeStatus(id, status) {
  return http.put(`/admin/trade/${id}/status`, null, { params: { status } })
}
