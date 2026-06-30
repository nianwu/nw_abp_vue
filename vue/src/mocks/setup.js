import httpClient from '@/api/http';
import { mockAppConfig } from './data/app-config';
import { mockLocalization } from './data/localization';
import { registerMockInterceptor } from './interceptors/mock-http';
/**
 * 注入模拟 i18n 翻译资源（不发起 API 请求）
 */
export function setupMockI18n(i18n) {
    const lang = 'zh-Hans';
    const messages = {};
    if (mockLocalization?.resources) {
        for (const [resourceName, resource] of Object.entries(mockLocalization.resources)) {
            const r = resource;
            if (r.texts)
                messages[resourceName] = r.texts;
        }
    }
    i18n.global.setLocaleMessage(lang, messages);
    i18n.global.locale = lang;
}
/**
 * 注入模拟用户认证状态
 */
export function setupMockAuth(authStore) {
    authStore.setTokens('mock-access-token-for-local-dev', 'mock-id-token', 'mock-refresh-token');
}
/**
 * 注入模拟应用配置
 */
export function setupMockAppConfig(appConfigStore) {
    // 直接写入 store 内部 ref（pinia 允许从外部设置）
    appConfigStore.$patch({ config: mockAppConfig });
}
/**
 * 注册 Mock HTTP 拦截器
 */
export function setupMockHttp() {
    registerMockInterceptor(httpClient);
}
/**
 * 一键设置全部 Mock 环境
 */
export async function setupMockEnvironment(i18n, authStore, appConfigStore) {
    setupMockI18n(i18n);
    setupMockAuth(authStore);
    setupMockAppConfig(appConfigStore);
    setupMockHttp();
}
