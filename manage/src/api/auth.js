import http from './http'

export function login({ username, password }) {
  return http.post('/admin/login', { username, password })
}
