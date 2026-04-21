<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">失物招领</h1>
        <p class="sub">类型 1 寻物 / 2 招领；状态 0 待处理 / 1 进行中 / 2 已找到（<code>t_lost_found</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-select v-model="filterType" placeholder="类型" clearable style="width: 120px" @change="onSearch">
          <el-option label="寻物" :value="1" />
          <el-option label="招领" :value="2" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px" @change="onSearch">
          <el-option label="待处理" :value="0" />
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
            <el-tag :type="row.status === 2 ? 'success' : row.status === 1 ? 'warning' : 'info'" size="small">
              {{ row.status === 0 ? '待处理' : row.status === 1 ? '进行中' : '已找到' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="详情" width="80" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="onDetail(row)">查看</el-button>
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

    <el-drawer v-model="detailVisible" title="记录详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.lostFoundId }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.type === 2 ? '招领' : '寻物' }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ detail.title || '—' }}</el-descriptions-item>
        <el-descriptions-item label="物品">{{ detail.itemName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ detail.location || '—' }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ detail.contact || '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ detail.status === 0 ? '待处理' : detail.status === 1 ? '进行中' : '已找到' }}
        </el-descriptions-item>
        <el-descriptions-item label="描述">{{ detail.description || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { fetchLostFoundList, fetchLostFoundDetail } from '@/api/lostFound'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const filterType = ref(null)
const filterStatus = ref(null)
const detailVisible = ref(false)
const detail = ref(null)

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

async function onDetail(row) {
  detail.value = await fetchLostFoundDetail(row.lostFoundId)
  detailVisible.value = true
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
