<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">失物招领管理</h1>
        <p class="sub">支持失物招领详情查看，并新增招领记录专项管理</p>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-tabs v-model="tab">
        <el-tab-pane label="失物招领" name="all">
          <LostFoundList />
        </el-tab-pane>
        <el-tab-pane label="招领记录" name="claim">
          <LostFoundClaimList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LostFoundList from '@/views/lostFound/LostFoundList.vue'
import LostFoundClaimList from '@/views/lostFound/LostFoundClaimList.vue'

const tab = ref('all')
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
}

.table-card {
  border-radius: 16px;
  border: 1px solid var(--cm-border);
}
</style>
