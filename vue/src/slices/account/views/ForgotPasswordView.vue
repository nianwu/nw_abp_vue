<template>
  <el-card shadow="always">
    <h2 class="text-center text-xl font-semibold mb-2">忘记密码</h2>
    <p class="text-gray-500 text-sm text-center mb-6">输入您的邮箱，我们将发送密码重置链接</p>
    <template v-if="sent">
      <p class="text-center text-green-600 mb-4">密码重置链接已发送到您的邮箱，请查收邮件。</p>
      <div class="text-center">
        <router-link to="/account/login" class="text-blue-500">返回登录</router-link>
      </div>
    </template>
    <template v-else>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleSubmit">
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="form.email" type="email" placeholder="请输入注册时使用的邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" :loading="loading" @click="handleSubmit">发送重置链接</el-button>
        </el-form-item>
      </el-form>
      <div class="text-center text-sm">
        <span>想起了密码？</span>
        <router-link to="/account/login" class="text-blue-500">返回登录</router-link>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { sendPasswordResetCode } from '@/api/account'
import { showSuccess, showError } from '@/components/AbpToast'
import { APP_NAME } from '@/slices/config'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()

const form = reactive({ email: '' })

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
})

const loading = ref(false)
const sent = ref(false)

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await sendPasswordResetCode({
      email: form.email,
      appName: APP_NAME,
      returnUrl: null,
      returnUrlHash: null,
    })
    sent.value = true
    showSuccess('密码重置链接已发送到您的邮箱')
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('发送失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>
