/**
 * ABP Tenant Management 模块类型定义
 *
 * ⚠️ @generated — 临时手写，后端可用时执行 `abp generate-proxy` 覆盖。
 */

// ============================================================
// Tenant
// ============================================================

export interface TenantDto {
  id?: string
  name?: string | null
  isActive?: boolean
  concurrencyStamp?: string | null
  adminEmailAddress?: string | null
  editionName?: string | null
  creationTime?: string
  lastModificationTime?: string | null
  extraProperties?: Record<string, unknown>
}

/** name 与 adminEmailAddress、adminPassword 为必填 */
export interface TenantCreateDto {
  name: string
  /** @format email */
  adminEmailAddress: string
  adminPassword: string
  isActive?: boolean
  extraProperties?: Record<string, unknown>
}

/** name 与 concurrencyStamp 为必填 */
export interface TenantUpdateDto {
  name: string
  isActive?: boolean
  concurrencyStamp?: string | null
  extraProperties?: Record<string, unknown>
}

// ============================================================
// Tenant Lookup
// ============================================================

export interface FindTenantResultDto {
  success: boolean
  tenantId?: string | null
  name?: string | null
  normalizedName?: string | null
  isActive: boolean
}
