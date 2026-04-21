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
      },
      {
        path: 'users',
        name: 'user-list',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'posts',
        name: 'post-list',
        component: () => import('@/views/post/PostList.vue'),
        meta: { title: '帖子管理' }
      },
      {
        path: 'goods',
        name: 'goods-list',
        component: () => import('@/views/goods/GoodsList.vue'),
        meta: { title: '闲置商品' }
      },
      {
        path: 'lost-found',
        name: 'lost-found-list',
        component: () => import('@/views/lostFound/LostFoundList.vue'),
        meta: { title: '失物招领' }
      },
      {
        path: 'college-notice',
        name: 'college-notice-list',
        component: () => import('@/views/collegeNotice/CollegeNoticeList.vue'),
        meta: { title: '学院公告' }
      },
      {
        path: 'college-notice/edit',
        name: 'college-notice-edit',
        component: () => import('@/views/collegeNotice/CollegeNoticeEdit.vue'),
        meta: { title: '编辑学院公告' }
      },
      {
        path: 'college-notice/edit/:id',
        name: 'college-notice-edit-id',
        component: () => import('@/views/collegeNotice/CollegeNoticeEdit.vue'),
        meta: { title: '编辑学院公告' }
      },
      {
        path: 'clubs',
        name: 'club-list',
        component: () => import('@/views/club/ClubList.vue'),
        meta: { title: '社团' }
      },
      {
        path: 'activities',
        name: 'activity-list',
        component: () => import('@/views/activity/ActivityList.vue'),
        meta: { title: '活动' }
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
