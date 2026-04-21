import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const username = ref(localStorage.getItem('admin_name') || '')
  const name = ref(localStorage.getItem('admin_display') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setSession(t, u, displayName) {
    token.value = t
    username.value = u
    name.value = displayName || u
    localStorage.setItem('admin_token', t)
    localStorage.setItem('admin_name', u)
    localStorage.setItem('admin_display', displayName || u)
  }

  function clearSession() {
    token.value = ''
    username.value = ''
    name.value = ''
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_name')
    localStorage.removeItem('admin_display')
  }

  async function login(credentials) {
    const data = await apiLogin(credentials)
    if (data) {
      setSession(data.token, data.username, data.name)
    }
    return data
  }

  function logout() {
    clearSession()
  }

  return { token, username, name, isLoggedIn, login, logout, setSession, clearSession }
})
