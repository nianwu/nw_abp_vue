/**
 * Multi-Tenancy 切片 — 租户管理
 *
 * 提供租户切换、租户 CRUD、连接字符串管理等全部租户相关功能。
 *
 * 对外接口：
 *   import { useTenant, TenantBox, /* API & store functions *‍/ } from '@/slices/tenant'
 */

// Composable — 租户状态查询与切换
export { useTenant } from './composables/useTenant'

// API — HTTP 调用（remote 模式）
export * from './api/tenant'

// Types — DTO 类型定义
export type {
  TenantDto,
  TenantCreateDto,
  TenantUpdateDto,
  FindTenantResultDto,
} from './types/tenant'

// Store — Standalone 模式数据存储
export {
  setTenantSeq,
  standaloneGetTenants,
  standaloneGetTenant,
  standaloneCreateTenant,
  standaloneUpdateTenant,
  standaloneDeleteTenant,
  standaloneGetDefaultConnectionString,
  standaloneUpdateDefaultConnectionString,
  standaloneDeleteDefaultConnectionString,
  standaloneGetNamedConnectionStrings,
  standaloneSetNamedConnectionString,
  standaloneDeleteNamedConnectionString,
} from './stores/tenant-store'

// Components — UI 组件
export { default as TenantBox } from './components/TenantBox.vue'

// Views — 页面组件
export { default as TenantsView } from './views/TenantsView.vue'
