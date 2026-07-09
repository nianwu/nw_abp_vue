/**
 * Permission 切片 — RBAC 权限管理
 *
 * 提供三层权限控制：路由守卫、Composable 检查、DOM 指令，
 * 以及权限管理弹窗和完整的数据层（remote API + standalone store）。
 *
 * 对外接口：
 *   import { usePermission, permissionGuard, vPermission,
 *            registerPermissionGuard, openPermissionModal,
 *            /* store & API *‍/ } from '@/slices/permission'
 */

// Composable — 权限检查
export { usePermission, permissionGuard } from './composables/usePermission'

// Directive — v-permission 指令
export { vPermission } from './directives/v-permission'

// Guard — 路由守卫注册
export { registerPermissionGuard } from './guards/permission'

// API — HTTP 调用（remote 模式）
export * from './api/permission'

// Types — DTO 类型定义
export type {
  GetPermissionListResultDto,
  PermissionGroupDto,
  PermissionGrantInfoDto,
  ProviderInfoDto,
  UpdatePermissionsDto,
  UpdatePermissionDto,
  GetResourcePermissionListResultDto,
  GetResourcePermissionDefinitionListResultDto,
  GetResourcePermissionWithProviderListResultDto,
  GetResourceProviderListResultDto,
  SearchProviderKeyListResultDto,
  UpdateResourcePermissionsDto,
  ResourcePermissionGrantInfoDto,
  ResourceProviderDto,
  ResourcePermissionDefinitionDto,
  SearchProviderKeyInfo,
} from './types/permission'

// Store — Standalone 模式数据存储
export {
  standaloneGetPermissions,
  standaloneSetPermissions,
  standaloneUpdatePermission,
} from './stores/permission-store'

// Utils — 命令式弹窗 API
export { openPermissionModal } from './utils/permission-modal'

// Components — 权限管理弹窗
export { default as PermissionModal } from './components/PermissionModal.vue'
