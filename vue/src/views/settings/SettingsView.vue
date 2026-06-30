<template>
  <div class="p-4">
    <h2 class="text-xl mb-4">设置管理</h2>

    <el-tabs type="border-card">
      <el-tab-pane label="电子邮件" lazy>
        <EmailSettingsTab />
      </el-tab-pane>
      <el-tab-pane label="时区" lazy>
        <TimezoneSettingsTab />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import EmailSettingsTab from './components/EmailSettingsTab.vue'
import TimezoneSettingsTab from './components/TimezoneSettingsTab.vue'
</script>
