/**
 * 身份管理 localStorage store — 用户和角色 CRUD
 *
 * 数据存储于 localStorage，键：abp:local:users / abp:local:roles
 * 首次访问时为空，需通过 seed 函数注入初始数据。
 */

import { load, save } from '@/slices/core'
import type { IdentityUserDto, IdentityRoleDto } from '@/types/identity'
import type { PagedResultDto, ListResultDto } from '@/types/api'

// ============================================================
// 辅助函数
// ============================================================

function makeUser(overrides: {
  id: string
  userName: string | null
  email: string | null
  creationTime?: string
  creatorId?: string | null
  lastModificationTime?: string | null
  lastModifierId?: string | null
  isDeleted?: boolean
  deleterId?: string | null
  deletionTime?: string | null
  lastPasswordChangeTime?: string | null
  tenantId?: string | null
  name?: string | null
  surname?: string | null
  emailConfirmed?: boolean
  phoneNumber?: string | null
  phoneNumberConfirmed?: boolean
  isActive?: boolean
  lockoutEnabled?: boolean
  accessFailedCount?: number
  entityVersion?: number
  concurrencyStamp?: string | null
  extraProperties?: Record<string, unknown>
  lockoutEnd?: string | null
}): IdentityUserDto {
  return {
    creationTime: new Date().toISOString(),
    creatorId: null,
    lastModificationTime: null,
    lastModifierId: null,
    isDeleted: false,
    deleterId: null,
    deletionTime: null,
    lastPasswordChangeTime: null,
    tenantId: null,
    emailConfirmed: false,
    phoneNumber: null,
    phoneNumberConfirmed: false,
    isActive: true,
    lockoutEnabled: true,
    accessFailedCount: 0,
    entityVersion: 1,
    concurrencyStamp: `cs-${overrides.id}`,
    extraProperties: {},
    lockoutEnd: null,
    ...overrides,
  } as IdentityUserDto
}

function makeRole(overrides: Partial<IdentityRoleDto> & Pick<IdentityRoleDto, 'id' | 'name'>): IdentityRoleDto {
  return {
    isDefault: false,
    isStatic: false,
    isPublic: false,
    creationTime: new Date().toISOString(),
    concurrencyStamp: `cs-${overrides.id}`,
    extraProperties: {},
    ...overrides,
  }
}

// ============================================================
// 内部数据访问（每次从 localStorage 读写）
// ============================================================

const USERS_KEY = 'users'
const ROLES_KEY = 'roles'
const USER_ROLES_MAP_KEY = 'userRolesMap'

function getUsers(): IdentityUserDto[] {
  return load<IdentityUserDto[]>(USERS_KEY) || []
}

function setUsers(users: IdentityUserDto[]): void {
  save(USERS_KEY, users)
}

function getRoles(): IdentityRoleDto[] {
  return load<IdentityRoleDto[]>(ROLES_KEY) || []
}

function setRoles(roles: IdentityRoleDto[]): void {
  save(ROLES_KEY, roles)
}

/** userId → roleName[] 映射 */
function getUserRolesMap(): Record<string, string[]> {
  return load<Record<string, string[]>>(USER_ROLES_MAP_KEY) || {}
}

function setUserRolesMap(map: Record<string, string[]>): void {
  save(USER_ROLES_MAP_KEY, map)
}

export function setUserRolesSeed(map: Record<string, string[]>): void {
  setUserRolesMap(map)
}

// ============================================================
// 用户 CRUD（公开 API）
// ============================================================

let userSeq = load<number>('userSeq') || 0

export function getUserSeq(): number {
  return userSeq
}

export function setUserSeq(n: number): void {
  userSeq = n
  save('userSeq', n)
}

