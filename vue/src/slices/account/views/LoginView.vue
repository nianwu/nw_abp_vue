<template>
  <el-card shadow="always">
    <h2 class="text-center text-xl font-semibold mb-6">登录</h2>
    <el-form ref="formRef" :model="form" label-position="top" @submit.prevent="handleLogin">
      <el-form-item label="用户名或邮箱" required>
        <el-input v-model="form.userNameOrEmailAddress" placeholder="请输入用户名或邮箱" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="form.password" type="password" show-password
          placeholder="请输入密码" @keyup="checkCapsLock" @keydown="checkCapsLock" />
        <span v-if="capsLock" class="text-orange-500 text-xs">大写锁定已开启</span>
      </el-form-item>
      <el-form-item v-if="tenantEnabled" label="租户">
        <el-input v-model="tenantName" placeholder="留空为 Host 端" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
      </el-form-item>
      <el-form-item class="mb-2">
        <el-button type="primary" class="w-full" :loading="loading" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
    <div class="flex justify-between text-sm">
      <router-link to="/account/register" class="text-blue-500">注册</router-link>
      <router-link to="/account/forgot-password" class="text-blue-500">忘记密码？</router-link>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/slices/core'
import { useAppConfigStore } from '@/slices/config'
import { showError } from '@/components/AbpToast'
import { login as abpLogin } from '@/api/account'
import type { UserLoginInfo } from '@/types/account'

const router = useRouter()
const route = useRoute()
const appConfig = useAppConfigStore()
const tenantEnabled = appConfig.config?.multiTenancy?.isEnabled || false

const form = reactive<UserLoginInfo>({ userNameOrEmailAddress: '', password: '', rememberMe: false })
const tenantName = ref('')
const loading = ref(false)
const capsLock = ref(false)

function checkCapsLock(e: Event) {
  capsLock.value = (e as KeyboardEvent).getModifierState('CapsLock')
}

async function handleLogin() {
  if (!form.userNameOrEmailAddress || !form.password) {
    showError('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const result = await abpLogin({
      userNameOrEmailAddress: form.userNameOrEmailAddress,
      password: form.password,
      rememberMe: form.rememberMe,
      ...(tenantName.value ? { tenantName: tenantName.value } as any : {}),
    })
    if ((result as any).accessToken) {
      useAuthStore().setTokens((result as any).accessToken, null, null)
      const redirect = (route.query.redirect as string) || '/'
      await router.push(redirect)
    }
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.tenant) {
    tenantName.value = route.query.tenant as string
  }
})
</script>
