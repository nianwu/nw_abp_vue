/**
 * Standalone HTTP 请求拦截器 — 在 Axios 请求发出前按 URL pattern 匹配返回 standalone store 数据
 *
 * 使用 Axios adapter 替换机制：匹配的请求直接返回模拟响应，不发送网络请求。
 * 未匹配的请求放行走真实网络。
 */

import type { AxiosInstance } from 'axios'
import {
  standaloneGetUsers, standaloneGetUser, standaloneCreateUser, standaloneUpdateUser, standaloneDeleteUser, standaloneGetUserRoles, standaloneUpdateUserRoles,
  standaloneGetRoles, standaloneGetAllRoles, standaloneGetRole, standaloneCreateRole, standaloneUpdateRole, standaloneDeleteRole,
} from '@/stores/standalone/identity-store'
import {
  standaloneGetTenants, standaloneGetTenant, standaloneCreateTenant, standaloneUpdateTenant, standaloneDeleteTenant,
  standaloneGetDefaultConnectionString, standaloneUpdateDefaultConnectionString, standaloneDeleteDefaultConnectionString,
} from '@/stores/standalone/tenant-store'
import { standaloneGetPermissions, standaloneUpdatePermission } from '@/stores/standalone/permission-store'
import { standaloneGetFeatures, standaloneUpdateFeatureValue } from '@/stores/standalone/feature-store'
import {
  standaloneGetEmailSettings, standaloneUpdateEmailSettings,
  standaloneGetTimezone, standaloneSetTimezone, standaloneGetTimezones,
} from '@/stores/standalone/settings-store'

// 已匹配路由但无响应体的写操作，返回此标记
const EMPTY_OK = {}

/**
 * 注册 standalone HTTP 响应拦截器。
 * 对匹配 /api/ 前缀的请求，根据 method + URL 返回 standalone store 数据。
 * 未匹配的请求放行走真实网络。
 */
