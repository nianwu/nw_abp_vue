/**
 * 核心基础设施 — standalone 模式工具
 */
export { load, save, seed, remove, resetAll } from './storage'
export { defaultLocalization } from './localization'
export { seedDemoData } from './seeds/demo'
export { registerStandaloneHttpInterceptor } from './http-interceptor'
