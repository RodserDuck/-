<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">帖子管理</h1>
        <p class="sub">审核与下架违规帖子（管理员删除为下架，<code>status=0</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-select v-model="category" clearable placeholder="分类" style="width: 160px" @change="onSearch">
          <el-option label="校园生活" value="校园生活" />
          <el-option label="日常分享" value="日常分享" />
          <el-option label="学习交流" value="学习交流" />
          <el-option label="活动招募" value="活动招募" />
        </el-select>
        <el-input v-model="keyword" placeholder="标题/正文关键词" clearable style="width: 200px" @keyup.enter="onSearch" />
        <el-input
          v-model="userKeyword"
          placeholder="作者昵称/学号/手机号"
          clearable
          style="width: 200px"
          @keyup.enter="onSearch"
        />
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="postId" label="ID" width="72" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="nickname" label="作者" width="110" show-overflow-tooltip />
        <el-table-column prop="viewCount" label="浏览" width="80" align="right" />
        <el-table-column prop="status" label="状态" width="88" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '展示' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="132" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="onDetail(row)">详情</el-button>
            <el-button type="danger" link :disabled="row.status !== 1" @click="onDelete(row)">下架</el-button>
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

    <el-drawer v-model="detailVisible" title="帖子详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.postId }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ detail.title || '—' }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ detail.nickname || '—' }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detail.category || '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detail.status === 1 ? '展示' : '下架' }}</el-descriptions-item>
        <el-descriptions-item label="浏览">{{ detail.viewCount ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="点赞">{{ detail.likeCount ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="评论">{{ detail.commentCount ?? 0 }}</el-descriptions-item>
        <el-descriptions-item label="内容">{{ detail.content || '—' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">评论管理</el-divider>
      <div class="comment-toolbar">
        <el-input v-model="commentKeyword" placeholder="评论内容关键词" clearable style="width: 200px" @keyup.enter="loadComments" />
        <el-input v-model="commentUserKeyword" placeholder="评论者昵称/学号/手机号" clearable style="width: 220px" @keyup.enter="loadComments" />
        <el-button type="primary" @click="loadComments">查询</el-button>
      </div>

      <el-table v-loading="commentLoading" :data="commentRows" stripe style="width: 100%">
        <el-table-column prop="commentId" label="ID" width="72" />
        <el-table-column prop="nickname" label="评论者" width="110" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="220" show-overflow-tooltip />
        <el-table-column prop="createTime" label="时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button type="danger" link @click="onDeleteComment(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager" v-if="commentTotal">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="commentTotal"
          :page-size="commentPageSize"
          :current-page="commentPageNum"
          @current-change="onCommentPage"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { fetchPostList, deletePost, fetchPostDetail } from '@/api/post'
import { fetchCommentList, deleteComment } from '@/api/comment'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const category = ref('')
const keyword = ref('')
const userKeyword = ref('')
const detailVisible = ref(false)
const detail = ref(null)

const commentLoading = ref(false)
const commentRows = ref([])
const commentTotal = ref(0)
const commentPageNum = ref(1)
const commentPageSize = ref(10)
const commentKeyword = ref('')
const commentUserKeyword = ref('')

function formatTime(t) {
  if (!t) return '—'
  return String(t).replace('T', ' ').slice(0, 19)
}

async function load() {
  loading.value = true
  try {
    const page = await fetchPostList(
      pageNum.value,
      pageSize.value,
      category.value?.trim() || undefined,
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

function onDelete(row) {
  ElMessageBox.confirm(`确定下架「${row.title}」？`, '下架帖子', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      await deletePost(row.postId)
      ElMessage.success('已下架')
      load()
    })
    .catch(() => {})
}

async function onDetail(row) {
  detail.value = await fetchPostDetail(row.postId)
  detailVisible.value = true
  commentPageNum.value = 1
  commentKeyword.value = ''
  commentUserKeyword.value = ''
  loadComments()
}

async function loadComments() {
  if (!detail.value?.postId) return
  commentLoading.value = true
  try {
    const page = await fetchCommentList(
      commentPageNum.value,
      commentPageSize.value,
      detail.value.postId,
      commentKeyword.value?.trim() || undefined,
      commentUserKeyword.value?.trim() || undefined
    )
    commentRows.value = page.records || []
    commentTotal.value = page.total || 0
  } finally {
    commentLoading.value = false
  }
}

function onCommentPage(p) {
  commentPageNum.value = p
  loadComments()
}

function onDeleteComment(row) {
  ElMessageBox.confirm('确定删除该评论？（将同时删除其子评论）', '删除评论', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      await deleteComment(row.commentId)
      ElMessage.success('已删除')
      loadComments()
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

.comment-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 12px 0 10px;
  flex-wrap: wrap;
}
</style>
