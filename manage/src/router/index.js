import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true, title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '概览' }
      },
      {
        path: 'notice',
        name: 'notice-list',
        component: () => import('@/views/notice/NoticeList.vue'),
        meta: { title: '校园公告' }
      },
      {
        path: 'notice/edit',
        name: 'notice-edit',
        component: () => import('@/views/notice/NoticeEdit.vue'),
        meta: { title: '编辑公告' }
      },
      {
        path: 'notice/edit/:id',
        name: 'notice-edit-id',
        component: () => import('@/views/notice/NoticeEdit.vue'),
        meta: { title: '编辑公告' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const token = auth.token || localStorage.getItem('admin_token')
  if (!to.meta.public && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  if (to.name === 'login' && token) {
    next({ name: 'dashboard' })
    return
  }
  document.title = to.meta.title ? `${to.meta.title} · 校园运营台` : '校园运营台'
  next()
})

export default router
