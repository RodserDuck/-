import http from './http'
import { normalizePage } from './utils'

export async function fetchClubList(pageNum = 1, pageSize = 10, category, keyword) {
  const raw = await http.get('/admin/club/list', {
    params: { pageNum, pageSize, category: category || undefined, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}
