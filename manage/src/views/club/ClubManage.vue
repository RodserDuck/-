<template>
  <div class="page">
    <div class="toolbar">
      <div>
        <h1 class="title">社团管理</h1>
        <p class="sub">在同一页面查看社团与社团活动，按页签细分管理内容</p>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-tabs v-model="tab">
        <el-tab-pane label="社团列表" name="club">
          <ClubList />
        </el-tab-pane>
        <el-tab-pane label="社团活动" name="activity">
          <ActivityList />
        </el-tab-pane>
        <el-tab-pane label="入团申请" name="apply">
          <ClubApplicationList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClubList from '@/views/club/ClubList.vue'
import ActivityList from '@/views/activity/ActivityList.vue'
import ClubApplicationList from '@/views/club/ClubApplicationList.vue'

const tab = ref('club')
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
