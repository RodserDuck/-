<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">用户管理</h1>
        <p class="sub">分页查询注册用户，可禁用/启用账号（<code>t_user</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="用户名 / 学号 / 学院 / 手机"
          clearable
          style="width: 260px"
          @keyup.enter="onSearch"
        />
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="userId" label="ID" width="72" />
        <el-table-column prop="username" label="昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="studentNo" label="学号" width="130" show-overflow-tooltip />
        <el-table-column prop="college" label="学院" min-width="140" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 1"
              type="danger"
              link
              @click="toggleStatus(row, 0)"
            >
              禁用
            </el-button>
            <el-button v-else type="success" link @click="toggleStatus(row, 1)">启用</el-button>
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
import { ElMessageBox, ElMessage } from 'element-plus'
import { fetchUserList, updateUserStatus } from '@/api/user'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const keyword = ref('')

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchUserList(pageNum.value, pageSize.value, keyword.value?.trim() || undefined)
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

function toggleStatus(row, status) {
  const tip = status === 0 ? `确定禁用用户「${row.username || row.userId}」？` : '确定启用该用户？'
  ElMessageBox.confirm(tip, '确认', { type: status === 0 ? 'warning' : 'info' })
    .then(async () => {
      await updateUserStatus(row.userId, status)
      ElMessage.success(status === 0 ? '已禁用' : '已启用')
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
</style>
