<template>
  <el-menu
    :default-active="activePath"
    :collapse="collapsed"
    :class="{ 'h-full': true, 'w-16': collapsed, 'w-56': !collapsed }"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409eff"
    router
  >
    <template v-for="group in menuGroups" :key="group.title">
      <el-menu-item-group :title="group.title">
        <el-menu-item v-for="item in group.items" :key="item.path" :index="item.path">
          <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta?.title || item.name }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermission } from '@/composables/usePermission'

defineProps<{ collapsed?: boolean }>()

const route = useRoute()
const router = useRouter()
const { hasPermission } = usePermission()

const activePath = computed(() => route.path)

interface MenuItem { path: string; name: unknown; meta?: Record<string, unknown> }
interface MenuGroup { title: string; items: MenuItem[] }

const menuGroups = computed<MenuGroup[]>(() => {
  const routes = router.getRoutes().filter((r) => {
    if (!r.name || !r.path || r.path.includes(':')) return false
    const policy = r.meta.requiredPolicy as string | undefined
    if (policy && !hasPermission(policy)) return false
    return r.path !== '/' && r.path !== '/oidc-callback' && !r.path.startsWith('/account') && !r.path.startsWith('/error')
  })

  // 按路径前缀分组
  const groups = new Map<string, MenuItem[]>()
  for (const r of routes) {
    const prefix = r.path.split('/')[1] || 'other'
    const label = { identity: '身份管理', 'tenant-management': '租户管理', 'setting-management': '设置管理' }[prefix] || prefix
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push({ path: r.path, name: r.name, meta: r.meta })
  }

  return Array.from(groups.entries()).map(([title, items]) => ({ title, items }))
})
</script>
