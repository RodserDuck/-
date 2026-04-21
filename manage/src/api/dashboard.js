import http from './http'

/** 返回 { users, posts, notices, goods, lostFound } */
export function fetchStats() {
  return http.get('/admin/dashboard/stats')
}
