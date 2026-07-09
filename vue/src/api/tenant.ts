/**
 * ABP Tenant Management API 代理
 *
 * ⚠️ @generated — 临时手写，后端可用时执行 `abp generate-proxy` 覆盖。
 */

import { httpClient } from '@/api/http'
import type { PagedRequestDto, PagedResultDto } from '@/types/api'
import type {
  TenantDto,
  TenantCreateDto,
  TenantUpdateDto,
  FindTenantResultDto,
} from '../types/tenant'

const BASE = '/api/multi-tenancy/tenants'

// ============================================================
// CRUD
// ============================================================

export function getTenants(params?: PagedRequestDto) {
  return httpClient
    .get<PagedResultDto<TenantDto>>(BASE, { params })
    .then((r) => r.data)
}

export function createTenant(data: TenantCreateDto) {
  return httpClient.post<TenantDto>(BASE, data).then((r) => r.data)
}

export function getTenant(id: string) {
  return httpClient.get<TenantDto>(`${BASE}/${id}`).then((r) => r.data)
}

export function updateTenant(id: string, data: TenantUpdateDto) {
  return httpClient.put<TenantDto>(`${BASE}/${id}`, data).then((r) => r.data)
}

export function deleteTenant(id: string) {
  return httpClient.delete<void>(`${BASE}/${id}`)
}

// ============================================================
// Default Connection String
// ============================================================

export function getDefaultConnectionString(id: string) {
  return httpClient.get<string>(`${BASE}/${id}/default-connection-string`)
}

export function updateDefaultConnectionString(
  id: string,
  defaultConnectionString?: string,
) {
  return httpClient.put<void>(`${BASE}/${id}/default-connection-string`, undefined, {
    params: { defaultConnectionString },
  })
}

export function deleteDefaultConnectionString(id: string) {
  return httpClient.delete<void>(`${BASE}/${id}/default-connection-string`)
}

// ============================================================
// Named Connection Strings (multiple)
// ============================================================

export function getConnectionStrings(id: string) {
  return httpClient
    .get<Record<string, string>>(`${BASE}/${id}/connection-strings`)
    .then((r) => r.data)
}

export function setConnectionString(
  id: string,
  name: string,
  value: string,
) {
  return httpClient
    .put(`${BASE}/${id}/connection-strings/${name}`, value, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(() => undefined)
}

export function deleteConnectionString(id: string, name: string) {
  return httpClient
    .delete(`${BASE}/${id}/connection-strings/${name}`)
    .then(() => undefined)
}

// ============================================================
// Tenant Lookup
// ============================================================

export function findTenantById(id: string) {
  return httpClient.get<FindTenantResultDto>(
    `/api/abp/multi-tenancy/tenants/by-id/${id}`,
  )
}

export function findTenantByName(name: string) {
  return httpClient.get<FindTenantResultDto>(
    `/api/abp/multi-tenancy/tenants/by-name/${name}`,
  )
}
