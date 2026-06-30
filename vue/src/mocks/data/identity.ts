/**
 * Mock 身份管理数据 — 用户和角色列表，支持内存 CRUD 操作
 */
import type { IdentityUserDto, IdentityRoleDto } from '@/types/identity'
import type { PagedResultDto, ListResultDto } from '@/types/api'

// ============================================================
// 辅助函数 — 构造完整的 IdentityUserDto（包含所有必需审计字段）
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
// 用户 Mock 数据
// ============================================================

const users: IdentityUserDto[] = [
  makeUser({ id: 'u1', userName: 'admin', name: 'Admin', surname: 'User', email: 'admin@abp.io', emailConfirmed: true, phoneNumber: '13800138000', creationTime: '2026-01-15T08:00:00Z', lastModificationTime: '2026-06-28T10:30:00Z' }),
  makeUser({ id: 'u2', userName: 'zhangsan', name: '三', surname: '张', email: 'zhangsan@abp.io', emailConfirmed: true, phoneNumber: '13900139000', phoneNumberConfirmed: true, creationTime: '2026-03-20T09:00:00Z', lastModificationTime: '2026-06-25T14:00:00Z' }),
  makeUser({ id: 'u3', userName: 'lisi', name: '四', surname: '李', email: 'lisi@abp.io', phoneNumber: '13700137000', accessFailedCount: 3, creationTime: '2026-05-10T10:00:00Z' }),
  makeUser({ id: 'u4', userName: 'wangwu', name: '五', surname: '王', email: 'wangwu@abp.io', emailConfirmed: true, phoneNumber: '13600136000', isActive: false, creationTime: '2026-04-01T11:00:00Z', lastModificationTime: '2026-06-20T16:00:00Z' }),
  makeUser({ id: 'u5', userName: 'zhaoqi', name: '七', surname: '赵', email: 'zhaoqi@abp.io', emailConfirmed: true, phoneNumber: '13500135000', phoneNumberConfirmed: true, creationTime: '2026-06-01T07:00:00Z' }),
]

let userSeq = 5

export function mockGetUsers(params?: { filter?: string; sorting?: string; skipCount?: number; maxResultCount?: number }): PagedResultDto<IdentityUserDto> {
  const { filter = '', skipCount = 0, maxResultCount = 10 } = params || {}
  let filtered = users.filter(u =>
    !filter || (u.userName || '').toLowerCase().includes(filter.toLowerCase()) || (u.email || '').toLowerCase().includes(filter.toLowerCase()),
  )
  const total = filtered.length
  filtered = filtered.slice(skipCount, skipCount + maxResultCount)
  return { items: filtered, totalCount: total }
}

export function mockGetUser(id: string): IdentityUserDto | undefined {
  return users.find(u => u.id === id)
}

export function mockCreateUser(data: { userName: string; name?: string; surname?: string; email: string; password: string; phoneNumber?: string; isActive?: boolean; roleNames?: string[] }): IdentityUserDto {
  const newUser = makeUser({
    id: `u${++userSeq}`,
    userName: data.userName,
    name: data.name || null,
    surname: data.surname || null,
    email: data.email,
    phoneNumber: data.phoneNumber || null,
    isActive: data.isActive ?? true,
  })
  users.unshift(newUser)
  return newUser
}

export function mockUpdateUser(id: string, data: { userName?: string; name?: string; surname?: string; email?: string; phoneNumber?: string; isActive?: boolean }): IdentityUserDto | undefined {
  const idx = users.findIndex(u => u.id === id)
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
  return u
}

export function mockDeleteUser(id: string): boolean {
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return false
  users.splice(idx, 1)
  return true
}

export function mockGetUserRoles(_id: string): ListResultDto<IdentityRoleDto> {
  return { items: roles.filter(r => r.name === 'admin') }
}

// ============================================================
// 角色 Mock 数据
// ============================================================

const roles: IdentityRoleDto[] = [
  makeRole({ id: 'r1', name: 'admin', isStatic: true, creationTime: '2026-01-01T00:00:00Z' }),
  makeRole({ id: 'r2', name: 'user', isDefault: true, isStatic: true, isPublic: true, creationTime: '2026-01-01T00:00:00Z' }),
  makeRole({ id: 'r3', name: 'manager', creationTime: '2026-02-15T10:00:00Z' }),
  makeRole({ id: 'r4', name: 'viewer', isPublic: true, creationTime: '2026-03-10T14:00:00Z' }),
  makeRole({ id: 'r5', name: 'editor', creationTime: '2026-04-01T08:00:00Z' }),
]

let roleSeq = 5

export function mockGetRoles(params?: { filter?: string; skipCount?: number; maxResultCount?: number }): PagedResultDto<IdentityRoleDto> {
  const { filter = '', skipCount = 0, maxResultCount = 10 } = params || {}
  let filtered = roles.filter(r => !filter || (r.name || '').toLowerCase().includes(filter.toLowerCase()))
  const total = filtered.length
  filtered = filtered.slice(skipCount, skipCount + maxResultCount)
  return { items: filtered, totalCount: total }
}

export function mockGetAllRoles(): ListResultDto<IdentityRoleDto> {
  return { items: [...roles] }
}

export function mockGetRole(id: string): IdentityRoleDto | undefined {
  return roles.find(r => r.id === id)
}

export function mockCreateRole(data: { name: string; isDefault?: boolean; isPublic?: boolean }): IdentityRoleDto {
  const newRole = makeRole({
    id: `r${++roleSeq}`,
    name: data.name,
    isDefault: data.isDefault ?? false,
    isPublic: data.isPublic ?? false,
  })
  roles.unshift(newRole)
  return newRole
}

export function mockUpdateRole(id: string, data: { name?: string; isDefault?: boolean; isPublic?: boolean }): IdentityRoleDto | undefined {
  const idx = roles.findIndex(r => r.id === id)
  if (idx === -1) return undefined
  const r = { ...roles[idx] }
  if (data.name !== undefined) r.name = data.name
  if (data.isDefault !== undefined) r.isDefault = data.isDefault
  if (data.isPublic !== undefined) r.isPublic = data.isPublic
  roles[idx] = r
  return r
}

export function mockDeleteRole(id: string): boolean {
  const idx = roles.findIndex(r => r.id === id)
  if (idx === -1) return false
  if (roles[idx].isStatic) return false
  roles.splice(idx, 1)
  return true
}
