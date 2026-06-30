<template>
  <div class="max-w-5xl">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      <el-card shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon><Message /></el-icon>
            <span class="font-medium">电子邮件</span>
          </div>
        </template>
        <EmailSettingsTab />
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon><Clock /></el-icon>
            <span class="font-medium">时区</span>
          </div>
        </template>
        <TimezoneSettingsTab />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message, Clock } from '@element-plus/icons-vue'
import EmailSettingsTab from './components/EmailSettingsTab.vue'
import TimezoneSettingsTab from './components/TimezoneSettingsTab.vue'
</script>
