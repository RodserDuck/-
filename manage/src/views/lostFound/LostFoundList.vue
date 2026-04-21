<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">失物招领</h1>
        <p class="sub">类型 1 寻物 / 2 招领；状态 0 关闭 / 1 进行中 / 2 已找到（<code>t_lost_found</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-select v-model="filterType" placeholder="类型" clearable style="width: 120px" @change="onSearch">
          <el-option label="寻物" :value="1" />
          <el-option label="招领" :value="2" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px" @change="onSearch">
          <el-option label="关闭" :value="0" />
          <el-option label="进行中" :value="1" />
          <el-option label="已找到" :value="2" />
        </el-select>
        <el-input v-model="keyword" placeholder="标题/物品/描述" clearable style="width: 200px" @keyup.enter="onSearch" />
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="lostFoundId" label="ID" width="72" />
        <el-table-column prop="type" label="类型" width="88">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.type === 2 ? '招领' : '寻物' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="location" label="地点" width="120" show-overflow-tooltip />
        <el-table-column prop="viewCount" label="浏览" width="72" align="right" />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-select
              :model-value="row.status"
              size="small"
              style="width: 110px"
              @change="(v) => onStatusChange(row, v)"
            >
              <el-option :value="0" label="关闭" />
              <el-option :value="1" label="进行中" />
              <el-option :value="2" label="已找到" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
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
import { ElMessage } from 'element-plus'
import { fetchLostFoundList, updateLostFoundStatus } from '@/api/lostFound'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const filterType = ref(null)
const filterStatus = ref(null)

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchLostFoundList(
      pageNum.value,
      pageSize.value,
      filterType.value,
      filterStatus.value,
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

async function onStatusChange(row, status) {
  try {
    await updateLostFoundStatus(row.lostFoundId, status)
    row.status = status
    ElMessage.success('状态已更新')
  } catch {
    load()
  }
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
</style>
