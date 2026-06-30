/**
 * ABP Tenant Management API 代理
 *
 * ⚠️ @generated — 临时手写，后端可用时执行 `abp generate-proxy` 覆盖。
 */
import { httpClient } from '@/api/http';
const BASE = '/api/multi-tenancy/tenants';
// ============================================================
// CRUD
// ============================================================
export function getTenants(params) {
    return httpClient
        .get(BASE, { params })
        .then((r) => r.data);
}
export function createTenant(data) {
    return httpClient.post(BASE, data).then((r) => r.data);
}
export function getTenant(id) {
    return httpClient.get(`${BASE}/${id}`).then((r) => r.data);
}
export function updateTenant(id, data) {
    return httpClient.put(`${BASE}/${id}`, data).then((r) => r.data);
}
export function deleteTenant(id) {
    return httpClient.delete(`${BASE}/${id}`);
}
// ============================================================
// Default Connection String
// ============================================================
export function getDefaultConnectionString(id) {
    return httpClient.get(`${BASE}/${id}/default-connection-string`);
}
export function updateDefaultConnectionString(id, defaultConnectionString) {
    return httpClient.put(`${BASE}/${id}/default-connection-string`, undefined, {
        params: { defaultConnectionString },
    });
}
export function deleteDefaultConnectionString(id) {
    return httpClient.delete(`${BASE}/${id}/default-connection-string`);
}
// ============================================================
// Named Connection Strings (multiple)
// ============================================================
export function getConnectionStrings(id) {
    return httpClient
        .get(`${BASE}/${id}/connection-strings`)
        .then((r) => r.data);
}
export function setConnectionString(id, name, value) {
    return httpClient
        .put(`${BASE}/${id}/connection-strings/${name}`, value, {
        headers: { 'Content-Type': 'application/json' },
    })
        .then(() => undefined);
}
export function deleteConnectionString(id, name) {
    return httpClient
        .delete(`${BASE}/${id}/connection-strings/${name}`)
        .then(() => undefined);
}
// ============================================================
// Tenant Lookup
// ============================================================
export function findTenantById(id) {
    return httpClient.get(`/api/abp/multi-tenancy/tenants/by-id/${id}`);
}
export function findTenantByName(name) {
    return httpClient.get(`/api/abp/multi-tenancy/tenants/by-name/${name}`);
}
