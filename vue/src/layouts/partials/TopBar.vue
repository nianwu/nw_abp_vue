<template>
  <el-header class="flex items-center justify-between h-12 px-4" style="background-color: #304156">
    <div class="flex items-center gap-3">
      <el-icon class="text-white cursor-pointer md:hidden" :size="20" @click="$emit('toggle-sidebar')">
        <Expand />
      </el-icon>
      <span class="text-white font-semibold text-lg">{{ appName }}</span>
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
