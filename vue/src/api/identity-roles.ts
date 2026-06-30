/**
 * ABP Identity Roles API 代理
 *
 * @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖
 */

import { httpClient } from './http'
import type { PagedRequestDto, PagedResultDto, ListResultDto } from '@/types/api'
import type { IdentityRoleDto, IdentityRoleCreateDto, IdentityRoleUpdateDto } from '@/types/identity'

const BASE = '/api/identity/roles'

/** 分页查询角色列表 */
export function getRoles(params?: PagedRequestDto): Promise<PagedResultDto<IdentityRoleDto>> {
  return httpClient.get(BASE, { params }).then((res) => res.data)
}

/** 创建角色 */
export function createRole(data: IdentityRoleCreateDto): Promise<IdentityRoleDto> {
  return httpClient.post(BASE, data).then((res) => res.data)
}

/** 获取所有角色（不分页） */
export function getAllRoles(): Promise<ListResultDto<IdentityRoleDto>> {
  return httpClient.get(`${BASE}/all`).then((res) => res.data)
}

/** 根据 ID 获取单个角色 */
export function getRole(id: string): Promise<IdentityRoleDto> {
  return httpClient.get(`${BASE}/${id}`).then((res) => res.data)
}

/** 更新角色 */
export function updateRole(id: string, data: IdentityRoleUpdateDto): Promise<IdentityRoleDto> {
  return httpClient.put(`${BASE}/${id}`, data).then((res) => res.data)
}

/** 删除角色 */
export function deleteRole(id: string): Promise<void> {
  return httpClient.delete(`${BASE}/${id}`).then((res) => res.data)
}
