<template>
  <div class="image-pick">
    <p class="hint">{{ hint }}</p>
    <div class="grid">
      <div v-for="(url, idx) in modelValue" :key="idx" class="thumb">
        <img :src="displayUrl(url)" alt="" />
        <el-button class="rm" circle size="small" type="danger" @click="remove(idx)">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <el-upload
        v-if="modelValue.length < limit"
        :show-file-list="false"
        :http-request="onRequest"
        :before-upload="beforeUpload"
        accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
      >
        <div class="add-card" :class="{ busy: uploading }">
          <template v-if="!uploading">
            <el-icon :size="22"><Plus /></el-icon>
            <span class="add-label">选择图片</span>
          </template>
          <span v-else class="busy-text">上传中…</span>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Close } from '@element-plus/icons-vue'
import { uploadImage } from '@/api/upload'
import { publicUploadUrl, normalizeUploadPathForDb } from '@/api/utils'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  category: { type: String, default: 'notice' },
  limit: { type: Number, default: 9 },
  hint: {
    type: String,
    default: '可选，支持多张，单张不超过 5MB（jpg/png/gif/webp/bmp）'
  }
})

const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)

function displayUrl(path) {
  return publicUploadUrl(path)
}

function remove(idx) {
  const next = props.modelValue.slice()
  next.splice(idx, 1)
  emit('update:modelValue', next)
}

function beforeUpload(file) {
  const ok = file.size / 1024 / 1024 < 5
  if (!ok) ElMessage.error('单张图片不超过 5MB')
  return ok
}

async function onRequest(options) {
  const { file, onError, onSuccess } = options
  uploading.value = true
  try {
    const data = await uploadImage(file, props.category)
    const url = normalizeUploadPathForDb(data?.url)
    if (!url) throw new Error('未返回图片地址')
    onSuccess(data)
    emit('update:modelValue', [...props.modelValue, url])
  } catch (e) {
    onError(e)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped lang="scss">
.hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--cm-ink-muted);
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.thumb {
  position: relative;
  width: 104px;
  height: 104px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--cm-border);
  background: #f8fafc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .rm {
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0.92;
  }
}

.add-card {
  width: 104px;
  height: 104px;
  border-radius: 12px;
  border: 1px dashed #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #64748b;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: #f8fafc;

  &:hover {
    border-color: var(--cm-accent, #0ea5e9);
    color: #0369a1;
    background: #f0f9ff;
  }

  &.busy {
    cursor: wait;
  }
}

.add-label {
  font-size: 12px;
  font-weight: 500;
}

.busy-text {
  font-size: 12px;
  color: #64748b;
}
</style>
