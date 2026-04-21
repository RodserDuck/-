import http from './http'

/**
 * 单图上传，返回 { url }，如 /uploads/notice/notice_1_xxx.png（不含 /api，由展示层拼接）
 * @param {File} file
 * @param {'notice'|'college'|'user'|'goods'|'post'|'lostfound'|'club'|'activity'} category
 */
export function uploadImage(file, category = 'notice') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('category', category)
  return http.post('/upload', fd)
}
