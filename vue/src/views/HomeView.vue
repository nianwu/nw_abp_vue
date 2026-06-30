<template>
  <div>
    <h2 class="text-xl font-bold text-gray-700 mb-6">概览</h2>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <el-icon :size="24" color="#409EFF"><User /></el-icon>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.userCount }}</p>
            <p class="text-sm text-gray-400">用户总数</p>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <el-icon :size="24" color="#67C23A"><Avatar /></el-icon>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.roleCount }}</p>
            <p class="text-sm text-gray-400">角色总数</p>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <el-icon :size="24" color="#E6A23C"><OfficeBuilding /></el-icon>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.tenantCount }}</p>
            <p class="text-sm text-gray-400">租户总数</p>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <el-icon :size="24" color="#9b59b6"><Setting /></el-icon>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.moduleCount }}</p>
            <p class="text-sm text-gray-400">已启用模块</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快捷入口 -->
    <el-card shadow="never" class="mb-6">
      <template #header>
        <span class="font-medium">快捷入口</span>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <el-button
          v-for="link in quickLinks"
          :key="link.path"
          :icon="link.icon"
          class="quick-link-btn"
          @click="$router.push(link.path)"
        >
          {{ link.label }}
        </el-button>
      </div>
    </el-card>

    <!-- 系统信息 -->
    <el-card shadow="never">
      <template #header>
        <span class="font-medium">系统信息</span>
      </template>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="应用名称">{{ appName }}</el-descriptions-item>
        <el-descriptions-item label="UI 框架">Vue 3 + Element Plus</el-descriptions-item>
        <el-descriptions-item label="构建工具">Vite 6</el-descriptions-item>
        <el-descriptions-item label="当前模式">独立开发 (local)</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { User, Avatar, OfficeBuilding, Setting } from '@element-plus/icons-vue'
import { APP_NAME } from '@/config/env'

const appName = APP_NAME

const stats = reactive({
  userCount: 12,
  roleCount: 5,
  tenantCount: 3,
  moduleCount: 8,
})

const quickLinks = [
  { path: '/identity/users', label: '用户管理', icon: User },
  { path: '/identity/roles', label: '角色管理', icon: Avatar },
  { path: '/tenant-management/tenants', label: '租户管理', icon: OfficeBuilding },
  { path: '/setting-management', label: '系统设置', icon: Setting },
]
</script>

<style scoped>
.stat-card {
  cursor: default;
}
.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.quick-link-btn {
  width: 100%;
  justify-content: flex-start;
}
</style>
