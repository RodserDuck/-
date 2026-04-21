import http from './http'
import { normalizePage } from './utils'

export async function fetchClubList(pageNum = 1, pageSize = 10, category, keyword) {
  const raw = await http.get('/admin/club/list', {
    params: { pageNum, pageSize, category: category || undefined, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}

export function fetchClubDetail(id) {
  return http.get(`/admin/club/detail/${id}`)
}

export async function fetchClubApplications(pageNum = 1, pageSize = 10, clubId, keyword) {
  const raw = await http.get('/admin/club/applications', {
    params: {
      pageNum,
      pageSize,
      clubId: clubId || undefined,
      keyword: keyword || undefined
    }
  })
  return normalizePage(raw)
}

export function approveClubApplication(memberId) {
  return http.put(`/admin/club/application/${memberId}/approve`)
}

export function rejectClubApplication(memberId) {
  return http.put(`/admin/club/application/${memberId}/reject`)
}
