/**
 * ABP Permission Management API 代理
 *
 * ⚠️ @generated — 临时手动编写。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此文件。
 */
import httpClient from '@/api/http';
const BASE = '/api/permission-management/permissions';
/** 获取权限列表 */
export async function getPermissions(params) {
    const { data } = await httpClient.get(BASE, { params });
    return data;
}
/** 更新权限 */
export async function updatePermissions(data_, params) {
    await httpClient.put(BASE, data_, { params });
}
/** 按分组获取权限 */
export async function getPermissionsByGroup(params) {
    const { data } = await httpClient.get(`${BASE}/by-group`, { params });
    return data;
}
/** 获取资源权限 */
export async function getResourcePermissions(params) {
    const { data } = await httpClient.get(`${BASE}/resource`, { params });
    return data;
}
/** 更新资源权限 */
export async function updateResourcePermissions(data_, params) {
    await httpClient.put(`${BASE}/resource`, data_, { params });
}
/** 删除资源权限 */
export async function deleteResourcePermission(params) {
    await httpClient.delete(`${BASE}/resource`, { params });
}
/** 获取资源权限定义列表 */
export async function getResourcePermissionDefinitions(params) {
    const { data } = await httpClient.get(`${BASE}/resource-definitions`, { params });
    return data;
}
/** 获取资源提供者列表 */
export async function getResourceProviders(params) {
    const { data } = await httpClient.get(`${BASE}/resource-provider-key-lookup-services`, { params });
    return data;
}
/** 按提供者获取资源权限 */
export async function getResourcePermissionsByProvider(params) {
    const { data } = await httpClient.get(`${BASE}/resource/by-provider`, { params });
    return data;
}
/** 搜索资源提供者 Key */
export async function searchResourceProviderKeys(params) {
    const { data } = await httpClient.get(`${BASE}/search-resource-provider-keys`, { params });
    return data;
}
