<template>
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
      <el-descriptions-item label="版本">
        {{ appVersion }}
      </el-descriptions-item>
      <el-descriptions-item label="构建时间">
        {{ buildTime }}
      </el-descriptions-item>
      <el-descriptions-item label="部署">
        GitHub Pages — 自动构建，push 即更新
      </el-descriptions-item>
      <el-descriptions-item label="仓库">
        <el-link type="primary" href="https://github.com/nianwu/nw_abp_vue" target="_blank">
          https://github.com/nianwu/nw_abp_vue
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item label="运行模式" :span="2">
        <div class="flex items-center gap-2">
          <el-tag size="small">当前</el-tag>
          <span class="text-sm">解耦接口依赖，HTTP 拦截器模拟 API 响应；数据以 localStorage 持久化 + 种子数据；跳过 OIDC 直接注入模拟 Token。适合快速开发迭代、前端独立演示。</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="开源协议">
        <el-tag type="danger" size="small">GPL v3</el-tag> 传染式 copyleft — 衍生作品须以相同协议开源
      </el-descriptions-item>
      <el-descriptions-item label="remote 模式" :span="2">
        <div class="flex items-center gap-2">
          <el-tag type="success" size="small">默认</el-tag>
          <span class="text-sm">直连 ABP 后端 API + IdentityServer；OAuth 2.0 / OIDC 完整认证流程；数据存储于后端数据库。适合联调测试、生产部署。</span>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

const appVersion = import.meta.env.VITE_APP_VERSION || 'preview-1.0.0'
const buildTime = __BUILD_TIME__
</script>
