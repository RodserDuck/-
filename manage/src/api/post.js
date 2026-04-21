import http from './http'
import { normalizePage } from './utils'

export async function fetchPostList(pageNum = 1, pageSize = 10, category, keyword) {
  const raw = await http.get('/admin/post/list', {
    params: { pageNum, pageSize, category: category || undefined, keyword: keyword || undefined }
  })
  return normalizePage(raw)
}

export function deletePost(id) {
  return http.delete(`/admin/post/${id}`)
}
