/**
 * Identity Users API Proxy
 * @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖
 */
import { httpClient } from './http'
import type { PagedResultDto, ListResultDto } from '@/types/api'
import type { IdentityUserDto, IdentityUserCreateDto, IdentityUserUpdateDto, IdentityUserUpdateRolesDto, IdentityRoleDto, UserData } from '@/types/identity'

const BASE = '/api/identity/users'

export function getUsers(params?: { filter?: string; sorting?: string; skipCount?: number; maxResultCount?: number }) {
  return httpClient.get<PagedResultDto<IdentityUserDto>>(BASE, { params }).then((r) => r.data)
}
export function createUser(data: IdentityUserCreateDto) {
  return httpClient.post<IdentityUserDto>(BASE, data).then((r) => r.data)
}
export function getUser(id: string) {
  return httpClient.get<IdentityUserDto>(`${BASE}/${id}`).then((r) => r.data)
}
export function updateUser(id: string, data: IdentityUserUpdateDto) {
  return httpClient.put<IdentityUserDto>(`${BASE}/${id}`, data).then((r) => r.data)
}
export function deleteUser(id: string) {
  return httpClient.delete(`${BASE}/${id}`)
}
export function getAssignableRoles() {
  return httpClient.get<ListResultDto<IdentityRoleDto>>(`${BASE}/assignable-roles`).then((r) => r.data)
}
export function getUserByEmail(email: string) {
  return httpClient.get<IdentityUserDto>(`${BASE}/by-email/${encodeURIComponent(email)}`).then((r) => r.data)
}
export function getUserByUsername(userName: string) {
  return httpClient.get<IdentityUserDto>(`${BASE}/by-username/${encodeURIComponent(userName)}`).then((r) => r.data)
}
export function getUserRoles(id: string) {
  return httpClient.get<ListResultDto<IdentityRoleDto>>(`${BASE}/${id}/roles`).then((r) => r.data)
}
export function updateUserRoles(id: string, data: IdentityUserUpdateRolesDto) {
  return httpClient.put(`${BASE}/${id}/roles`, data)
}
export function lookupUser(id: string) {
  return httpClient.get<UserData>(`${BASE}/lookup/${id}`).then((r) => r.data)
}
export function lookupUserByUsername(userName: string) {
  return httpClient.get<UserData>(`${BASE}/lookup/by-username/${encodeURIComponent(userName)}`).then((r) => r.data)
}
export function searchUsers(params?: { filter?: string; sorting?: string; skipCount?: number; maxResultCount?: number }) {
  return httpClient.get<ListResultDto<UserData>>(`${BASE}/lookup/search`, { params }).then((r) => r.data)
}
export function getUserLookupCount(params?: { filter?: string }) {
  return httpClient.get<number>(`${BASE}/lookup/count`, { params }).then((r) => r.data)
}
