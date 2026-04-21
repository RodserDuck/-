<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">闲置商品</h1>
        <p class="sub">管理二手商品展示状态（下架为 <code>status=0</code>）</p>
      </div>
      <div class="toolbar-row">
        <el-input v-model="keyword" placeholder="标题/描述" clearable style="width: 220px" @keyup.enter="onSearch" />
        <el-input
          v-model="userKeyword"
          placeholder="卖家昵称/学号/手机号"
          clearable
          style="width: 200px"
          @keyup.enter="onSearch"
        />
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="rows" stripe style="width: 100%">
        <el-table-column prop="itemId" label="ID" width="72" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sellerName" label="卖家" width="110" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="100" align="right">
          <template #default="{ row }">
            {{ row.price != null ? `¥${row.price}` : '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="80" align="right" />
        <el-table-column prop="status" label="状态" width="88" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '在售' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="170">
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

    <el-drawer v-model="detailVisible" title="商品详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.itemId }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ detail.title || '—' }}</el-descriptions-item>
        <el-descriptions-item label="卖家">{{ detail.sellerName || '—' }}</el-descriptions-item>
        <el-descriptions-item label="价格">{{ detail.price != null ? `¥${detail.price}` : '—' }}</el-descriptions-item>
        <el-descriptions-item label="分类ID">{{ detail.categoryId ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detail.status === 1 ? '在售' : detail.status === 2 ? '已售出' : '下架' }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ detail.tradeLocation || '—' }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ detail.contact || '—' }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ detail.description || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { fetchGoodsList, deleteGoods, fetchGoodsDetail } from '@/api/goods'

const loading = ref(false)
const rows = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
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
    const page = await fetchGoodsList(
      pageNum.value,
      pageSize.value,
      undefined,
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
  ElMessageBox.confirm(`确定下架「${row.title}」？`, '下架商品', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      await deleteGoods(row.itemId)
      ElMessage.success('已下架')
      load()
    })
    .catch(() => {})
}

async function onDetail(row) {
  detail.value = await fetchGoodsDetail(row.itemId)
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
