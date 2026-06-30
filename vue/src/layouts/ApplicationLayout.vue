<template>
  <el-container class="h-screen">
    <!-- 侧边栏（桌面） -->
    <el-aside class="hidden md:block" :width="sidebarCollapsed ? '64px' : '260px'" style="transition: width 0.3s">
      <SideMenu :collapsed="sidebarCollapsed" />
    </el-aside>
    <!-- 侧边栏（移动端抽屉） -->
    <el-drawer v-model="mobileDrawer" direction="ltr" size="260px" :with-header="false">
      <SideMenu :collapsed="false" />
    </el-drawer>
    <!-- 主内容区 -->
    <el-container>
      <TopBar @toggle-sidebar="toggleSidebar" />
      <el-main class="flex flex-col">
        <AbpBreadcrumb />
        <div class="flex-1">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from './partials/SideMenu.vue'
import TopBar from './partials/TopBar.vue'
import AbpBreadcrumb from '@/components/AbpBreadcrumb.vue'

const sidebarCollapsed = ref(false)
const mobileDrawer = ref(false)

function toggleSidebar() {
  if (window.innerWidth < 768) {
    mobileDrawer.value = !mobileDrawer.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}
</script>
