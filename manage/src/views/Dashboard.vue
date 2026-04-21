<template>
  <div class="dash">
    <header class="dash-head">
      <h1 class="dash-title">数据概览</h1>
      <p class="dash-desc">实时汇总平台核心数据体量（全库记录数，含逻辑删除策略下的可见数据以接口为准）</p>
    </header>

    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="24" :sm="12" :lg="6" v-for="card in cards" :key="card.key">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: card.tint }">
            <el-icon :size="26"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-body">
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-value">{{ stats[card.key] ?? '—' }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card class="hint-card" shadow="never">
      <template #header>
        <span class="hint-title">快捷操作</span>
      </template>
      <div class="actions">
        <el-button type="primary" @click="$router.push('/notice')">校园公告</el-button>
        <el-button @click="$router.push('/users')">用户</el-button>
        <el-button @click="$router.push('/posts')">帖子</el-button>
        <el-button @click="$router.push('/goods')">闲置</el-button>
        <el-button @click="$router.push('/lost-found')">失物招领</el-button>
        <el-button @click="$router.push('/college-notice')">学院公告</el-button>
        <el-button @click="openApiDoc">API 根路径</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'
import {
  User,
  Document,
  ChatLineRound,
  Goods,
  Search,
  Reading,
  OfficeBuilding,
  Calendar
} from '@element-plus/icons-vue'
import { fetchStats } from '@/api/dashboard'
import { ElMessage } from 'element-plus'

const loading = ref(true)
const stats = ref({})

const cards = [
  { key: 'users', label: '注册用户', icon: markRaw(User), tint: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
  { key: 'posts', label: '帖子', icon: markRaw(ChatLineRound), tint: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' },
  { key: 'notices', label: '校园公告', icon: markRaw(Document), tint: 'linear-gradient(135deg, #cffafe, #a5f3fc)' },
  {
    key: 'collegeNotices',
    label: '学院公告',
    icon: markRaw(Reading),
    tint: 'linear-gradient(135deg, #ede9fe, #ddd6fe)'
  },
  { key: 'goods', label: '闲置商品', icon: markRaw(Goods), tint: 'linear-gradient(135deg, #ecfdf5, #a7f3d0)' },
  { key: 'lostFound', label: '失物招领', icon: markRaw(Search), tint: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  {
    key: 'clubs',
    label: '社团',
    icon: markRaw(OfficeBuilding),
    tint: 'linear-gradient(135deg, #fce7f3, #fbcfe8)'
  },
  {
    key: 'activities',
    label: '活动',
    icon: markRaw(Calendar),
    tint: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)'
  }
]

onMounted(async () => {
  try {
    stats.value = await fetchStats()
  } catch {
    ElMessage.warning('统计数据加载失败，请检查是否已登录管理员账号')
  } finally {
    loading.value = false
  }
})

function openApiDoc() {
  ElMessage.info('后端服务：http://localhost:8080/api')
}
</script>

<style scoped lang="scss">
.dash-head {
  margin-bottom: 28px;
}

.dash-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  font-style: italic;
  margin: 0 0 8px;
  color: var(--cm-ink);
}

.dash-desc {
  margin: 0;
  font-size: 14px;
  color: var(--cm-ink-muted);
  max-width: 640px;
  line-height: 1.6;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 20px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--cm-border);
  margin-bottom: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0369a1;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--cm-ink-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--cm-ink);
  letter-spacing: -0.02em;
}

.hint-card {
  margin-top: 12px;
  border-radius: 16px;
  border: 1px solid var(--cm-border);
}

.hint-title {
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
