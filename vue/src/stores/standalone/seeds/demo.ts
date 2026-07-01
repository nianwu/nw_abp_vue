/**
 * Demo 种子数据 — 为演示站点注入初始 CRUD 数据
 *
 * 在 app 启动时由 standalone provider 的 setupInfrastructure 调用。
 * 使用 storage.seed() 确保仅首次访问时播种，后续访问使用 localStorage 中已有的数据。
 */

import { seed } from '@/stores/standalone/storage'
import { setUserSeq, setRoleSeq } from '@/stores/standalone/identity-store'
import { setTenantSeq } from '@/stores/standalone/tenant-store'
import { standaloneSetPermissions } from '@/stores/standalone/permission-store'
import { standaloneSetFeatures } from '@/stores/standalone/feature-store'
import { standaloneSetEmailSettings, standaloneSetTimezones } from '@/stores/standalone/settings-store'
import type { IdentityUserDto, IdentityRoleDto } from '@/types/identity'
import type { TenantDto } from '@/types/tenant'
import type { GetPermissionListResultDto, PermissionGroupDto, PermissionGrantInfoDto } from '@/types/permission'
import type { GetFeatureListResultDto, FeatureGroupDto, FeatureDto, IStringValueType } from '@/types/feature'
import type { EmailSettingsDto } from '@/types/settings'

// ============================================================
// 种子数据被 seed() 包装，仅在首次访问时写入
// ============================================================

export function seedDemoData(): void {
  seedUsers()
  seedRoles()
  seedTenants()
  seedPermissions()
  seedFeatures()
  seedEmailSettings()
  seedTimezones()
}

// ============================================================
// 辅助构造
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

