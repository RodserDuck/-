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

/**
 * 入库前统一为 /uploads/...，去掉误带的 /api 前缀（与小程序 BASE_URL 拼接规则一致）
 */
export function normalizeUploadPathForDb(path) {
  if (path == null || path === '') return ''
  let p = String(path).trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  if (!p.startsWith('/')) p = `/${p}`
  while (p.startsWith('/api')) {
    p = p.substring(4)
    if (!p.startsWith('/')) p = `/${p}`
  }
  return p
}

export function normalizeImagePathsForDb(urls) {
  if (!Array.isArray(urls)) return []
  return urls.map(normalizeUploadPathForDb).filter(Boolean)
}

/** 解析公告/学院公告等 images 字段（JSON 数组字符串或单路径）→ 规范路径列表 */
export function parseImagesField(raw) {
  if (raw == null) return []
  const s = String(raw).trim()
  if (!s) return []
  let arr = []
  try {
    const j = JSON.parse(s)
    if (Array.isArray(j)) arr = j.map(String).filter(Boolean)
    else if (typeof j === 'string') arr = [j]
  } catch {
    arr = [s]
  }
  return normalizeImagePathsForDb(arr)
}

/**
 * 静态资源用于 img 的 src。
 * Spring 配置了 context-path=/api 时，资源实际为 /api/uploads/**；兼容库中旧值 /uploads/**。
 */
export function publicUploadUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const p = path.startsWith('/') ? path : `/${path}`
  if (p.startsWith('/api/uploads/')) return p
  if (p.startsWith('/uploads/')) return `/api${p}`
  return p
}
