/**
 * Mock HTTP 响应拦截器 — 在 Axios 请求发出前按 URL pattern 匹配返回 mock 数据
 *
 * ⚠️ 仅在 VITE_MOCK_ENABLED=true 时注册。
 * 使用 Axios adapter 替换机制：匹配的请求直接返回模拟响应，不发送网络请求。
 */
import type { AxiosInstance } from 'axios'
import {
  mockGetUsers, mockGetUser, mockCreateUser, mockUpdateUser, mockDeleteUser, mockGetUserRoles,
  mockGetRoles, mockGetAllRoles, mockGetRole, mockCreateRole, mockUpdateRole, mockDeleteRole,
} from '@/mocks/data/identity'
import {
  mockGetTenants, mockGetTenant, mockCreateTenant, mockUpdateTenant, mockDeleteTenant,
  mockGetDefaultConnectionString, mockUpdateDefaultConnectionString, mockDeleteDefaultConnectionString,
} from '@/mocks/data/tenant'
import { mockGetPermissions } from '@/mocks/data/permission'
import { mockGetFeatures } from '@/mocks/data/feature'
import { mockEmailSettings, mockTimezone, mockTimezones } from '@/mocks/data/settings'

/**
 * 注册 Mock 响应拦截器。
 * 对匹配 /api/ 前缀的请求，根据 method + URL 返回模拟数据。
 * 未匹配的请求放行走真实网络。
 */
export function registerMockInterceptor(httpClient: AxiosInstance): number {
  const id = httpClient.interceptors.request.use((config) => {
    const { method, url = '' } = config

    if (!url.startsWith('/api/')) return config

    const mockResult = matchMock(method?.toUpperCase() || 'GET', url, config.params, config.data)

    if (mockResult !== undefined) {
      config.adapter = function () {
        return Promise.resolve({
          data: mockResult,
          status: 200,
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
function matchMock(method: string, url: string, params: any, data: any): any | undefined {
  const urlWithoutQuery = url.split('?')[0]

  // ========================
  // Application Configuration / Localization
  // — 在 main.ts 分流中直接设置，不走此处
  // ========================

  // ========================
  // Identity Users
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/identity/users') {
    return mockGetUsers({
      filter: params?.filter,
      sorting: params?.sorting,
      skipCount: params?.skipCount || params?.SkipCount,
      maxResultCount: params?.maxResultCount || params?.MaxResultCount,
    })
  }
  if (method === 'POST' && urlWithoutQuery === '/api/identity/users') {
    const userData = typeof data === 'string' ? JSON.parse(data) : data
    return mockCreateUser(userData)
  }
  const userMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/([^/]+)$/)
  if (userMatch) {
    const id = userMatch[1]
    if (method === 'GET') return mockGetUser(id)
    if (method === 'PUT') {
      const updateData = typeof data === 'string' ? JSON.parse(data) : data
      return mockUpdateUser(id, updateData)
    }
    if (method === 'DELETE') { mockDeleteUser(id); return undefined }
  }
  const userRolesMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/([^/]+)\/roles$/)
  if (userRolesMatch) {
    if (method === 'GET') return mockGetUserRoles(userRolesMatch[1])
    if (method === 'PUT') return undefined
  }

  // ========================
  // Identity Roles
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/identity/roles/all') {
    return mockGetAllRoles()
  }
  if (method === 'GET' && urlWithoutQuery === '/api/identity/roles') {
    return mockGetRoles({
      filter: params?.filter,
      skipCount: params?.skipCount || params?.SkipCount,
      maxResultCount: params?.maxResultCount || params?.MaxResultCount,
    })
  }
  if (method === 'POST' && urlWithoutQuery === '/api/identity/roles') {
    const roleData = typeof data === 'string' ? JSON.parse(data) : data
    return mockCreateRole(roleData)
  }
  const roleMatch = urlWithoutQuery.match(/^\/api\/identity\/roles\/([^/]+)$/)
  if (roleMatch) {
    const id = roleMatch[1]
    if (method === 'GET') return mockGetRole(id)
    if (method === 'PUT') {
      const updateData = typeof data === 'string' ? JSON.parse(data) : data
      return mockUpdateRole(id, updateData)
    }
    if (method === 'DELETE') { mockDeleteRole(id); return undefined }
  }

  // ========================
  // Tenant Management
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/multi-tenancy/tenants') {
    return mockGetTenants({
      filter: params?.filter,
      skipCount: params?.skipCount || params?.SkipCount,
      maxResultCount: params?.maxResultCount || params?.MaxResultCount,
    })
  }
  if (method === 'POST' && urlWithoutQuery === '/api/multi-tenancy/tenants') {
    const tenantData = typeof data === 'string' ? JSON.parse(data) : data
    return mockCreateTenant(tenantData)
  }
  const tenantMatch = urlWithoutQuery.match(/^\/api\/multi-tenancy\/tenants\/([^/]+)$/)
  if (tenantMatch) {
    const id = tenantMatch[1]
    if (method === 'GET') return mockGetTenant(id)
    if (method === 'PUT') {
      const updateData = typeof data === 'string' ? JSON.parse(data) : data
      return mockUpdateTenant(id, updateData)
    }
    if (method === 'DELETE') { mockDeleteTenant(id); return undefined }
  }
  const connStrMatch = urlWithoutQuery.match(/^\/api\/multi-tenancy\/tenants\/([^/]+)\/default-connection-string$/)
  if (connStrMatch) {
    const id = connStrMatch[1]
    if (method === 'GET') return mockGetDefaultConnectionString(id)
    if (method === 'PUT') {
      mockUpdateDefaultConnectionString(id, params?.defaultConnectionString || '')
      return undefined
    }
    if (method === 'DELETE') { mockDeleteDefaultConnectionString(id); return undefined }
  }

  // ========================
  // Permission Management
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions') {
    return mockGetPermissions()
  }
  if (method === 'PUT' && urlWithoutQuery === '/api/permission-management/permissions') {
    return undefined
  }

  // ========================
  // Feature Management
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/feature-management/features') {
    return mockGetFeatures()
  }
  if (method === 'PUT' && urlWithoutQuery === '/api/feature-management/features') {
    return undefined
  }

  // ========================
  // Settings
  // ========================
  if (method === 'GET' && urlWithoutQuery === '/api/setting-management/emailing') {
    return mockEmailSettings
  }
  if (method === 'POST' && urlWithoutQuery === '/api/setting-management/emailing') {
    return undefined
  }
  if (method === 'POST' && urlWithoutQuery === '/api/setting-management/emailing/send-test-email') {
    return undefined
  }
  if (method === 'GET' && urlWithoutQuery === '/api/setting-management/timezone') {
    return mockTimezone
  }
  if (method === 'POST' && urlWithoutQuery === '/api/setting-management/timezone') {
    return undefined
  }
  if (method === 'GET' && urlWithoutQuery === '/api/setting-management/timezone/timezones') {
    return mockTimezones
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

  return undefined
}
