import http from './http'
import { normalizePage } from './utils'

export async function fetchGoodsList(pageNum = 1, pageSize = 10, categoryId, keyword, userKeyword) {
  const raw = await http.get('/admin/goods/list', {
    params: {
      pageNum,
      pageSize,
      categoryId: categoryId || undefined,
      keyword: keyword || undefined,
      userKeyword: userKeyword || undefined
    }
  })
  return normalizePage(raw)
}

export function deleteGoods(id) {
  return http.delete(`/admin/goods/${id}`)
}

export function fetchGoodsDetail(id) {
  return http.get(`/admin/goods/detail/${id}`)
}
