import http from './http'
import { normalizePage } from './utils'

export async function fetchGoodsList(pageNum = 1, pageSize = 10, categoryId, keyword) {
  const raw = await http.get('/admin/goods/list', {
    params: {
      pageNum,
      pageSize,
      categoryId: categoryId || undefined,
      keyword: keyword || undefined
    }
  })
  return normalizePage(raw)
}

export function deleteGoods(id) {
  return http.delete(`/admin/goods/${id}`)
}
