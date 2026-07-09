/**
 * Identity 切片 — 用户与角色管理
 *
 * 提供用户 CRUD、角色 CRUD、用户-角色分配等全部身份管理功能。
 *
 * 对外接口：
 *   import { /* API from @/api/ *, types from @/types/ *,
 *            standaloneGetUsers, setUserSeq, ... } from '@/slices/identity'
 */

// API — 从生成层 re-export（abp generate-proxy 输出到 @/api/）
export * from '@/api/identity-users'
export * from '@/api/identity-roles'

// Types — 从生成层 re-export（abp generate-proxy 输出到 @/types/）
export type {
  IdentityUserDto,
  IdentityUserCreateDto,
  IdentityUserUpdateDto,
  IdentityRoleDto,
  IdentityRoleCreateDto,
  IdentityRoleUpdateDto,
} from '@/types/identity'

// Store — Standalone 模式数据存储
export {
  setUserSeq,
  setRoleSeq,
  setUserRolesSeed,
  standaloneGetUsers,
  standaloneGetUser,
  standaloneCreateUser,
  standaloneUpdateUser,
  standaloneDeleteUser,
  standaloneGetUserRoles,
  standaloneUpdateUserRoles,
  standaloneGetRoles,
  standaloneGetAllRoles,
  standaloneGetRole,
  standaloneCreateRole,
  standaloneUpdateRole,
  standaloneDeleteRole,
} from './stores/identity-store'

// Views — 页面组件
export { default as UsersView } from './views/UsersView.vue'
export { default as RolesView } from './views/RolesView.vue'
