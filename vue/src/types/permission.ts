/**
 * ABP Permission Management 模块类型定义
 *
 * ⚠️ @generated — 临时从 swagger.json 提取。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此目录全部文件。
 */

// ============================================================
// 权限定义
// ============================================================

/** 权限列表结果 */
export interface GetPermissionListResultDto {
  entityDisplayName?: string
  groups?: PermissionGroupDto[]
}

/** 权限分组 */
export interface PermissionGroupDto {
  name?: string
  displayName?: string
  displayNameKey?: string
  displayNameResource?: string
  permissions?: PermissionGrantInfoDto[]
}

/** 权限授权信息 */
export interface PermissionGrantInfoDto {
  name?: string
  displayName?: string
  parentName?: string
  isGranted: boolean
  isEditable: boolean
  allowedProviders?: string[]
  grantedProviders?: ProviderInfoDto[]
}

/** 提供者信息 */
export interface ProviderInfoDto {
  providerName?: string
  providerKey?: string
}

// ============================================================
// 权限更新
// ============================================================

/** 单个权限更新 */
export interface UpdatePermissionDto {
  name?: string
  isGranted: boolean
}

/** 批量权限更新 */
export interface UpdatePermissionsDto {
  permissions?: UpdatePermissionDto[]
}

/** 资源权限更新 */
export interface UpdateResourcePermissionsDto {
  providerName?: string
  providerKey?: string
  permissions?: string[]
}

// ============================================================
// 资源权限定义
// ============================================================

/** 资源权限定义列表结果 */
export interface GetResourcePermissionDefinitionListResultDto {
  permissions?: ResourcePermissionDefinitionDto[]
}

/** 资源权限定义 */
export interface ResourcePermissionDefinitionDto {
  name?: string
  displayName?: string
}

/** 资源权限列表结果 */
export interface GetResourcePermissionListResultDto {
  permissions?: ResourcePermissionGrantInfoDto[]
}

/** 资源权限授权信息 */
export interface ResourcePermissionGrantInfoDto {
  providerName?: string
  providerNameDisplayName?: string
  providerDisplayName?: string
  providerKey?: string
  permissions?: GrantedResourcePermissionDto[]
}

/** 已授权的资源权限 */
export interface GrantedResourcePermissionDto {
  name?: string
  displayName?: string
}

/** 含提供者的资源权限列表结果 */
export interface GetResourcePermissionWithProviderListResultDto {
  permissions?: ResourcePermissionWithProdiverGrantInfoDto[]
}

/** 含提供者的资源权限授权信息 */
export interface ResourcePermissionWithProdiverGrantInfoDto {
  name?: string
  displayName?: string
  isGranted: boolean
  providers?: string[]
}

// ============================================================
// 资源提供者
// ============================================================

/** 资源提供者列表结果 */
export interface GetResourceProviderListResultDto {
  providers?: ResourceProviderDto[]
}

/** 资源提供者 */
export interface ResourceProviderDto {
  name?: string
  displayName?: string
}

// ============================================================
// 提供者搜索
// ============================================================

/** 搜索提供者 Key 列表结果 */
export interface SearchProviderKeyListResultDto {
  keys?: SearchProviderKeyInfo[]
}

/** 搜索提供者 Key 信息 */
export interface SearchProviderKeyInfo {
  providerKey?: string
  providerDisplayName?: string
}
