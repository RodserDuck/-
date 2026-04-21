<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">活动</h1>
        <p class="sub">社团活动列表（可新增/编辑/删除，<code>t_activity</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-input v-model="keyword" placeholder="标题/描述" clearable style="width: 220px" @keyup.enter="onSearch" />
        <el-button type="primary" plain @click="onCreate">新增活动</el-button>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="activityId" label="ID" width="72" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="clubId" label="社团ID" width="88" align="right" />
        <el-table-column prop="location" label="地点" width="120" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始" width="170">
          <template #default="{ row }">{{ formatTime(row.startTime) }}</template>
        </el-table-column>
        <el-table-column prop="currentParticipants" label="报名" width="72" align="right" />
        <el-table-column prop="maxParticipants" label="上限" width="72" align="right" />
        <el-table-column prop="status" label="状态" width="88" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="详情" width="80" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="onDetail(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="管理" width="170" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="onEdit(row)">编辑</el-button>
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

    <el-drawer v-model="detailVisible" title="活动详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.activityId }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ detail.title || '—' }}</el-descriptions-item>
        <el-descriptions-item label="社团ID">{{ detail.clubId ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ detail.location || '—' }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formatTime(detail.startTime) }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formatTime(detail.endTime) }}</el-descriptions-item>
        <el-descriptions-item label="报名人数">{{ detail.currentParticipants ?? 0 }}/{{ detail.maxParticipants ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ detail.contact || '—' }}</el-descriptions-item>
        <el-descriptions-item label="主办方">{{ detail.organizer || '—' }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ detail.description || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-dialog v-model="editVisible" :title="editForm.activityId ? '编辑活动' : '新增活动'" width="680px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" placeholder="活动标题" />
        </el-form-item>
        <el-form-item label="社团ID">
          <el-input v-model.number="editForm.clubId" placeholder="所属社团 club_id" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="editForm.coverImage" placeholder="如：/uploads/activity/activity_1.jpg" />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="editForm.location" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="editForm.startTime" placeholder="YYYY-MM-DD HH:mm:ss 或 2026-04-21T10:00:00" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="editForm.endTime" placeholder="YYYY-MM-DD HH:mm:ss 或 2026-04-21T12:00:00" />
        </el-form-item>
        <el-form-item label="人数上限">
          <el-input v-model.number="editForm.maxParticipants" />
        </el-form-item>
        <el-form-item label="社团外上限">
          <el-input v-model.number="editForm.outsiderLimit" placeholder="0=不限制" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="editForm.contact" />
        </el-form-item>
        <el-form-item label="主办方">
          <el-input v-model="editForm.organizer" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" style="width: 160px">
            <el-option label="草稿" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="结束" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { fetchActivityList, fetchActivityDetail, createActivity, updateActivity, deleteActivity } from '@/api/activity'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const detailVisible = ref(false)
const detail = ref(null)
const editVisible = ref(false)
const saving = ref(false)
const editForm = ref({})

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

function statusLabel(s) {
  const m = { 0: '草稿', 1: '进行中', 2: '结束' }
  return m[s] ?? s ?? '—'
}

async function load() {
  loading.value = true
  try {
    const page = await fetchActivityList(pageNum.value, pageSize.value, keyword.value?.trim() || undefined)
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
  detail.value = await fetchActivityDetail(row.activityId)
  detailVisible.value = true
}

function onCreate() {
  editForm.value = {
    clubId: null,
    title: '',
    description: '',
    coverImage: '',
    maxParticipants: 0,
    currentParticipants: 0,
    outsiderLimit: 0,
    location: '',
    startTime: '',
    endTime: '',
    contact: '',
    organizer: '',
    status: 1
  }
  editVisible.value = true
}

async function onEdit(row) {
  const d = await fetchActivityDetail(row.activityId)
  editForm.value = { ...d }
  editVisible.value = true
}

async function onSave() {
  saving.value = true
  try {
    const form = { ...editForm.value }
    if (typeof form.startTime === 'string' && form.startTime.includes(' ') && !form.startTime.includes('T')) {
      form.startTime = form.startTime.replace(' ', 'T')
    }
    if (typeof form.endTime === 'string' && form.endTime.includes(' ') && !form.endTime.includes('T')) {
      form.endTime = form.endTime.replace(' ', 'T')
    }
    if (form.activityId) {
      await updateActivity(form)
      ElMessage.success('已保存')
    } else {
      await createActivity(form)
      ElMessage.success('已创建')
    }
    editVisible.value = false
    load()
  } finally {
    saving.value = false
  }
}

function onDelete(row) {
  ElMessageBox.confirm(`确定删除活动「${row.title}」？`, '删除活动', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      await deleteActivity(row.activityId)
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
