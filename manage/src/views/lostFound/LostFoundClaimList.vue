<template>
  <div class="page">
    <div class="toolbar-row">
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px" @change="onSearch">
        <el-option label="待处理" :value="0" />
        <el-option label="已匹配" :value="1" />
        <el-option label="已驳回" :value="2" />
      </el-select>
      <el-input v-model="keyword" placeholder="标题/物品/描述" clearable style="width: 220px" @keyup.enter="onSearch" />
      <el-button type="primary" @click="onSearch">查询</el-button>
    </div>

    <el-table v-loading="loading" :data="rows" stripe style="width: 100%; margin-top: 14px">
      <el-table-column prop="claimId" label="记录ID" width="82" />
      <el-table-column prop="lostFoundId" label="来源ID" width="82" />
      <el-table-column prop="type" label="类型" width="88">
        <template #default="{ row }">
          <el-tag size="small" type="info">{{ row.type === 2 ? '招领' : '寻物' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publisherName" label="发布者" width="120" show-overflow-tooltip />
      <el-table-column prop="claimantName" label="认领者" width="120" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'" size="small">
            {{ row.status === 0 ? '待处理' : row.status === 1 ? '已匹配' : '已驳回' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="claimTime" label="认领时间" width="170">
        <template #default="{ row }">{{ formatTime(row.claimTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <template v-if="row.status === 0">
            <el-button type="success" link @click="approve(row)">通过</el-button>
            <el-button type="danger" link @click="reject(row)">驳回</el-button>
          </template>
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

    <el-drawer v-model="detailVisible" title="招领详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="记录ID">{{ detail.claimId }}</el-descriptions-item>
        <el-descriptions-item label="来源ID">{{ detail.lostFoundId }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.type === 2 ? '招领' : '寻物' }}</el-descriptions-item>
        <el-descriptions-item label="发布者">{{ detail.publisherName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="认领者">{{ detail.claimantName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ detail.status === 0 ? '待处理' : detail.status === 1 ? '已匹配' : '已驳回' }}
        </el-descriptions-item>
        <el-descriptions-item label="认领时间">{{ formatTime(detail.claimTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detail.remark || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import {
  fetchLostFoundClaimList,
  fetchLostFoundClaimDetail,
  approveLostFoundClaim,
  rejectLostFoundClaim
} from '@/api/lostFoundClaim'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const keyword = ref('')
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
    const page = await fetchLostFoundClaimList(
      pageNum.value,
      pageSize.value,
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

async function approve(row) {
  await approveLostFoundClaim(row.claimId)
  ElMessage.success('已通过')
  load()
}

async function reject(row) {
  await rejectLostFoundClaim(row.claimId)
  ElMessage.success('已驳回')
  load()
}

async function onDetail(row) {
  detail.value = await fetchLostFoundClaimDetail(row.claimId)
  detailVisible.value = true
}

onMounted(load)
onActivated(load)
</script>

<style scoped lang="scss">
.toolbar-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.pager {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}
</style>