export function standaloneGetUsers(params?: {
  filter?: string
  sorting?: string
  skipCount?: number
  maxResultCount?: number
}): PagedResultDto<IdentityUserDto> {
  const { filter = '', skipCount = 0, maxResultCount = 10 } = params || {}
  const users = getUsers()
  let filtered = users.filter(
    (u) =>
      !filter ||
      (u.userName || '').toLowerCase().includes(filter.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(filter.toLowerCase()),
  )
  const total = filtered.length
  filtered = filtered.slice(skipCount, skipCount + maxResultCount)
  return { items: filtered, totalCount: total }
}

export function standaloneGetUser(id: string): IdentityUserDto | undefined {
  return getUsers().find((u) => u.id === id)
}

export function standaloneCreateUser(data: {
  userName: string
  name?: string
  surname?: string
  email: string
  password: string
  phoneNumber?: string
  isActive?: boolean
  roleNames?: string[]
}): IdentityUserDto {
  const users = getUsers()
  setUserSeq(userSeq + 1)
  const newUser = makeUser({
    id: `u${userSeq + 1}`,
    userName: data.userName,
    name: data.name || null,
    surname: data.surname || null,
    email: data.email,
    phoneNumber: data.phoneNumber || null,
    isActive: data.isActive ?? true,
  })
  users.unshift(newUser)
  setUsers(users)

  // 保存角色映射
  if (data.roleNames && data.roleNames.length > 0) {
    const map = getUserRolesMap()
    map[newUser.id] = data.roleNames
    setUserRolesMap(map)
  }

  return newUser
}

export function standaloneUpdateUser(
  id: string,
  data: {
    userName?: string
    name?: string
    surname?: string
    email?: string
    phoneNumber?: string
    isActive?: boolean
  },
): IdentityUserDto | undefined {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return undefined
  const u = { ...users[idx] }
  if (data.userName !== undefined) u.userName = data.userName
  if (data.name !== undefined) u.name = data.name
  if (data.surname !== undefined) u.surname = data.surname
  if (data.email !== undefined) u.email = data.email
  if (data.phoneNumber !== undefined) u.phoneNumber = data.phoneNumber
  if (data.isActive !== undefined) u.isActive = data.isActive
  u.lastModificationTime = new Date().toISOString()
  users[idx] = u
  setUsers(users)
  return u
}

export function standaloneDeleteUser(id: string): boolean {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  users.splice(idx, 1)
  setUsers(users)
  // 同步清理角色映射
  const map = getUserRolesMap()
  delete map[id]
  setUserRolesMap(map)
  return true
}

export function standaloneGetUserRoles(id: string): ListResultDto<IdentityRoleDto> {
  const map = getUserRolesMap()
  const roleNames = map[id] || []
  const roles = getRoles()
  return { items: roles.filter((r) => roleNames.includes(r.name || '')) }
}

export function standaloneUpdateUserRoles(id: string, roleNames: string[]): void {
  const map = getUserRolesMap()
  if (roleNames.length === 0) {
    delete map[id]
  } else {
    map[id] = roleNames
  }
  setUserRolesMap(map)
}

// ============================================================
// 角色 CRUD（公开 API）
// ============================================================

let roleSeq = load<number>('roleSeq') || 0

export function setRoleSeq(n: number): void {
  roleSeq = n
  save('roleSeq', n)
}

export function standaloneGetRoles(params?: {
  filter?: string
  skipCount?: number
  maxResultCount?: number
}): PagedResultDto<IdentityRoleDto> {
  const { filter = '', skipCount = 0, maxResultCount = 10 } = params || {}
  const roles = getRoles()
  let filtered = roles.filter((r) => !filter || (r.name || '').toLowerCase().includes(filter.toLowerCase()))
  const total = filtered.length
  filtered = filtered.slice(skipCount, skipCount + maxResultCount)
  return { items: filtered, totalCount: total }
}

export function standaloneGetAllRoles(): ListResultDto<IdentityRoleDto> {
  return { items: [...getRoles()] }
}

export function standaloneGetRole(id: string): IdentityRoleDto | undefined {
  return getRoles().find((r) => r.id === id)
}

export function standaloneCreateRole(data: {
  name: string
  isDefault?: boolean
  isPublic?: boolean
}): IdentityRoleDto {
  const roles = getRoles()
  setRoleSeq(roleSeq + 1)
  const newRole = makeRole({
    id: `r${roleSeq + 1}`,
    name: data.name,
    isDefault: data.isDefault ?? false,
    isPublic: data.isPublic ?? false,
  })
  roles.unshift(newRole)
  setRoles(roles)
  return newRole
}

export function standaloneUpdateRole(
  id: string,
  data: { name?: string; isDefault?: boolean; isPublic?: boolean },
): IdentityRoleDto | undefined {
  const roles = getRoles()
  const idx = roles.findIndex((r) => r.id === id)
  if (idx === -1) return undefined
  const r = { ...roles[idx] }
  if (data.name !== undefined) r.name = data.name
  if (data.isDefault !== undefined) r.isDefault = data.isDefault
  if (data.isPublic !== undefined) r.isPublic = data.isPublic
  roles[idx] = r
  setRoles(roles)
  return r
}

export function standaloneDeleteRole(id: string): boolean {
  const roles = getRoles()
  const idx = roles.findIndex((r) => r.id === id)
  if (idx === -1) return false
  if (roles[idx].isStatic) return false
  roles.splice(idx, 1)
  setRoles(roles)
  return true
}
