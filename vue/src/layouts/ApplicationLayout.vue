<template>
  <el-container class="h-screen flex flex-col">
    <!-- 顶部栏（全宽） -->
    <TopBar @toggle-sidebar="toggleSidebar" />

    <!-- 下方：侧栏 + 内容区 -->
    <el-container class="flex-1 overflow-hidden">
      <!-- 侧边栏（桌面） -->
      <el-aside
        class="hidden md:flex flex-col shrink-0"
        :width="sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'"
        style="transition: width 0.3s"
      >
        <SideMenu :collapsed="sidebarCollapsed" />
      </el-aside>

      <!-- 侧边栏（移动端抽屉） -->
      <el-drawer v-model="mobileDrawer" direction="ltr" size="260" :with-header="false">
        <SideMenu :collapsed="false" />
      </el-drawer>

      <!-- 主内容区 -->
      <el-main class="flex flex-col flex-1 overflow-hidden bg-[#f5f7fa]" style="transition: margin-left 0.3s">
        <el-scrollbar class="flex-1">
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from './partials/SideMenu.vue'
import TopBar from './partials/TopBar.vue'

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
