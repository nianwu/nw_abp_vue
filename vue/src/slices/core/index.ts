/**
 * Core 切片 — 跨切面基础设施
 *
 * 提供所有业务切片共享的 Pinia stores（auth/session）、
 * composables（useAuth/useLocalization/useBreakpoint）、
 * 本地化默认值、以及 Standalone 模式运行所需的工具函数。
 */

// ============================================================
// Stores
// ============================================================
export { useAuthStore } from './stores/auth-store'
export { useSessionStore } from './stores/session-store'

// ============================================================
// Composables
// ============================================================
export { useAuth } from './composables/useAuth'
export { useLocalization } from './composables/useLocalization'
export { useBreakpoint } from './composables/useBreakpoint'

// ============================================================
// Defaults
// ============================================================
export { defaultLocalization } from './defaults/localization'

// ============================================================
// Standalone 工具函数
// ============================================================
export {
  load, save, seed, remove, resetAll,
} from './standalone/storage'

export { registerStandaloneHttpInterceptor } from './standalone/http-interceptor'

export { seedDemoData } from './standalone/seeds/demo'
