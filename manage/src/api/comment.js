import http from './http'
import { normalizePage } from './utils'

export async function fetchCommentList(pageNum = 1, pageSize = 10, postId, keyword, userKeyword) {
  const raw = await http.get('/admin/comment/list', {
    params: {
      pageNum,
      pageSize,
      postId: postId || undefined,
      keyword: keyword || undefined,
      userKeyword: userKeyword || undefined
    }
  })
  return normalizePage(raw)
}

export function deleteComment(id) {
  return http.delete(`/admin/comment/${id}`)
}

