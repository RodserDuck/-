import http from './http'
import { normalizePage } from './utils'

export async function fetchCollegeNoticeList(pageNum = 1, pageSize = 10, college, keyword) {
  const raw = await http.get('/admin/college-notice/list', {
    params: { pageNum, pageSize, college: college || undefined, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}

export function fetchCollegeNoticeDetail(id) {
  return http.get(`/admin/college-notice/detail/${id}`)
}

export function saveCollegeNotice(data) {
  return http.post('/admin/college-notice/save', data)
}

export function deleteCollegeNotice(id) {
  return http.delete(`/admin/college-notice/${id}`)
}
