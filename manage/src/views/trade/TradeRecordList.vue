<template>
  <div class="page">
    <div class="toolbar-row">
      <el-select v-model="status" clearable placeholder="交易状态" style="width: 140px" @change="onSearch">
        <el-option label="待确认" :value="0" />
        <el-option label="已完成" :value="1" />
        <el-option label="已取消" :value="2" />
      </el-select>
      <el-input v-model="keyword" placeholder="商品标题" clearable style="width: 200px" @keyup.enter="onSearch" />
      <el-input
        v-model="userKeyword"
        placeholder="买家/卖家昵称/学号/手机号"
        clearable
        style="width: 240px"
        @keyup.enter="onSearch"
      />
      <el-button type="primary" @click="onSearch">查询</el-button>
    </div>

    <el-table v-loading="loading" :data="rows" stripe style="width: 100%; margin-top: 14px">
      <el-table-column prop="recordId" label="记录ID" width="88" />
      <el-table-column prop="itemTitle" label="商品标题" min-width="180" show-overflow-tooltip />
      <el-table-column prop="price" label="成交价" width="100" align="right">
        <template #default="{ row }">
          {{ row.price != null ? `¥${row.price}` : '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="buyerName" label="买家" width="120" show-overflow-tooltip />
      <el-table-column prop="sellerName" label="卖家" width="120" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="140" align="center">
        <template #default="{ row }">
          <el-select :model-value="row.status" size="small" style="width: 118px" @change="(v) => onStatusChange(row, v)">
            <el-option :value="0" label="待确认" />
            <el-option :value="1" label="已完成" />
            <el-option :value="2" label="已取消" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="留言" min-width="180" show-overflow-tooltip />
      <el-table-column prop="createTime" label="发起时间" width="170">
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

    <el-drawer v-model="detailVisible" title="交易详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="记录ID">{{ detail.recordId }}</el-descriptions-item>
        <el-descriptions-item label="商品ID">{{ detail.itemId }}</el-descriptions-item>
        <el-descriptions-item label="商品标题">{{ detail.itemTitle || '—' }}</el-descriptions-item>
        <el-descriptions-item label="买家">{{ detail.buyerName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="卖家">{{ detail.sellerName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="价格">{{ detail.price != null ? `¥${detail.price}` : '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ detail.status === 0 ? '待确认' : detail.status === 1 ? '已完成' : '已取消' }}
        </el-descriptions-item>
        <el-descriptions-item label="留言">{{ detail.remark || '—' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatTime(detail.createTime) }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchTradeRecordList, updateTradeStatus } from '@/api/tradeAdmin'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const status = ref(null)
const keyword = ref('')
const userKeyword = ref('')
const detailVisible = ref(false)
const detail = ref(null)

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchTradeRecordList(
      pageNum.value,
      pageSize.value,
      status.value,
      keyword.value?.trim() || undefined,
      userKeyword.value?.trim() || undefined
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

async function onStatusChange(row, next) {
  try {
    await updateTradeStatus(row.recordId, next)
    row.status = next
    ElMessage.success('状态已更新')
  } catch {
    load()
  }
}

function onDetail(row) {
  detail.value = row
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
