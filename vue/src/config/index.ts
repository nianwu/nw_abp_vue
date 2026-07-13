/**
 * 应用配置 — 环境变量、默认值、Provider
 */
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
export { defaultAppConfig } from './defaults'
export { remoteConfigProvider } from './providers/remote-config-provider'
export { standaloneConfigProvider } from './providers/standalone-config-provider'
// Re-export from stores for backward compat
export { useAppConfigStore } from '@/stores/app-config.store'
