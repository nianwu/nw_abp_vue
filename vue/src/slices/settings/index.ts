/**
 * Settings 切片 — 系统设置管理
 *
 * 提供邮件设置、密码复杂度设置、时区设置等功能。
 *
 * 对外接口：
 *   import { /* API from @/api/ *, types from @/types/ *,
 *            standaloneGetEmailSettings, ... } from '@/slices/settings'
 */

// API — 从生成层 re-export（abp generate-proxy 输出到 @/api/）
export * from '@/api/settings'

// Types — 从生成层 re-export（abp generate-proxy 输出到 @/types/）
export type { EmailSettingsDto, IdentityPasswordSettingsDto } from '@/types/settings'

// Store — Standalone 模式数据存储
export {
  standaloneGetEmailSettings,
  standaloneSetEmailSettings,
  standaloneUpdateEmailSettings,
  standaloneGetTimezone,
  standaloneSetTimezone,
  standaloneGetTimezones,
  standaloneSetTimezones,
  standaloneGetPasswordSettings,
  standaloneUpdatePasswordSettings,
} from './stores/settings-store'

// Views — 页面组件
export { default as SettingsView } from './views/SettingsView.vue'
