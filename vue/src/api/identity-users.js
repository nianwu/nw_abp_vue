/**
 * Identity Users API Proxy
 * @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖
 */
import { httpClient } from './http';
const BASE = '/api/identity/users';
export function getUsers(params) {
    return httpClient.get(BASE, { params }).then((r) => r.data);
}
export function createUser(data) {
    return httpClient.post(BASE, data).then((r) => r.data);
}
export function getUser(id) {
    return httpClient.get(`${BASE}/${id}`).then((r) => r.data);
}
export function updateUser(id, data) {
    return httpClient.put(`${BASE}/${id}`, data).then((r) => r.data);
}
export function deleteUser(id) {
    return httpClient.delete(`${BASE}/${id}`);
}
export function getAssignableRoles() {
    return httpClient.get(`${BASE}/assignable-roles`).then((r) => r.data);
}
export function getUserByEmail(email) {
    return httpClient.get(`${BASE}/by-email/${encodeURIComponent(email)}`).then((r) => r.data);
}
export function getUserByUsername(userName) {
    return httpClient.get(`${BASE}/by-username/${encodeURIComponent(userName)}`).then((r) => r.data);
}
export function getUserRoles(id) {
    return httpClient.get(`${BASE}/${id}/roles`).then((r) => r.data);
}
export function updateUserRoles(id, data) {
    return httpClient.put(`${BASE}/${id}/roles`, data);
}
export function lookupUser(id) {
    return httpClient.get(`${BASE}/lookup/${id}`).then((r) => r.data);
}
export function lookupUserByUsername(userName) {
    return httpClient.get(`${BASE}/lookup/by-username/${encodeURIComponent(userName)}`).then((r) => r.data);
}
export function searchUsers(params) {
    return httpClient.get(`${BASE}/lookup/search`, { params }).then((r) => r.data);
}
export function getUserLookupCount(params) {
    return httpClient.get(`${BASE}/lookup/count`, { params }).then((r) => r.data);
}
