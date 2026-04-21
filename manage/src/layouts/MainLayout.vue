<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true" />
        <div class="brand-text">
          <span class="brand-title">Campus</span>
          <span class="brand-sub">运营控制台</span>
        </div>
      </div>
      <el-menu
        :default-active="active"
        class="side-menu"
        background-color="transparent"
        text-color="#cbd5e1"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/notice">
          <el-icon><Document /></el-icon>
          <span>校园公告</span>
        </el-menu-item>
        <el-menu-item index="/college-notice">
          <el-icon><Reading /></el-icon>
          <span>学院公告</span>
        </el-menu-item>
        <el-menu-item index="/posts">
          <el-icon><ChatLineRound /></el-icon>
          <span>帖子管理</span>
        </el-menu-item>
        <el-menu-item index="/trade">
          <el-icon><Goods /></el-icon>
          <span>二手交易</span>
        </el-menu-item>
        <el-menu-item index="/lost-found">
          <el-icon><Search /></el-icon>
          <span>失物招领</span>
        </el-menu-item>
        <el-menu-item index="/club-manage">
          <el-icon><OfficeBuilding /></el-icon>
          <span>社团管理</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-foot">
        <span class="muted">九江学院 · 校园生活服务平台</span>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="crumb">
          <span class="crumb-dot" />
          <span class="crumb-text">{{ title }}</span>
        </div>
        <div class="topbar-right">
          <span class="who">{{ auth.name || auth.username }}</span>
          <el-button type="primary" link @click="onLogout">退出</el-button>
        </div>
      </header>
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Odometer,
  Document,
  User,
  Reading,
  ChatLineRound,
  Goods,
  Search,
  OfficeBuilding
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const active = computed(() => {
  const p = route.path
  if (p.startsWith('/notice')) return '/notice'
  if (p.startsWith('/college-notice')) return '/college-notice'
  if (p.startsWith('/club-manage') || p.startsWith('/activities')) return '/club-manage'
  return p
})

const title = computed(() => route.meta.title || '概览')

function onLogout() {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<style scoped lang="scss">
.shell {
  display: flex;
  min-height: 100vh;
  background: var(--cm-bg);
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #0a1628 0%, var(--cm-sidebar) 40%, #0f2744 100%);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 8px 0 32px rgba(15, 23, 42, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px 22px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 30%, #38bdf8, #0369a1);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-style: italic;
  letter-spacing: 0.02em;
  color: #fff;
}

.brand-sub {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.side-menu {
  flex: 1;
  padding: 12px 10px;
}

.side-menu :deep(.el-menu-item) {
  border-radius: 10px;
  margin-bottom: 6px;
  font-weight: 500;
}

.side-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.25), transparent) !important;
  border-left: 3px solid #38bdf8;
}

.sidebar-foot {
  padding: 16px 18px 24px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--cm-border);
}

.crumb {
  display: flex;
  align-items: center;
  gap: 10px;
}

.crumb-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cm-accent);
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
}

.crumb-text {
  font-weight: 600;
  font-size: 15px;
  color: var(--cm-ink);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.who {
  font-size: 13px;
  color: var(--cm-ink-muted);
}

.content {
  flex: 1;
  padding: 24px 28px 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
