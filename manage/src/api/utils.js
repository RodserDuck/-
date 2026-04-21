/**
 * 解析 Spring Result<T> 或兼容裸数据
 */
export function unwrapResult(body) {
  if (body == null) return null
  if (typeof body !== 'object') return body
  const code = body.code
  const ok = code === undefined || code === null || Number(code) === 200 || code === '200'
  if (!ok) return body
  if (Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data
  }
  return body
}

/** MyBatis-Plus Page JSON → 统一结构 */
export function normalizePage(raw) {
  if (raw == null) return { records: [], total: 0 }
  if (Array.isArray(raw)) return { records: raw, total: raw.length }
  const records = raw.records ?? raw.list ?? []
  const total = raw.total != null ? Number(raw.total) : 0
  return { records, total }
}