function makeRole(
  overrides: Partial<IdentityRoleDto> & Pick<IdentityRoleDto, 'id' | 'name'>,
): IdentityRoleDto {
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
// 用户种子
// ============================================================

/** 生成相对当前时间的 ISO 字符串 */
function ago(seconds: number): string {
  return new Date(Date.now() - seconds * 1000).toISOString()
}

function seedUsers(): void {
  const demoUsers: IdentityUserDto[] = [
    makeUser({
      id: 'u1', userName: 'admin', name: 'Admin', surname: 'User',
      email: 'admin@abp.io', emailConfirmed: true, phoneNumber: '13800138000',
      creationTime: '2026-01-15T08:00:00Z', lastModificationTime: '2026-06-28T10:30:00Z',
    }),
    makeUser({
      id: 'u2', userName: 'zhangsan', name: '三', surname: '张',
      email: 'zhangsan@abp.io', emailConfirmed: true, phoneNumber: '13900139000',
      phoneNumberConfirmed: true,
      creationTime: '2026-03-20T09:00:00Z', lastModificationTime: '2026-06-25T14:00:00Z',
    }),
    makeUser({
      id: 'u3', userName: 'lisi', name: '四', surname: '李',
      email: 'lisi@abp.io', phoneNumber: '13700137000', accessFailedCount: 3,
      creationTime: '2026-05-10T10:00:00Z',
    }),
    makeUser({
      id: 'u4', userName: 'wangwu', name: '五', surname: '王',
      email: 'wangwu@abp.io', emailConfirmed: true, phoneNumber: '13600136000',
      isActive: false,
      creationTime: '2026-04-01T11:00:00Z', lastModificationTime: '2026-06-20T16:00:00Z',
    }),
    makeUser({
      id: 'u5', userName: 'zhaoqi', name: '七', surname: '赵',
      email: 'zhaoqi@abp.io', emailConfirmed: true, phoneNumber: '13500135000',
      phoneNumberConfirmed: true,
      creationTime: '2026-06-01T07:00:00Z',
    }),
    // 时间渲染测试数据 — 创建时间为相对时间
    makeUser({
      id: 'u6', userName: 'time-1s', name: '1秒前', surname: '测试',
      email: 'time-1s@test.io', creationTime: ago(1),
    }),
    makeUser({
      id: 'u7', userName: 'time-1m', name: '1分钟前', surname: '测试',
      email: 'time-1m@test.io', creationTime: ago(60),
    }),
    makeUser({
      id: 'u8', userName: 'time-5m', name: '5分钟前', surname: '测试',
      email: 'time-5m@test.io', creationTime: ago(300),
    }),
    makeUser({
      id: 'u9', userName: 'time-1h', name: '1小时前', surname: '测试',
      email: 'time-1h@test.io', creationTime: ago(3600),
    }),
    makeUser({
      id: 'u10', userName: 'time-3h', name: '3小时前', surname: '测试',
      email: 'time-3h@test.io', creationTime: ago(10800),
    }),
    makeUser({
      id: 'u11', userName: 'time-1d', name: '1天前', surname: '测试',
      email: 'time-1d@test.io', creationTime: ago(86400),
    }),
  ]

  if (seed('users', demoUsers)) {
    setUserSeq(11)
  }
}

// ============================================================
// 角色种子
// ============================================================

function seedRoles(): void {
  const demoRoles: IdentityRoleDto[] = [
    makeRole({ id: 'r1', name: 'admin', isStatic: true, creationTime: '2026-01-01T00:00:00Z' }),
    makeRole({
      id: 'r2', name: 'user', isDefault: true, isStatic: true, isPublic: true,
      creationTime: '2026-01-01T00:00:00Z',
    }),
    makeRole({ id: 'r3', name: 'manager', creationTime: '2026-02-15T10:00:00Z' }),
    makeRole({ id: 'r4', name: 'viewer', isPublic: true, creationTime: '2026-03-10T14:00:00Z' }),
    makeRole({ id: 'r5', name: 'editor', creationTime: '2026-04-01T08:00:00Z' }),
  ]

  if (seed('roles', demoRoles)) {
    setRoleSeq(5)
  }
}

// ============================================================
// 租户种子
// ============================================================

function seedTenants(): void {
  const demoTenants: TenantDto[] = [
    {
      id: 't1', name: 'AcmeCorp', isActive: true, adminEmailAddress: 'admin@acme.com',
      editionName: 'Enterprise',
      creationTime: '2026-01-10T08:00:00Z', lastModificationTime: '2026-06-15T09:00:00Z',
      concurrencyStamp: 'cs-t1', extraProperties: {},
    },
    {
      id: 't2', name: 'BetaLabs', isActive: true, adminEmailAddress: 'admin@betalabs.io',
      editionName: 'Standard',
      creationTime: '2026-03-05T10:00:00Z', lastModificationTime: '2026-06-20T14:00:00Z',
      concurrencyStamp: 'cs-t2', extraProperties: {},
    },
    {
      id: 't3', name: 'GammaInc', isActive: false, adminEmailAddress: 'admin@gamma.co',
      editionName: 'Basic',
      creationTime: '2026-05-20T12:00:00Z',
      concurrencyStamp: 'cs-t3', extraProperties: {},
    },
  ]

  const demoConnStrings: Record<string, string> = {
    t1: 'Server=localhost;Database=AcmeCorp;Trusted_Connection=True',
    t2: 'Server=localhost;Database=BetaLabs;Trusted_Connection=True',
  }

  if (seed('tenants', demoTenants)) {
    setTenantSeq(3)
  }

  seed('connectionStrings', demoConnStrings)
}

// ============================================================
// 权限种子
// ============================================================

function seedPermissions(): void {
  const toggleType: IStringValueType = {
    name: 'ToggleStringValueType', properties: {}, validator: { name: 'NULL', properties: {} },
  }

  const demoPermissions: GetPermissionListResultDto = {
    entityDisplayName: '角色',
    groups: [
      {
        name: 'AbpIdentity',
        displayName: '身份管理',
        displayNameKey: 'Permission:Identity',
        displayNameResource: 'TodoApp',
        permissions: [
          {
            name: 'AbpIdentity.Users', displayName: '用户管理', parentName: undefined,
            isGranted: true, isEditable: true, allowedProviders: ['R', 'U'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
          {
            name: 'AbpIdentity.Users.Create', displayName: '新建用户',
            parentName: 'AbpIdentity.Users', isGranted: true, isEditable: true,
            allowedProviders: ['R'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
          {
            name: 'AbpIdentity.Users.Update', displayName: '编辑用户',
            parentName: 'AbpIdentity.Users', isGranted: true, isEditable: true,
            allowedProviders: ['R'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
          {
            name: 'AbpIdentity.Users.Delete', displayName: '删除用户',
            parentName: 'AbpIdentity.Users', isGranted: false, isEditable: true,
            allowedProviders: ['R'], grantedProviders: [],
          },
          {
            name: 'AbpIdentity.Roles', displayName: '角色管理', parentName: undefined,
            isGranted: true, isEditable: true, allowedProviders: ['R'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
          {
            name: 'AbpIdentity.Roles.Create', displayName: '新建角色',
            parentName: 'AbpIdentity.Roles', isGranted: false, isEditable: true,
            allowedProviders: ['R'], grantedProviders: [],
          },
        ] as PermissionGrantInfoDto[],
      },
      {
        name: 'AbpTenantManagement',
        displayName: '租户管理',
        displayNameKey: 'Permission:TenantManagement',
        displayNameResource: 'TodoApp',
        permissions: [
          {
            name: 'AbpTenantManagement.Tenants', displayName: '租户管理', parentName: undefined,
            isGranted: true, isEditable: true, allowedProviders: ['R'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
          {
            name: 'AbpTenantManagement.Tenants.Create', displayName: '新建租户',
            parentName: 'AbpTenantManagement.Tenants', isGranted: true, isEditable: true,
            allowedProviders: ['R'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
        ] as PermissionGrantInfoDto[],
      },
      {
        name: 'AbpAccount',
        displayName: '账户管理',
        displayNameKey: 'Permission:Account',
        displayNameResource: 'TodoApp',
        permissions: [
          {
            name: 'AbpAccount.SettingManagement', displayName: '设置管理', parentName: undefined,
            isGranted: true, isEditable: true, allowedProviders: ['R'],
            grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
          },
        ] as PermissionGrantInfoDto[],
      },
    ] as PermissionGroupDto[],
  }

  seed('permissions', demoPermissions)
}

// ============================================================
// 功能种子
// ============================================================

function seedFeatures(): void {
  const toggleType: IStringValueType = {
    name: 'ToggleStringValueType', properties: {}, validator: { name: 'NULL', properties: {} },
  }
  const freeTextType: IStringValueType = {
    name: 'FreeTextStringValueType', properties: {}, validator: { name: 'NULL', properties: {} },
  }
  const selectionType: IStringValueType = {
    name: 'SelectionStringValueType', properties: {}, validator: { name: 'NULL', properties: {} },
  }

  const demoFeatures: GetFeatureListResultDto = {
    groups: [
      {
        name: 'Identity',
        displayName: '身份功能',
        features: [
          {
            name: 'Abp.Identity.TwoFactor', displayName: '双因素认证', parentName: null,
            description: '启用双因素认证功能', value: 'true', depth: 0,
            valueType: toggleType, provider: null,
          },
          {
            name: 'Abp.Identity.MaxUserCount', displayName: '最大用户数', parentName: null,
            description: '允许创建的最大用户数量', value: '100', depth: 0,
            valueType: freeTextType, provider: null,
          },
          {
            name: 'Abp.Identity.PasswordComplexity', displayName: '密码复杂度', parentName: null,
            description: '密码复杂度要求', value: 'Standard', depth: 0,
            valueType: selectionType, provider: null,
          },
        ] as FeatureDto[],
      },
      {
        name: 'TenantManagement',
        displayName: '租户功能',
        features: [
          {
            name: 'Abp.TenantManagement.AllowSelfRegistration', displayName: '允许自助注册租户',
            parentName: null, description: '允许用户自行注册租户', value: 'false', depth: 0,
            valueType: toggleType, provider: null,
          },
        ] as FeatureDto[],
      },
    ] as FeatureGroupDto[],
  }

  seed('features', demoFeatures)
}

// ============================================================
// 邮件设置种子
// ============================================================

function seedEmailSettings(): void {
  const demoEmail: EmailSettingsDto = {
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUserName: 'noreply@example.com',
    smtpPassword: null,
    smtpDomain: 'example.com',
    smtpEnableSsl: true,
    smtpUseDefaultCredentials: false,
    defaultFromAddress: 'noreply@example.com',
    defaultFromDisplayName: 'ABP TodoApp',
  }

  seed('emailSettings', demoEmail)
}

// ============================================================
// 时区种子
// ============================================================

function seedTimezones(): void {
  const demoTz = 'Asia/Shanghai'
  const demoTzList: string[] = [
    'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Singapore',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'America/New_York', 'America/Chicago', 'America/Los_Angeles',
    'Australia/Sydney', 'Pacific/Auckland', 'UTC',
  ]

  seed('timezone', demoTz)
  seed('timezones', demoTzList)
}
