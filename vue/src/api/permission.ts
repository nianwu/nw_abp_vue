/**
 * ABP Permission Management API 代理
 *
 * ⚠️ @generated — 临时手动编写。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此文件。
 */

import httpClient from '@/api/http'
import type {
  GetPermissionListResultDto,
  GetResourcePermissionDefinitionListResultDto,
  GetResourcePermissionListResultDto,
  GetResourcePermissionWithProviderListResultDto,
  GetResourceProviderListResultDto,
  SearchProviderKeyListResultDto,
  UpdatePermissionsDto,
  UpdateResourcePermissionsDto,
} from '@/types/permission'

const BASE = '/api/permission-management/permissions'

/** 获取权限列表 */
export async function getPermissions(
  params?: { providerName?: string; providerKey?: string },
): Promise<GetPermissionListResultDto> {
  const { data } = await httpClient.get<GetPermissionListResultDto>(BASE, { params })
  return data
}

/** 更新权限 */
export async function updatePermissions(
  data_: UpdatePermissionsDto,
  params?: { providerName?: string; providerKey?: string },
): Promise<void> {
  await httpClient.put(BASE, data_, { params })
}

/** 按分组获取权限 */
export async function getPermissionsByGroup(
  params: { groupName?: string; providerName?: string; providerKey?: string },
): Promise<GetPermissionListResultDto> {
  const { data } = await httpClient.get<GetPermissionListResultDto>(`${BASE}/by-group`, { params })
  return data
}

/** 获取资源权限 */
export async function getResourcePermissions(
  params: { resourceName?: string; resourceKey?: string },
): Promise<GetResourcePermissionListResultDto> {
  const { data } = await httpClient.get<GetResourcePermissionListResultDto>(`${BASE}/resource`, { params })
  return data
}

/** 更新资源权限 */
export async function updateResourcePermissions(
  data_: UpdateResourcePermissionsDto,
  params: { resourceName?: string; resourceKey?: string },
): Promise<void> {
  await httpClient.put(`${BASE}/resource`, data_, { params })
}

/** 删除资源权限 */
export async function deleteResourcePermission(
  params: { resourceName?: string; resourceKey?: string; providerName?: string; providerKey?: string },
): Promise<void> {
  await httpClient.delete(`${BASE}/resource`, { params })
}

/** 获取资源权限定义列表 */
export async function getResourcePermissionDefinitions(
  params?: { resourceName?: string },
): Promise<GetResourcePermissionDefinitionListResultDto> {
  const { data } = await httpClient.get<GetResourcePermissionDefinitionListResultDto>(`${BASE}/resource-definitions`, { params })
  return data
}

/** 获取资源提供者列表 */
export async function getResourceProviders(
  params?: { resourceName?: string },
): Promise<GetResourceProviderListResultDto> {
  const { data } = await httpClient.get<GetResourceProviderListResultDto>(`${BASE}/resource-provider-key-lookup-services`, { params })
  return data
}

/** 按提供者获取资源权限 */
export async function getResourcePermissionsByProvider(
  params: { resourceName?: string; resourceKey?: string; providerName?: string; providerKey?: string },
): Promise<GetResourcePermissionWithProviderListResultDto> {
  const { data } = await httpClient.get<GetResourcePermissionWithProviderListResultDto>(`${BASE}/resource/by-provider`, { params })
  return data
}

/** 搜索资源提供者 Key */
export async function searchResourceProviderKeys(
  params: { resourceName?: string; serviceName?: string; filter?: string; page?: number },
): Promise<SearchProviderKeyListResultDto> {
  const { data } = await httpClient.get<SearchProviderKeyListResultDto>(`${BASE}/search-resource-provider-keys`, { params })
  return data
}
