<template>
  <el-header class="topbar-header flex items-center justify-between h-12 px-4 bg-white">
    <div class="flex items-center gap-3">
      <el-icon class="cursor-pointer md:hidden text-gray-600" :size="20" @click="$emit('toggle-sidebar')">
        <Expand />
      </el-icon>
      <span class="font-semibold text-lg text-gray-700">{{ appName }}</span>
    </div>
    <div class="flex items-center gap-4">
      <TenantBox />
      <LangSwitch />
      <el-button
        v-if="isStandalone"
        size="small"
        type="danger"
        plain
        class="hidden sm:flex"
        @click="handleReset">
        <el-icon><Delete /></el-icon>
        重置本地数据
      </el-button>
      <UserMenu />
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Expand, Delete } from '@element-plus/icons-vue'
import { APP_NAME } from '@/slices/config'
import { TenantBox } from '@/slices/tenant'
import LangSwitch from './LangSwitch.vue'
import UserMenu from './UserMenu.vue'

defineEmits<{ 'toggle-sidebar': [] }>()

const appName = APP_NAME
const isStandalone = import.meta.env.VITE_PROVIDER_MODE === 'standalone'

async function handleReset() {
  const { resetAll } = await import('@/slices/core')
  const { seedDemoData } = await import('@/slices/core')
  resetAll()
  seedDemoData()
  window.location.reload()
}
</script>

<style scoped>
.topbar-header {
  border-bottom: 1px solid #e5e7eb;
}
</style>
