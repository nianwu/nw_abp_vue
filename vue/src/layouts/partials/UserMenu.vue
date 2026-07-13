<template>
  <el-dropdown trigger="hover">
    <span class="user-dropdown-trigger flex items-center gap-2 cursor-pointer text-gray-700">
      <el-avatar :size="28">{{ userName.charAt(0).toUpperCase() }}</el-avatar>
      <span class="hidden sm:inline">{{ userName }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="$router.push('/account/manage-profile')">个人资料</el-dropdown-item>
        <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfigStore } from '@/config'
import { useAuth } from '@/composables/useAuth'

const appConfig = useAppConfigStore()
const { logout } = useAuth()

const userName = computed(() => appConfig.config?.currentUser?.userName || '用户')

async function handleLogout() {
  await logout()
}
</script>

<style scoped>
.user-dropdown-trigger,
.user-dropdown-trigger:hover,
.user-dropdown-trigger:focus,
.user-dropdown-trigger:focus-visible {
  outline: none;
  box-shadow: none;
}
</style>
