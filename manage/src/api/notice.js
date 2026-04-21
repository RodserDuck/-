import http from './http'
import { normalizePage } from './utils'

export async function fetchNoticeList(pageNum = 1, pageSize = 10) {
  const raw = await http.get('/admin/notice/list', { params: { pageNum, pageSize } })
  return normalizePage(raw)
}

export function fetchNoticeDetail(id) {
  return http.get(`/admin/notice/detail/${id}`)
}

export function saveNotice(data) {
  return http.post('/admin/notice/save', data)
}

export function deleteNotice(id) {
  return http.delete(`/admin/notice/${id}`)
}
