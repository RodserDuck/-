import http from './http'

export function fetchCollegeOptions() {
  return http.get('/college/list')
}
