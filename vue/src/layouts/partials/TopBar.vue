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
      <UserMenu />
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Expand } from '@element-plus/icons-vue'
import { APP_NAME } from '@/config/env'
import TenantBox from './TenantBox.vue'
import LangSwitch from './LangSwitch.vue'
import UserMenu from './UserMenu.vue'

defineEmits<{ 'toggle-sidebar': [] }>()

const appName = APP_NAME
</script>

<style scoped>
.topbar-header {
  border-bottom: 1px solid #e5e7eb;
}
</style>
