/**
 * 环境变量配置
 * 所有环境相关变量从 import.meta.env 读取，Vite 在构建时替换
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const OAUTH_AUTHORITY =
  import.meta.env.VITE_OAUTH_AUTHORITY || 'https://localhost:44300'

export const OAUTH_CLIENT_ID =
  import.meta.env.VITE_OAUTH_CLIENT_ID || 'TodoApp_App'

export const OAUTH_REDIRECT_URI =
  import.meta.env.VITE_OAUTH_REDIRECT_URI || window.location.origin + '/oidc-callback'

export const OAUTH_POST_LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_OAUTH_POST_LOGOUT_REDIRECT_URI || window.location.origin

export const OAUTH_SILENT_REDIRECT_URI =
  import.meta.env.VITE_OAUTH_SILENT_REDIRECT_URI || window.location.origin + '/silent-renew.html'

export const OAUTH_SCOPE =
  import.meta.env.VITE_OAUTH_SCOPE || 'openid profile email phone address roles offline_access'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TodoApp'
