<template>
  <el-menu
    :default-active="activePath"
    :collapse="collapsed"
    class="flex-1 w-full"
    router
  >
    <el-menu-item index="/">
      <el-icon><Icon icon="mdi:home-outline" /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <template v-for="group in menuGroups" :key="group.title">
      <el-menu-item-group>
        <template #title>
          <span>{{ group.title }}</span>
          <el-icon v-if="docUrl(group.title)" class="menu-help-icon" @click.stop="openDoc(group.title)"><QuestionFilled /></el-icon>
        </template>
        <el-menu-item v-for="item in group.items" :key="item.path" :index="item.path">
          <el-icon v-if="iconFor(item.path)"><Icon :icon="iconFor(item.path)!" /></el-icon>
          <span>{{ item.meta?.title || item.name }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { usePermission } from '@/slices/permission'

/** 菜单路径 → Iconify 图标标识 */
const ICON_MAP: Record<string, string> = {
  '/identity/users': 'mdi:account-outline',
  '/identity/roles': 'mdi:account-group-outline',
  '/tenant-management/tenants': 'mdi:domain',
  '/setting-management': 'mdi:cog-outline',
}

function iconFor(path: string) {
  return ICON_MAP[path] || null
}

// ============================================================
// 帮助入口 — 非大众词汇说明页（约定：QuestionFilled → window.open 新标签）
// ============================================================

const DOC_URLS: Record<string, string> = {
  '租户管理': '/docs/tenant-management',
}

function docUrl(title: string): string | undefined {
  return DOC_URLS[title]
}

function openDoc(title: string) {
  const url = DOC_URLS[title]
  if (url) {
    window.open(router.resolve(url).href, '_blank')
  }
}

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
    if (r.meta.public === true) return false
    return r.path !== '/' && r.path !== '/oidc-callback' && !r.path.startsWith('/account') && !r.path.startsWith('/error')
  })

  const groups = new Map<string, MenuItem[]>()
  for (const r of routes) {
    const prefix = r.path.split('/')[1] || 'other'
    const prefixLabels: Record<string, string> = {
      identity: '身份管理',
      'tenant-management': '租户管理',
      'setting-management': '设置管理',
    }
    const label = prefixLabels[prefix] || `其他 (${prefix})`
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push({ path: r.path, name: r.name, meta: r.meta })
  }

  return Array.from(groups.entries()).map(([title, items]) => ({ title, items }))
})
</script>

<style scoped>
/* 移除菜单默认右侧边框 */
:deep(.el-menu) {
  border-right: none !important;
}

/* 菜单项 */
:deep(.el-menu-item) {
  --el-menu-item-height: 50px;
  height: var(--el-menu-item-height);
  line-height: var(--el-menu-item-height);
  margin: 2px 8px;
  border-radius: 6px;
}

/* 选中态 — 左侧蓝色竖线标识 */
:deep(.el-menu-item.is-active) {
  border-left: 3px solid var(--el-color-primary);
  padding-left: calc(20px - 3px) !important;
}

/* 分组标题 */
:deep(.el-menu-item-group__title) {
  font-size: 12px;
  padding: 16px 20px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.el-menu-item-group:first-child .el-menu-item-group__title) {
  padding-top: 8px;
}

/* 分组标题旁帮助图标 */
.menu-help-icon {
  font-size: 13px;
  color: var(--el-text-color-placeholder);
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
}

.menu-help-icon:hover {
  color: var(--el-color-primary);
}

/* 折叠态 — 居中图标 */
:deep(.el-menu--collapse .el-menu-item) {
  margin: 2px 8px;
  padding: 0 !important;
  justify-content: center;
}

/* 折叠态激活项 — 左侧小圆点替代竖线 */
:deep(.el-menu--collapse .el-menu-item.is-active) {
  border-left: none;
  position: relative;
}

:deep(.el-menu--collapse .el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
}
</style>
