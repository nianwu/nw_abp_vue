<template>
  <el-card shadow="always">
    <h2 class="text-center text-xl font-semibold mb-6">注册</h2>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleRegister">
      <el-form-item label="用户名" prop="userName" required>
        <el-input v-model="form.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" required>
        <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" required>
        <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码" />
      </el-form-item>
      <el-form-item class="mb-2">
        <el-button type="primary" class="w-full" :loading="loading" @click="handleRegister">注册</el-button>
      </el-form-item>
    </el-form>
    <div class="text-center text-sm">
      <span>已有账号？</span>
      <router-link to="/account/login" class="text-blue-500">立即登录</router-link>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/account'
import { showSuccess, showError } from '@/components/AbpToast'
import { APP_NAME } from '@/config'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  userName: '',
  email: '',
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
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

const loading = ref(false)

async function handleRegister() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await register({
      userName: form.userName,
      emailAddress: form.email,
      password: form.password,
      appName: APP_NAME,
      extraProperties: {},
    })
    showSuccess('注册成功，请登录')
    await router.push('/account/login')
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>
