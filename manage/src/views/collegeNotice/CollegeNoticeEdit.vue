<template>
  <div class="page">
    <div class="head">
      <el-button text @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="title">{{ isNew ? '新建学院公告' : '编辑学院公告' }}</h1>
    </div>

    <el-card v-loading="loading" shadow="never" class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="200" show-word-limit placeholder="标题" />
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="form.college" maxlength="100" placeholder="例如：计算机学院" />
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">展示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="正文" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="12" placeholder="正文" />
        </el-form-item>
        <el-form-item label="配图 JSON（可选）">
          <el-input v-model="form.images" type="textarea" :rows="2" placeholder='例如 ["https://..."]' />
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
import { fetchCollegeNoticeDetail, saveCollegeNotice } from '@/api/collegeNotice'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const saving = ref(false)

const isNew = computed(() => !route.params.id)

const form = reactive({
  noticeId: null,
  title: '',
  content: '',
  college: '',
  images: '',
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入正文', trigger: 'blur' }],
  college: [{ required: true, message: '请输入学院', trigger: 'blur' }]
}

onMounted(async () => {
  if (isNew.value) return
  loading.value = true
  try {
    const id = route.params.id
    const n = await fetchCollegeNoticeDetail(id)
    form.noticeId = n.noticeId
    form.title = n.title || ''
    form.content = n.content || ''
    form.college = n.college || ''
    form.images = n.images || ''
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
      college: form.college,
      status: form.status
    }
    if (form.images && form.images.trim()) payload.images = form.images.trim()
    await saveCollegeNotice(payload)
    ElMessage.success('已保存')
    router.push({ name: 'college-notice-list' })
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
