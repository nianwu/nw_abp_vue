/**
 * Mock 权限管理数据 — 权限树
 */
import type { GetPermissionListResultDto, PermissionGroupDto, PermissionGrantInfoDto } from '@/types/permission'

const permissionTree: PermissionGroupDto[] = [
  {
    name: 'AbpIdentity',
    displayName: '身份管理',
    displayNameKey: 'Permission:Identity',
    displayNameResource: 'TodoApp',
    permissions: [
      {
        name: 'AbpIdentity.Users',
        displayName: '用户管理',
        parentName: undefined,
        isGranted: true,
        isEditable: true,
        allowedProviders: ['R', 'U'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      },
      {
        name: 'AbpIdentity.Users.Create',
        displayName: '新建用户',
        parentName: 'AbpIdentity.Users',
        isGranted: true,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      },
      {
        name: 'AbpIdentity.Users.Update',
        displayName: '编辑用户',
        parentName: 'AbpIdentity.Users',
        isGranted: true,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      },
      {
        name: 'AbpIdentity.Users.Delete',
        displayName: '删除用户',
        parentName: 'AbpIdentity.Users',
        isGranted: false,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [],
      },
      {
        name: 'AbpIdentity.Roles',
        displayName: '角色管理',
        parentName: undefined,
        isGranted: true,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      },
      {
        name: 'AbpIdentity.Roles.Create',
        displayName: '新建角色',
        parentName: 'AbpIdentity.Roles',
        isGranted: false,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [],
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
        name: 'AbpTenantManagement.Tenants',
        displayName: '租户管理',
        parentName: undefined,
        isGranted: true,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      },
      {
        name: 'AbpTenantManagement.Tenants.Create',
        displayName: '新建租户',
        parentName: 'AbpTenantManagement.Tenants',
        isGranted: true,
        isEditable: true,
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
        name: 'AbpAccount.SettingManagement',
        displayName: '设置管理',
        parentName: undefined,
        isGranted: true,
        isEditable: true,
        allowedProviders: ['R'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      },
    ] as PermissionGrantInfoDto[],
  },
]

export function mockGetPermissions(): GetPermissionListResultDto {
  return {
    entityDisplayName: '角色',
    groups: permissionTree,
  }
}
