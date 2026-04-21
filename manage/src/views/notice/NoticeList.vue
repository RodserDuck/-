<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">校园公告</h1>
        <p class="sub">数据表 <code>t_notice</code> · 前台首页轮播与通知栏同步展示</p>
      </div>
      <div class="toolbar-row">
        <el-select v-model="type" clearable placeholder="类型" style="width: 140px" @change="onSearch">
          <el-option label="系统通知" value="SYSTEM" />
          <el-option label="全校通知" value="ALL" />
          <el-option label="学院通知" value="COLLEGE" />
        </el-select>
        <el-input v-model="keyword" clearable placeholder="标题/正文" style="width: 200px" @keyup.enter="onSearch" />
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="goNew">
          <el-icon class="el-icon--left"><Plus /></el-icon>
          新建公告
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="noticeId" label="ID" width="72" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="110">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ typeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isTop" label="置顶" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isTop === 1" type="warning" size="small">置顶</el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="88" align="right" />
        <el-table-column prop="status" label="状态" width="88" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="170">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="goEdit(row.noticeId)">编辑</el-button>
            <el-button type="danger" link @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="onPage"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { fetchNoticeList, deleteNotice } from '@/api/notice'

const router = useRouter()
const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const type = ref('')
const keyword = ref('')

function typeLabel(t) {
  const m = { SYSTEM: '系统', ALL: '全校', COLLEGE: '学院' }
  return m[t] || t || '—'
}

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchNoticeList(
      pageNum.value,
      pageSize.value,
      type.value?.trim() || undefined,
      keyword.value?.trim() || undefined
    )
    rows.value = page.records || []
    total.value = page.total || 0
  } finally {
    loading.value = false
  }
}

function onPage(p) {
  pageNum.value = p
  load()
}

function onSearch() {
  pageNum.value = 1
  load()
}

function goNew() {
  router.push({ name: 'notice-edit' })
}

function goEdit(id) {
  router.push({ name: 'notice-edit-id', params: { id: String(id) } })
}

function onDelete(row) {
  ElMessageBox.confirm(`确定删除「${row.title}」？`, '删除公告', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      await deleteNotice(row.noticeId)
      ElMessage.success('已删除')
      load()
    })
    .catch(() => {})
}

onMounted(load)
onActivated(load)
</script>

<style scoped lang="scss">
.page {
  max-width: 1200px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.toolbar-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.title {
  font-family: var(--font-display);
  font-size: 26px;
  font-style: italic;
  margin: 0 0 6px;
  color: var(--cm-ink);
}

.sub {
  margin: 0;
  font-size: 13px;
  color: var(--cm-ink-muted);
  code {
    font-size: 12px;
    background: #e0f2fe;
    padding: 2px 8px;
    border-radius: 6px;
    color: #0369a1;
  }
}

.table-card {
  border-radius: 16px;
  border: 1px solid var(--cm-border);
}

.pager {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

.muted {
  color: #cbd5e1;
}
</style>
