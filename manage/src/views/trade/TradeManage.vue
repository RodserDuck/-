<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">二手交易</h1>
        <p class="sub">包含商品管理与交易记录管理，统一在本模块维护</p>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-tabs v-model="tab">
        <el-tab-pane label="商品管理" name="goods">
          <GoodsList />
        </el-tab-pane>
        <el-tab-pane label="交易记录" name="records">
          <TradeRecordList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GoodsList from '@/views/goods/GoodsList.vue'
import TradeRecordList from '@/views/trade/TradeRecordList.vue'

const tab = ref('goods')
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
