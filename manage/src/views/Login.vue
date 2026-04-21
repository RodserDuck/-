<template>
  <div class="login-page">
    <div class="hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="hero-glow" />
      <div class="hero-copy">
        <p class="eyebrow">Campus Operations</p>
        <h1 class="headline">
          以清晰与秩序，<br />
          <em>服务校园每一天</em>
        </h1>
        <p class="lede">
          蓝白之境 · 数据与公告一体管理。本台对接校园生活服务平台后端，仅供授权管理员使用。
        </p>
      </div>
    </div>

    <div class="panel">
      <div class="card">
        <h2 class="card-title">管理员登录</h2>
        <p class="card-sub">使用后台账号进入控制台</p>
        <el-form ref="formRef" :model="form" :rules="rules" class="form" @submit.prevent="onSubmit">
          <el-form-item prop="username">
            <el-input v-model="form.username" size="large" placeholder="用户名" autocomplete="username" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              placeholder="密码"
              show-password
              autocomplete="current-password"
              @keyup.enter="onSubmit"
            />
          </el-form-item>
          <el-button type="primary" size="large" class="submit" :loading="loading" native-type="submit">
            进入控制台
          </el-button>
        </el-form>
      </div>
      <p class="fine-print">连接 API：<code>/api</code> · 请确保 Spring Boot 已启动</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function onSubmit() {
  await formRef.value?.validate().catch(() => null)
  loading.value = true
  try {
    await auth.login({ username: form.username, password: form.password })
    ElMessage.success('欢迎回来')
    const redirect = route.query.redirect || '/dashboard'
    router.replace(redirect)
  } catch {
    /* http 已提示 */
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  background: #f8fafc;
}

@media (max-width: 960px) {
  .login-page {
    grid-template-columns: 1fr;
  }
  .hero {
    min-height: 38vh;
  }
}

.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #0c1e36 0%, #0f2744 45%, #155e75 100%);
  color: #f1f5f9;
  display: flex;
  align-items: flex-end;
  padding: 48px 56px 64px;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 60% at 30% 20%, black, transparent);
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  right: -80px;
  top: -100px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.35), transparent 70%);
  filter: blur(4px);
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 440px;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7dd3fc;
  margin: 0 0 16px;
  font-weight: 600;
}

.headline {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 400;
  line-height: 1.15;
  margin: 0 0 20px;
  color: #fff;
}

.headline em {
  font-style: italic;
  color: #bae6fd;
}

.lede {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #cbd5e1;
}

.panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f0f6ff 100%);
}

.card {
  width: 100%;
  max-width: 400px;
  padding: 40px 36px 36px;
  background: var(--cm-surface);
  border-radius: 20px;
  box-shadow: var(--cm-shadow);
  border: 1px solid rgba(14, 165, 233, 0.12);
}

.card-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--cm-ink);
}

.card-sub {
  margin: 0 0 28px;
  font-size: 14px;
  color: var(--cm-ink-muted);
}

.form :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}

.submit {
  width: 100%;
  margin-top: 8px;
  border-radius: 12px;
  font-weight: 600;
  height: 46px;
}

.fine-print {
  margin-top: 28px;
  font-size: 12px;
  color: #94a3b8;
  code {
    font-size: 11px;
    background: #e0f2fe;
    padding: 2px 8px;
    border-radius: 6px;
    color: #0369a1;
  }
}
</style>
