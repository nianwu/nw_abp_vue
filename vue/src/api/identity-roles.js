/**
 * ABP Identity Roles API 代理
 *
 * @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖
 */
import { httpClient } from './http';
const BASE = '/api/identity/roles';
/** 分页查询角色列表 */
export function getRoles(params) {
    return httpClient.get(BASE, { params }).then((res) => res.data);
}
/** 创建角色 */
export function createRole(data) {
    return httpClient.post(BASE, data).then((res) => res.data);
}
/** 获取所有角色（不分页） */
export function getAllRoles() {
    return httpClient.get(`${BASE}/all`).then((res) => res.data);
}
/** 根据 ID 获取单个角色 */
export function getRole(id) {
    return httpClient.get(`${BASE}/${id}`).then((res) => res.data);
}
/** 更新角色 */
export function updateRole(id, data) {
    return httpClient.put(`${BASE}/${id}`, data).then((res) => res.data);
}
/** 删除角色 */
export function deleteRole(id) {
    return httpClient.delete(`${BASE}/${id}`).then((res) => res.data);
}
