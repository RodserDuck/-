<template>
  <div class="page">
    <div class="head">
      <el-button text @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="title">{{ isNew ? '新建公告' : '编辑公告' }}</h1>
    </div>

    <el-card v-loading="loading" shadow="never" class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="200" show-word-limit placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="选择类型" style="width: 240px">
            <el-option label="系统通知" value="SYSTEM" />
            <el-option label="全校通知" value="ALL" />
            <el-option label="学院通知" value="COLLEGE" />
          </el-select>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="置顶">
              <el-switch v-model="form.isTop" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="正文" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="12" placeholder="公告正文" />
        </el-form-item>
        <el-form-item label="配图（可选）">
          <ImagePickList v-model="imageUrls" category="notice" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { fetchNoticeDetail, saveNotice } from '@/api/notice'
import { parseImagesField, normalizeImagePathsForDb } from '@/api/utils'
import ImagePickList from '@/components/ImagePickList.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const saving = ref(false)

const isNew = computed(() => !route.params.id)

const imageUrls = ref([])

const form = reactive({
  noticeId: null,
  title: '',
  content: '',
  type: 'ALL',
  isTop: 0,
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入正文', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

onMounted(async () => {
  if (isNew.value) return
  loading.value = true
  try {
    const id = route.params.id
    const n = await fetchNoticeDetail(id)
    form.noticeId = n.noticeId
    form.title = n.title || ''
    form.content = n.content || ''
    form.type = n.type || 'ALL'
    imageUrls.value = parseImagesField(n.images)
    form.isTop = n.isTop ?? 0
    form.status = n.status ?? 1
  } catch {
    router.back()
  } finally {
    loading.value = false
  }
})

async function submit() {
  await formRef.value?.validate().catch(() => {
    throw new Error('validation')
  })
  saving.value = true
  try {
    const payload = {
      noticeId: form.noticeId || undefined,
      title: form.title,
      content: form.content,
      type: form.type,
      isTop: form.isTop,
      status: form.status
    }
    if (imageUrls.value.length) {
      payload.images = JSON.stringify(normalizeImagePathsForDb(imageUrls.value))
    }
    await saveNotice(payload)
    ElMessage.success('已保存')
    router.push({ name: 'notice-list' })
  } catch (e) {
    if (e.message !== 'validation') {
      /* 全局已提示 */
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.page {
  max-width: 880px;
}

.head {
  margin-bottom: 20px;
}

.title {
  font-family: var(--font-display);
  font-size: 26px;
  font-style: italic;
  margin: 12px 0 0;
  color: var(--cm-ink);
}

.form-card {
  border-radius: 16px;
  border: 1px solid var(--cm-border);
}
</style>
