<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">学院公告</h1>
        <p class="sub">各学院独立公告栏（<code>t_college_notice</code>）</p>
      </div>
      <el-button type="primary" @click="goNew">
        <el-icon class="el-icon--left"><Plus /></el-icon>
        新建
      </el-button>
    </div>

    <el-card shadow="never" class="table-card">
      <div class="filter-row">
        <el-select
          v-model="college"
          clearable
          filterable
          placeholder="学院筛选"
          style="width: 180px"
          @change="onSearch"
        >
          <el-option v-for="c in collegeOptions" :key="c" :label="c" :value="c" />
        </el-select>
        <el-input v-model="keyword" placeholder="标题/正文" clearable style="width: 220px" @keyup.enter="onSearch" />
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="noticeId" label="ID" width="72" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="college" label="学院" width="140" show-overflow-tooltip />
        <el-table-column prop="viewCount" label="浏览" width="80" align="right" />
        <el-table-column prop="status" label="状态" width="88" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '展示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
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
import { fetchCollegeNoticeList, deleteCollegeNotice } from '@/api/collegeNotice'
import { fetchCollegeOptions } from '@/api/college'

const router = useRouter()
const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const college = ref('')
const keyword = ref('')
const collegeOptions = ref([])

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchCollegeNoticeList(
      pageNum.value,
      pageSize.value,
      college.value?.trim() || undefined,
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
  router.push({ name: 'college-notice-edit' })
}

function goEdit(id) {
  router.push({ name: 'college-notice-edit-id', params: { id: String(id) } })
}

function onDelete(row) {
  ElMessageBox.confirm(`确定删除「${row.title}」？`, '删除', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      await deleteCollegeNotice(row.noticeId)
      ElMessage.success('已删除')
      load()
    })
    .catch(() => {})
}

onMounted(load)
onActivated(load)

onMounted(async () => {
  try {
    const list = await fetchCollegeOptions()
    collegeOptions.value = (list || [])
      .filter((it) => it && it.status === 1 && it.name)
      .map((it) => it.name)
  } catch {
    collegeOptions.value = []
  }
})
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
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
