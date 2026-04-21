import http from './http'
import { normalizePage } from './utils'

export async function fetchUserList(pageNum = 1, pageSize = 10, keyword) {
  const raw = await http.get('/admin/user/list', {
    params: { pageNum, pageSize, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}

export function updateUserStatus(id, status) {
  return http.put(`/admin/user/${id}/status`, null, { params: { status } })
}
