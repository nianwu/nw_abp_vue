<template>
  <div>
    <h2 class="flex items-center gap-2 text-xl font-bold text-gray-700 mb-6">
      <el-icon><DataAnalysis /></el-icon>
      概览
    </h2>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <el-card v-if="hasPermission('AbpIdentity.Users')" shadow="hover" class="stat-card">
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
      <el-card v-if="hasPermission('AbpIdentity.Roles')" shadow="hover" class="stat-card">
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
      <el-card v-if="hasPermission('AbpTenantManagement.Tenants')" shadow="hover" class="stat-card">
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
      <el-card v-if="hasPermission('AbpAccount.SettingManagement')" shadow="hover" class="stat-card">
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
    <el-card v-if="filteredQuickLinks.length > 0" shadow="never" class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><Link /></el-icon>
          <span class="font-medium">快捷入口</span>
        </div>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <el-button
          v-for="link in filteredQuickLinks"
          :key="link.path"
          :icon="link.icon"
          class="quick-link-btn"
          @click="$router.push(link.path)"
        >
          {{ link.label }}
        </el-button>
      </div>
    </el-card>

    <!-- 项目说明 -->
    <el-card shadow="never" class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><InfoFilled /></el-icon>
          <span class="font-medium">关于本项目</span>
        </div>
      </template>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="目标">
          以 ABP Angular 默认模板为参考，用 Vue 3 实现其全部必要性功能
        </el-descriptions-item>
        <el-descriptions-item label="部署">
          GitHub Pages — 自动构建，push 即更新
        </el-descriptions-item>
        <el-descriptions-item label="仓库">
          <el-link type="primary" href="https://github.com/nianwu/nw_abp_vue" target="_blank">
            https://github.com/nianwu/nw_abp_vue
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="standalone 模式" :span="2">
          <div class="flex items-center gap-2">
            <el-tag type="success" size="small">默认</el-tag>
            <span class="text-sm">解耦接口依赖，HTTP 拦截器模拟 API 响应；数据以 localStorage 持久化 + 种子数据；跳过 OIDC 直接注入模拟 Token。适合快速开发迭代、前端独立演示。</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="remote 模式" :span="2">
          <div class="flex items-center gap-2">
            <el-tag type="info" size="small">联调</el-tag>
            <span class="text-sm">直连 ABP 后端 API + IdentityServer；OAuth 2.0 / OIDC 完整认证流程；数据存储于后端数据库。适合联调测试、生产部署。</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="开源协议">
          <el-tag type="danger" size="small">GPL v3</el-tag> 传染式 copyleft — 衍生作品须以相同协议开源
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 系统信息 -->
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><Setting /></el-icon>
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
import { User, Avatar, OfficeBuilding, Setting, DataAnalysis, Link, InfoFilled } from '@element-plus/icons-vue'
import { usePermission } from '@/composables/usePermission'
import { APP_NAME } from '@/config/env'

const { hasPermission } = usePermission()
const appName = APP_NAME

const stats = reactive({
  userCount: 12,
  roleCount: 5,
  tenantCount: 3,
  moduleCount: 8,
})

const quickLinks = [
  { path: '/identity/users', label: '用户管理', icon: User, policy: 'AbpIdentity.Users' },
  { path: '/identity/roles', label: '角色管理', icon: Avatar, policy: 'AbpIdentity.Roles' },
  { path: '/tenant-management/tenants', label: '租户管理', icon: OfficeBuilding, policy: 'AbpTenantManagement.Tenants' },
  { path: '/setting-management', label: '系统设置', icon: Setting, policy: 'AbpAccount.SettingManagement' },
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
