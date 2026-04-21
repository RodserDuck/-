import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { unwrapResult } from './utils'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

const http = axios.create({
  baseURL,
  timeout: 30000
})

http.interceptors.request.use((config) => {
  const t = localStorage.getItem('admin_token')
  if (t) {
    config.headers.Authorization = `Bearer ${t}`
  }
  return config
})

function extractErrorMessage(data) {
  if (!data || typeof data !== 'object') return null
  return data.msg || data.message || data.detail || data.title || null
}

http.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body == null) return null

    if (typeof body === 'object' && body.code !== undefined && body.code !== null) {
      const code = Number(body.code)
      if (!Number.isNaN(code) && code !== 200) {
        const errMsg = body.msg || body.message || '请求失败'
        ElMessage.error(errMsg)
        return Promise.reject(new Error(errMsg))
      }
    }

    return unwrapResult(body)
  },
  (err) => {
    const status = err.response?.status
    const data = err.response?.data
    const msg =
      extractErrorMessage(data) ||
      (typeof data === 'string' ? data : null) ||
      err.message ||
      '网络错误'

    if (status === 401 || status === 403) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_name')
      localStorage.removeItem('admin_display')
      if (router.currentRoute.value.name !== 'login') {
        router.replace({ name: 'login' })
      }
    }
    ElMessage.error(msg)
    return Promise.reject(err)
  }
)

export default http
