import http from './http'
import { normalizePage } from './utils'

export async function fetchPostList(pageNum = 1, pageSize = 10, category, keyword, userKeyword) {
  const raw = await http.get('/admin/post/list', {
    params: {
      pageNum,
      pageSize,
      category: category || undefined,
      keyword: keyword || undefined,
      userKeyword: userKeyword || undefined
    }
  })
  return normalizePage(raw)
}

export function deletePost(id) {
  return http.delete(`/admin/post/${id}`)
}

export function fetchPostDetail(id) {
  return http.get(`/admin/post/detail/${id}`)
}