export function registerStandaloneHttpInterceptor(httpClient: AxiosInstance): number {
  const id = httpClient.interceptors.request.use((config) => {
    const { method, url = '' } = config

    if (!url.startsWith('/api/')) return config

    const match = matchStore(method?.toUpperCase() || 'GET', url, config.params, config.data)

    if (match !== undefined) {
      config.adapter = function () {
        return Promise.resolve({
          data: match === EMPTY_OK ? undefined : match,
          status: match === EMPTY_OK ? 204 : 200,
          statusText: 'OK',
          headers: {},
          config,
        })
      }
    }

    return config
  })

  return id
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBody(data: any): any {
  return typeof data === 'string' ? JSON.parse(data) : data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchStore(method: string, url: string, params: any, data: any): any | undefined {
  const urlWithoutQuery = url.split('?')[0]

  // ========================
  // Identity Users
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/identity/users') {
    return standaloneGetUsers({
      filter: params?.filter,
      sorting: params?.sorting,
      skipCount: params?.skipCount || params?.SkipCount,
      maxResultCount: params?.maxResultCount || params?.MaxResultCount,
    })
  }
  if (method === 'POST' && urlWithoutQuery === '/api/identity/users') {
    return standaloneCreateUser(parseBody(data))
  }
  const userMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/([^/]+)$/)
  if (userMatch) {
    const id = userMatch[1]
    if (method === 'GET') return standaloneGetUser(id)
    if (method === 'PUT') return standaloneUpdateUser(id, parseBody(data))
    if (method === 'DELETE') { standaloneDeleteUser(id); return EMPTY_OK }
  }
  const userRolesMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/([^/]+)\/roles$/)
  if (userRolesMatch) {
    if (method === 'GET') return standaloneGetUserRoles(userRolesMatch[1])
    if (method === 'PUT') { standaloneUpdateUserRoles(userRolesMatch[1], parseBody(data).roleNames || []); return EMPTY_OK }
  }
  // 用户查找
  if (method === 'GET' && urlWithoutQuery === '/api/identity/users/assignable-roles') {
    return standaloneGetAllRoles()
  }
  const userByEmailMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/by-email\/(.+)$/)
  if (userByEmailMatch) {
    const email = decodeURIComponent(userByEmailMatch[1])
    const users = standaloneGetUsers({ filter: email }).items
    return users.length > 0 ? users[0] : null
  }
  const userByUsernameMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/by-username\/(.+)$/)
  if (userByUsernameMatch) {
    const userName = decodeURIComponent(userByUsernameMatch[1])
    const users = standaloneGetUsers({ filter: userName }).items
    return users.length > 0 ? users[0] : null
  }
  // 用户查找器（lookup）
  const userLookupSearchMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/lookup\/search$/)
  if (userLookupSearchMatch && method === 'GET') {
    const items = standaloneGetUsers({ filter: params?.filter }).items.map(u => ({
      id: u.id, userName: u.userName, name: u.name, surname: u.surname, email: u.email,
    }))
    return { items, totalCount: items.length }
  }
  const userLookupByIdMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/lookup\/([^/]+)$/)
  if (userLookupByIdMatch) {
    const u = standaloneGetUser(userLookupByIdMatch[1])
    if (!u) return null
    return { id: u.id, userName: u.userName, name: u.name, surname: u.surname, email: u.email }
  }
  const userLookupByUsernameMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/lookup\/by-username\/(.+)$/)
  if (userLookupByUsernameMatch) {
    const userName = decodeURIComponent(userLookupByUsernameMatch[1])
    const users = standaloneGetUsers({ filter: userName }).items
    if (users.length === 0) return null
    const u = users[0]
    return { id: u.id, userName: u.userName, name: u.name, surname: u.surname, email: u.email }
  }
  if (method === 'GET' && urlWithoutQuery === '/api/identity/users/lookup/count') {
    return standaloneGetUsers({ filter: params?.filter }).totalCount
  }

  // ========================
  // Identity Roles
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/identity/roles/all') {
    return standaloneGetAllRoles()
  }
  if (method === 'GET' && urlWithoutQuery === '/api/identity/roles') {
    return standaloneGetRoles({
      filter: params?.filter,
      skipCount: params?.skipCount || params?.SkipCount,
      maxResultCount: params?.maxResultCount || params?.MaxResultCount,
    })
  }
  if (method === 'POST' && urlWithoutQuery === '/api/identity/roles') {
    return standaloneCreateRole(parseBody(data))
  }
  const roleMatch = urlWithoutQuery.match(/^\/api\/identity\/roles\/([^/]+)$/)
  if (roleMatch) {
    const id = roleMatch[1]
    if (method === 'GET') return standaloneGetRole(id)
    if (method === 'PUT') return standaloneUpdateRole(id, parseBody(data))
    if (method === 'DELETE') { standaloneDeleteRole(id); return EMPTY_OK }
  }

  // ========================
  // Tenant Management
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/multi-tenancy/tenants') {
    return standaloneGetTenants({
      filter: params?.filter,
      skipCount: params?.skipCount || params?.SkipCount,
      maxResultCount: params?.maxResultCount || params?.MaxResultCount,
    })
  }
  if (method === 'POST' && urlWithoutQuery === '/api/multi-tenancy/tenants') {
    return standaloneCreateTenant(parseBody(data))
  }
  const tenantMatch = urlWithoutQuery.match(/^\/api\/multi-tenancy\/tenants\/([^/]+)$/)
  if (tenantMatch) {
    const id = tenantMatch[1]
    if (method === 'GET') return standaloneGetTenant(id)
    if (method === 'PUT') return standaloneUpdateTenant(id, parseBody(data))
    if (method === 'DELETE') { standaloneDeleteTenant(id); return EMPTY_OK }
  }
  const connStrMatch = urlWithoutQuery.match(
    /^\/api\/multi-tenancy\/tenants\/([^/]+)\/default-connection-string$/,
  )
  if (connStrMatch) {
    const id = connStrMatch[1]
    if (method === 'GET') return standaloneGetDefaultConnectionString(id)
    if (method === 'PUT') {
      standaloneUpdateDefaultConnectionString(id, params?.defaultConnectionString || '')
      return EMPTY_OK
    }
    if (method === 'DELETE') { standaloneDeleteDefaultConnectionString(id); return EMPTY_OK }
  }
  // 命名连接字符串
  const namedConnMatch = urlWithoutQuery.match(
    /^\/api\/multi-tenancy\/tenants\/([^/]+)\/connection-strings$/,
  )
  if (namedConnMatch && method === 'GET') {
    return {}
  }
  const namedConnDetailMatch = urlWithoutQuery.match(
    /^\/api\/multi-tenancy\/tenants\/([^/]+)\/connection-strings\/(.+)$/,
  )
  if (namedConnDetailMatch) {
    if (method === 'PUT' || method === 'DELETE') return EMPTY_OK
  }
  // 租户查找
  const tenantByIdMatch = urlWithoutQuery.match(/^\/api\/abp\/multi-tenancy\/tenants\/by-id\/([^/]+)$/)
  if (tenantByIdMatch && method === 'GET') {
    const t = standaloneGetTenant(tenantByIdMatch[1])
    if (!t) return { success: false, tenantId: tenantByIdMatch[1], name: '', isActive: false }
    return { success: true, tenantId: t.id, name: t.name, isActive: t.isActive }
  }
  const tenantByNameMatch = urlWithoutQuery.match(/^\/api\/abp\/multi-tenancy\/tenants\/by-name\/(.+)$/)
  if (tenantByNameMatch && method === 'GET') {
    const name = decodeURIComponent(tenantByNameMatch[1])
    const tenants = standaloneGetTenants({ filter: name }).items
    if (tenants.length === 0) return { success: false, tenantId: '', name, isActive: false }
    const t = tenants[0]
    return { success: true, tenantId: t.id, name: t.name, isActive: t.isActive }
  }

  // ========================
  // Permission Management
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions') {
    return standaloneGetPermissions() || { entityDisplayName: '', groups: [] }
  }
  if (method === 'PUT' && urlWithoutQuery === '/api/permission-management/permissions') {
    const body = parseBody(data)
    if (body?.permissions) {
      for (const perm of body.permissions) {
        standaloneUpdatePermission(perm.name, perm.isGranted)
      }
    }
    return EMPTY_OK
  }
  // 按分组获取权限
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions/by-group') {
    return standaloneGetPermissions() || { entityDisplayName: '', groups: [] }
  }
  // 资源权限列表
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions/resource') {
    return { permissions: [] }
  }
  if (method === 'PUT' && urlWithoutQuery === '/api/permission-management/permissions/resource') {
    return EMPTY_OK
  }
  if (method === 'DELETE' && urlWithoutQuery === '/api/permission-management/permissions/resource') {
    return EMPTY_OK
  }
  // 资源权限定义（根据资源类型返回可用权限级别）
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions/resource-definitions') {
    const resourceName = params?.resourceName || ''
    const defs: { name?: string; displayName?: string }[] = []
    if (resourceName.includes('User')) {
      defs.push({ name: 'Read', displayName: '只读' })
      defs.push({ name: 'Write', displayName: '读写' })
      defs.push({ name: 'Delete', displayName: '删除' })
    } else if (resourceName.includes('Role')) {
      defs.push({ name: 'Read', displayName: '只读' })
      defs.push({ name: 'Write', displayName: '读写' })
      defs.push({ name: 'ManagePermissions', displayName: '管理权限' })
    } else if (resourceName.includes('Tenant')) {
      defs.push({ name: 'Read', displayName: '只读' })
      defs.push({ name: 'Write', displayName: '读写' })
      defs.push({ name: 'ManageFeatures', displayName: '管理功能' })
    } else {
      defs.push({ name: 'Read', displayName: '只读' })
      defs.push({ name: 'Write', displayName: '读写' })
    }
    return { permissions: defs }
  }
  // 资源提供者列表
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions/resource-provider-key-lookup-services') {
    return {
      providers: [
        { name: 'Identity.Users', displayName: '用户' },
        { name: 'Identity.Roles', displayName: '角色' },
        { name: 'TenantManagement.Tenants', displayName: '租户' },
      ],
    }
  }
  // 按提供者获取资源权限
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions/resource/by-provider') {
    return { permissions: [] }
  }
  // 搜索资源提供者 Key
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions/search-resource-provider-keys') {
    const resourceName = params?.resourceName || ''
    const filter = (params?.filter || '').toLowerCase()
    let keys: { providerKey?: string; providerDisplayName?: string }[] = []
    if (resourceName.includes('User')) {
      const users = standaloneGetUsers({ filter, maxResultCount: 20 }).items
      keys = users.map(u => ({ providerKey: u.id, providerDisplayName: u.userName || u.id }))
    } else if (resourceName.includes('Role')) {
      const roles = standaloneGetAllRoles().items.filter(r => !filter || (r.name || '').toLowerCase().includes(filter))
      keys = roles.map(r => ({ providerKey: r.id, providerDisplayName: r.name || r.id }))
    } else if (resourceName.includes('Tenant')) {
      const tenants = standaloneGetTenants({ filter, maxResultCount: 20 }).items
      keys = tenants.map(t => ({ providerKey: t.id, providerDisplayName: t.name || t.id }))
    }
    return { keys }
  }

  // ========================
  // Feature Management
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/feature-management/features') {
    return standaloneGetFeatures()
  }
  if (method === 'PUT' && urlWithoutQuery === '/api/feature-management/features') {
    const body = parseBody(data)
    if (body?.features) {
      for (const feat of body.features) {
        standaloneUpdateFeatureValue(feat.name, feat.value)
      }
    }
    return EMPTY_OK
  }
  if (method === 'DELETE' && urlWithoutQuery === '/api/feature-management/features') {
    return EMPTY_OK
  }

  // ========================
  // Settings
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/setting-management/emailing') {
    return standaloneGetEmailSettings()
  }
  if (method === 'POST' && urlWithoutQuery === '/api/setting-management/emailing') {
    standaloneUpdateEmailSettings(parseBody(data))
    return EMPTY_OK
  }
  if (method === 'POST' && urlWithoutQuery === '/api/setting-management/emailing/send-test-email') {
    return EMPTY_OK
  }
  if (method === 'GET' && urlWithoutQuery === '/api/setting-management/timezone') {
    return standaloneGetTimezone()
  }
  if (method === 'POST' && urlWithoutQuery === '/api/setting-management/timezone') {
    const tzData = parseBody(data)
    if (tzData?.timezone) localSetTimezone(tzData.timezone)
    return EMPTY_OK
  }
  if (method === 'GET' && urlWithoutQuery === '/api/setting-management/timezone/timezones') {
    return standaloneGetTimezones()
  }

  // ========================
  // Account
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/account/my-profile') {
    return {
      userName: 'admin',
      email: 'admin@abp.io',
      name: 'Admin',
      surname: 'User',
      phoneNumber: '13800138000',
      hasPassword: true,
      isExternal: false,
      concurrencyStamp: 'cs-profile',
      extraProperties: {},
    }
  }
  if (method === 'PUT' && urlWithoutQuery === '/api/account/my-profile') {
    return parseBody(data)
  }
  if (method === 'POST' && urlWithoutQuery === '/api/account/my-profile/change-password') {
    return EMPTY_OK
  }
  // 其他账户端点（local 模式下 Auth 用 provider 注入，这些不被调用，兜底返回）
  if (urlWithoutQuery.startsWith('/api/account/')) {
    if (method === 'POST' && urlWithoutQuery === '/api/account/login') {
      return { accessToken: 'local-token', userId: 'mock-user-001', tenantId: undefined }
    }
    return EMPTY_OK
  }

  // ========================
  // 兜底 — 所有未匹配的 /api/ 请求返回空成功，避免穿透到不可用的 proxy
  // ========================
  console.warn(`[standalone-interceptor] unmatched ${method} ${urlWithoutQuery} — returning 204`)
  return EMPTY_OK
}
