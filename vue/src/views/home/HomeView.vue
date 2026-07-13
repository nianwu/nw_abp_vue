<template>
  <div>
    <h2 class="flex items-center gap-2 text-xl font-bold text-gray-700 mb-6">
      <Icon icon="mdi:view-dashboard-outline" />
      概览
    </h2>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <el-card v-if="hasPermission('AbpIdentity.Users')" shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon icon="mdi:account-outline" width="24" color="#409EFF" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.userCount }}</p>
            <p class="text-sm text-gray-400">用户总数</p>
          </div>
        </div>
      </el-card>
      <el-card v-if="hasPermission('AbpIdentity.Roles')" shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <Icon icon="mdi:account-group-outline" width="24" color="#67C23A" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.roleCount }}</p>
            <p class="text-sm text-gray-400">角色总数</p>
          </div>
        </div>
      </el-card>
      <el-card v-if="hasPermission('AbpTenantManagement.Tenants')" shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
            <Icon icon="mdi:domain" width="24" color="#E6A23C" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.tenantCount }}</p>
            <p class="text-sm text-gray-400">租户总数</p>
          </div>
        </div>
      </el-card>
      <el-card v-if="hasPermission('AbpAccount.SettingManagement')" shadow="hover" class="stat-card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
            <Icon icon="mdi:cog-outline" width="24" color="#9b59b6" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-700">{{ stats.moduleCount }}</p>
            <p class="text-sm text-gray-400">已启用模块</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快捷入口 -->
    <el-card v-if="filteredQuickLinks.length > 0" shadow="never" class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon icon="mdi:link-variant" />
          <span class="font-medium">快捷入口</span>
        </div>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <el-button
          v-for="link in filteredQuickLinks"
          :key="link.path"
          class="quick-link-btn"
          @click="$router.push(link.path)"
        >
          <template #icon><Icon :icon="link.icon" /></template>
          {{ link.label }}
        </el-button>
      </div>
    </el-card>

    <!-- 项目说明 — 仅 standalone 模式显示 -->
    <AboutProject v-if="isStandalone" />

    <!-- 技术栈 — 仅 standalone 模式显示 -->
    <el-card v-if="isStandalone" shadow="never">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon icon="mdi:cog-outline" />
          <span class="font-medium">技术栈</span>
        </div>
      </template>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="应用名称">{{ appName }}</el-descriptions-item>
        <el-descriptions-item label="UI 框架">Vue 3 + Element Plus</el-descriptions-item>
        <el-descriptions-item label="状态管理">Pinia + pinia-plugin-persistedstate</el-descriptions-item>
        <el-descriptions-item label="路由 / 国际化">Vue Router 4 / Vue I18n 11</el-descriptions-item>
        <el-descriptions-item label="认证方案">OIDC (oidc-client-ts) ⇄ localStorage 模拟</el-descriptions-item>
        <el-descriptions-item label="语言">TypeScript 5.9 · Vite 6 · SCSS + Tailwind</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePermission } from '@/composables/usePermission'
import { APP_NAME } from '@/config'
import AboutProject from '@/components/AboutProject.vue'

const isStandalone = import.meta.env.VITE_PROVIDER_MODE === 'standalone'
const { hasPermission } = usePermission()
const appName = APP_NAME

const stats = reactive({
  userCount: 12,
  roleCount: 5,
  tenantCount: 3,
  moduleCount: 8,
})

const quickLinks = [
  { path: '/identity/users', label: '用户管理', icon: 'mdi:account-outline', policy: 'AbpIdentity.Users' },
  { path: '/identity/roles', label: '角色管理', icon: 'mdi:account-group-outline', policy: 'AbpIdentity.Roles' },
  { path: '/tenant-management/tenants', label: '租户管理', icon: 'mdi:domain', policy: 'AbpTenantManagement.Tenants' },
  { path: '/setting-management', label: '系统设置', icon: 'mdi:cog-outline', policy: 'AbpAccount.SettingManagement' },
]

const filteredQuickLinks = computed(() => quickLinks.filter((l) => hasPermission(l.policy)))
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
