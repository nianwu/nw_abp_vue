<template>
  <div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
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
            <el-icon><Lock /></el-icon>
            <span class="font-medium">密码复杂度</span>
          </div>
        </template>
        <PasswordSettingsTab />
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
import { Message, Clock, Lock } from '@element-plus/icons-vue'
import EmailSettingsTab from './components/EmailSettingsTab.vue'
import PasswordSettingsTab from './components/PasswordSettingsTab.vue'
import TimezoneSettingsTab from './components/TimezoneSettingsTab.vue'
</script>
