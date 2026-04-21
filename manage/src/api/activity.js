import http from './http'
import { normalizePage } from './utils'

export async function fetchActivityList(pageNum = 1, pageSize = 10, keyword) {
  const raw = await http.get('/admin/activity/list', {
    params: { pageNum, pageSize, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}

export function fetchActivityDetail(id) {
  return http.get(`/admin/activity/detail/${id}`)
}

export function createActivity(data) {
  return http.post('/admin/activity/save', data)
}

export function updateActivity(data) {
  return http.put('/admin/activity/update', data)
}

export function deleteActivity(id) {
  return http.delete(`/admin/activity/${id}`)
}
