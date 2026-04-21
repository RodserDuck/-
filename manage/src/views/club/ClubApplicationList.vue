<template>
  <div class="page">
    <div class="toolbar-row">
      <el-input v-model="keyword" placeholder="申请人昵称/学号/手机号" clearable style="width: 240px" @keyup.enter="onSearch" />
      <el-button type="primary" @click="onSearch">查询</el-button>
    </div>

    <el-table v-loading="loading" :data="rows" stripe style="width: 100%; margin-top: 14px">
      <el-table-column prop="memberId" label="申请ID" width="88" />
      <el-table-column prop="clubId" label="社团ID" width="82" />
      <el-table-column prop="username" label="申请人" width="120" show-overflow-tooltip />
      <el-table-column prop="studentNo" label="学号" width="130" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机号" width="130" show-overflow-tooltip />
      <el-table-column prop="joinTime" label="申请时间" width="170">
        <template #default="{ row }">{{ formatTime(row.joinTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="success" link @click="approve(row)">通过</el-button>
          <el-button type="danger" link @click="reject(row)">驳回</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchClubApplications, approveClubApplication, rejectClubApplication } from '@/api/club'

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
    const page = await fetchClubApplications(
      pageNum.value,
      pageSize.value,
      undefined,
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
  await approveClubApplication(row.memberId)
  ElMessage.success('已通过申请')
  load()
}

async function reject(row) {
  await rejectClubApplication(row.memberId)
  ElMessage.success('已驳回申请')
  load()
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
