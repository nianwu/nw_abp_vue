/**
 * Mock 模块统一入口
 *
 * 使用方式（仅在 main.ts 的分流逻辑中调用）：
 *   import { setupMockEnvironment } from '@/mocks'
 *   await setupMockEnvironment(i18n, appConfig, auth, httpClient)
 */
export { setupMockEnvironment } from './setup';
