<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">社团</h1>
        <p class="sub">社团列表（可新增/编辑/查看成员，<code>t_club</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-select v-model="category" clearable placeholder="分类" style="width: 140px" @change="onSearch">
          <el-option label="文艺体育" value="文艺体育" />
          <el-option label="科技学术" value="科技学术" />
          <el-option label="公益服务" value="公益服务" />
          <el-option label="兴趣爱好" value="兴趣爱好" />
          <el-option label="创业实践" value="创业实践" />
        </el-select>
        <el-input v-model="keyword" placeholder="名称/简介" clearable style="width: 200px" @keyup.enter="onSearch" />
        <el-button type="primary" plain @click="onCreate">新增社团</el-button>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="clubId" label="ID" width="72" />
        <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="memberCount" label="成员" width="80" align="right" />
        <el-table-column prop="activityCount" label="活动数" width="88" align="right" />
        <el-table-column prop="location" label="地点" width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="88" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="详情" width="80" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="onDetail(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="管理" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="onEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="onMembers(row)">成员</el-button>
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

    <el-drawer v-model="detailVisible" title="社团详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.clubId }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detail.name || '—' }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detail.category || '—' }}</el-descriptions-item>
        <el-descriptions-item label="成员数">{{ detail.memberCount ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="活动数">{{ detail.activityCount ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ detail.location || '—' }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ detail.contact || '—' }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{ detail.description || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-dialog v-model="editVisible" :title="editForm.clubId ? '编辑社团' : '新增社团'" width="640px">
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" placeholder="社团名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="editForm.category" placeholder="如：文艺体育/科技学术…" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="editForm.coverImage" placeholder="如：/uploads/club/club_1.jpg" />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="editForm.location" placeholder="活动地点" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editForm.contact" placeholder="微信/电话…" />
        </el-form-item>
        <el-form-item label="团长用户ID">
          <el-input v-model.number="editForm.leaderId" placeholder="可选：用户表 user_id" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" style="width: 160px">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="editForm.description" type="textarea" :rows="4" placeholder="社团简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="memberVisible" title="社团成员" size="720px">
      <div class="member-toolbar">
        <el-input v-model="memberKeyword" placeholder="昵称/学号/手机号" clearable style="width: 260px" @keyup.enter="loadMembers" />
        <el-button type="primary" @click="loadMembers">查询</el-button>
      </div>
      <el-table v-loading="memberLoading" :data="members" stripe style="width: 100%">
        <el-table-column prop="memberId" label="成员ID" width="88" />
        <el-table-column prop="userId" label="用户ID" width="88" />
        <el-table-column prop="username" label="昵称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="studentNo" label="学号" width="140" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="role" label="角色" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.role === 2 ? 'warning' : row.role === 1 ? 'success' : 'info'">
              {{ row.role === 2 ? '团长' : row.role === 1 ? '管理员' : '成员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" label="加入时间" width="170">
          <template #default="{ row }">{{ formatTime(row.joinTime) }}</template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchClubList, fetchClubDetail, createClub, updateClub, fetchClubMembers } from '@/api/club'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const category = ref('')
const keyword = ref('')
const detailVisible = ref(false)
const detail = ref(null)
const editVisible = ref(false)
const saving = ref(false)
const editForm = ref({})

const memberVisible = ref(false)
const memberLoading = ref(false)
const memberClubId = ref(null)
const members = ref([])
const memberKeyword = ref('')

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchClubList(
      pageNum.value,
      pageSize.value,
      category.value?.trim() || undefined,
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
  detail.value = await fetchClubDetail(row.clubId)
  detailVisible.value = true
}

function onCreate() {
  editForm.value = {
    name: '',
    category: '',
    description: '',
    coverImage: '',
    location: '',
    contact: '',
    leaderId: null,
    status: 1
  }
  editVisible.value = true
}

async function onEdit(row) {
  const d = await fetchClubDetail(row.clubId)
  editForm.value = { ...d }
  editVisible.value = true
}

async function onSave() {
  saving.value = true
  try {
    const form = { ...editForm.value }
    if (form.clubId) {
      await updateClub(form)
      ElMessage.success('已保存')
    } else {
      await createClub(form)
      ElMessage.success('已创建')
    }
    editVisible.value = false
    load()
  } finally {
    saving.value = false
  }
}

async function onMembers(row) {
  memberClubId.value = row.clubId
  memberKeyword.value = ''
  memberVisible.value = true
  await loadMembers()
}

async function loadMembers() {
  if (!memberClubId.value) return
  memberLoading.value = true
  try {
    members.value = await fetchClubMembers(memberClubId.value, memberKeyword.value?.trim() || undefined)
  } finally {
    memberLoading.value = false
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

.member-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
</style>
