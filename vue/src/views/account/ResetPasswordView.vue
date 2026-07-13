<template>
  <el-card shadow="always">
    <h2 class="text-center text-xl font-semibold mb-6">重置密码</h2>
    <template v-if="!hasToken">
      <p class="text-gray-500 text-sm text-center">链接无效或已过期，请重新申请密码重置。</p>
      <div class="text-center mt-4">
        <router-link to="/account/forgot-password" class="text-blue-500">重新申请</router-link>
      </div>
    </template>
    <template v-else>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleSubmit">
        <el-form-item label="新密码" prop="password" required>
          <el-input v-model="form.password" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" required>
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" :loading="loading" @click="handleSubmit">重置密码</el-button>
        </el-form-item>
      </el-form>
      <div class="text-center text-sm">
        <router-link to="/account/login" class="text-blue-500">返回登录</router-link>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/api/account'
import { showSuccess, showError } from '@/components/AbpToast'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const userId = (route.query.userId as string) || ''
const resetToken = (route.query.resetToken as string) || ''
const hasToken = computed(() => !!userId && !!resetToken)

const form = reactive({
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

const loading = ref(false)

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await resetPassword({
      userId,
      resetToken,
      password: form.password,
    })
    showSuccess('密码重置成功，请使用新密码登录')
    await router.push('/account/login')
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('重置密码失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>
