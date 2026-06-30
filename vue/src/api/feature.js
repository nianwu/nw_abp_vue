/**
 * ABP Feature Management API 代理
 *
 * @generated — 临时手写，后端可用时执行 `abp generate-proxy` 覆盖。
 */
import { httpClient } from '@/api/http';
/**
 * ABP Feature Management API 基础路径
 *
 * 须包含 `/api` 前缀以确保 mock 拦截器正确匹配。
 */
const BASE = '/api/feature-management/features';
/**
 * 获取功能列表
 *
 * GET {BASE}
 * @param params 查询参数（providerName / providerKey）
 */
export function getFeatures(params) {
    return httpClient
        .get(BASE, { params })
        .then((res) => res.data);
}
/**
 * 更新功能值
 *
 * PUT {BASE}
 * @param data   更新 DTO
 * @param params 查询参数（providerName / providerKey）
 */
export function updateFeatures(data, params) {
    return httpClient.put(BASE, data, { params }).then(() => undefined);
}
/**
 * 删除功能值（重置为默认）
 *
 * DELETE {BASE}
 * @param params 查询参数（providerName / providerKey）
 */
export function deleteFeatures(params) {
    return httpClient.delete(BASE, { params }).then(() => undefined);
}
