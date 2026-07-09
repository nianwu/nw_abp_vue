/**
 * Config 切片 — 应用配置管理
 *
 * 提供环境变量、应用配置 Store、默认配置数据，以及双模式（remote/standalone）的配置 provider。
 *
 * 对外接口：
 *   import { API_BASE_URL, APP_NAME, useAppConfigStore, defaultAppConfig,
 *            remoteConfigProvider, standaloneConfigProvider } from '@/slices/config'
 */

// 环境变量
export {
  API_BASE_URL,
  OAUTH_AUTHORITY,
  OAUTH_CLIENT_ID,
  OAUTH_REDIRECT_URI,
  OAUTH_POST_LOGOUT_REDIRECT_URI,
  OAUTH_SILENT_REDIRECT_URI,
  OAUTH_SCOPE,
  APP_NAME,
} from './env'

// 应用配置 Store（Pinia）
export { useAppConfigStore } from './app-config.store'

// 默认配置（standalone 模式使用）
export { defaultAppConfig } from './defaults'

// Provider 实现（双模式）
export { remoteConfigProvider } from './providers/remote-config-provider'
export { standaloneConfigProvider } from './providers/standalone-config-provider'
