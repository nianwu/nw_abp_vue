/**
 * ABP Identity 模块类型定义
 *
 * ⚠️ @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖
 */

// ============================================================
// User
// ============================================================

export interface IdentityUserDto {
  id: string
  creationTime: string
  creatorId: string | null
  lastModificationTime: string | null
  lastModifierId: string | null
  isDeleted: boolean
  deleterId: string | null
  deletionTime: string | null
  lastPasswordChangeTime: string | null
  tenantId: string | null
  userName: string | null
  name: string | null
  surname: string | null
  email: string | null
  emailConfirmed: boolean
  phoneNumber: string | null
  phoneNumberConfirmed: boolean
  isActive: boolean
  lockoutEnabled: boolean
  accessFailedCount: number
  entityVersion: number
  concurrencyStamp: string | null
  extraProperties: Record<string, unknown>
  lockoutEnd: string | null
}

export interface IdentityUserCreateDto {
  userName: string
  name?: string | null
  surname?: string | null
  /** @format email */
  email: string
  phoneNumber?: string | null
  isActive: boolean
  lockoutEnabled: boolean
  roleNames?: string[] | null
  password: string
  extraProperties?: Record<string, unknown>
}

export interface IdentityUserUpdateDto {
  userName: string
  name?: string | null
  surname?: string | null
  /** @format email */
  email: string
  phoneNumber?: string | null
  isActive: boolean
  lockoutEnabled: boolean
  roleNames?: string[] | null
  password?: string | null
  concurrencyStamp?: string | null
  extraProperties?: Record<string, unknown>
}

export interface IdentityUserUpdateRolesDto {
  roleNames: string[]
}

// ============================================================
// Role
// ============================================================

export interface IdentityRoleDto {
  id: string
  name: string | null
  isDefault: boolean
  isStatic: boolean
  isPublic: boolean
  creationTime: string
  concurrencyStamp: string | null
  extraProperties: Record<string, unknown>
}

export interface IdentityRoleCreateDto {
  name: string
  isDefault: boolean
  isPublic: boolean
  extraProperties?: Record<string, unknown>
}

export interface IdentityRoleUpdateDto {
  name: string
  isDefault: boolean
  isPublic: boolean
  concurrencyStamp?: string | null
  extraProperties?: Record<string, unknown>
}

// ============================================================
// UserData
// ============================================================

export interface UserData {
  id: string
  tenantId: string | null
  userName: string | null
  name: string | null
  surname: string | null
  email: string | null
  emailConfirmed: boolean
  phoneNumber: string | null
  phoneNumberConfirmed: boolean
  isActive: boolean
  extraProperties: Record<string, unknown>
}
