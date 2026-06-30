/**
 * ABP Account API 代理
 *
 * @generated — 后端可用时执行 `abp generate-proxy` 重新生成覆盖此文件
 */
import { httpClient } from '@/api/http';
/**
 * 注册新用户
 * POST /api/account/register
 */
export function register(data) {
    return httpClient.post('/api/account/register', data).then((res) => res.data);
}
/**
 * 发送密码重置验证码
 * POST /api/account/send-password-reset-code
 */
export function sendPasswordResetCode(data) {
    return httpClient.post('/api/account/send-password-reset-code', data).then(() => { });
}
/**
 * 验证密码重置令牌
 * POST /api/account/verify-password-reset-token
 */
export function verifyPasswordResetToken(data) {
    return httpClient.post('/api/account/verify-password-reset-token', data).then(() => { });
}
/**
 * 重置密码
 * POST /api/account/reset-password
 */
export function resetPassword(data) {
    return httpClient.post('/api/account/reset-password', data).then(() => { });
}
/**
 * 登录
 * POST /api/account/login
 */
export function login(data) {
    return httpClient.post('/api/account/login', data).then((res) => res.data);
}
/**
 * 登出
 * GET /api/account/logout
 */
export function logout() {
    return httpClient.get('/api/account/logout').then(() => { });
}
/**
 * 校验密码（登录前密码检查）
 * POST /api/account/check-password
 */
export function checkPassword(data) {
    return httpClient.post('/api/account/check-password', data).then((res) => res.data);
}
/**
 * 获取当前用户个人资料
 * GET /api/account/my-profile
 */
export function getProfile() {
    return httpClient.get('/api/account/my-profile').then((res) => res.data);
}
/**
 * 更新当前用户个人资料
 * PUT /api/account/my-profile
 */
export function updateProfile(data) {
    return httpClient.put('/api/account/my-profile', data).then((res) => res.data);
}
/**
 * 修改密码
 * POST /api/account/my-profile/change-password
 */
export function changePassword(data) {
    return httpClient.post('/api/account/my-profile/change-password', data).then(() => { });
}
/**
 * 刷新动态权限声明
 * POST /api/account/dynamic-claims/refresh
 */
export function refreshDynamicClaims() {
    return httpClient.post('/api/account/dynamic-claims/refresh').then(() => { });
}
