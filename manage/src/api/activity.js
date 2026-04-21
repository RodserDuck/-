import http from './http'
import { normalizePage } from './utils'

export async function fetchActivityList(pageNum = 1, pageSize = 10, keyword) {
  const raw = await http.get('/admin/activity/list', {
    params: { pageNum, pageSize, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}
