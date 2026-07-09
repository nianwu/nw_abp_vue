/**
 * OIDC 插件 — oidc-client-ts UserManager 配置
 *
 * PKCE 流程 + 静默刷新 + Remember Me
 */
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import {
  OAUTH_AUTHORITY,
  OAUTH_CLIENT_ID,
  OAUTH_REDIRECT_URI,
  OAUTH_POST_LOGOUT_REDIRECT_URI,
  OAUTH_SILENT_REDIRECT_URI,
  OAUTH_SCOPE,
} from '@/slices/config'

export const userManager = new UserManager({
  authority: OAUTH_AUTHORITY,
  client_id: OAUTH_CLIENT_ID,
  redirect_uri: OAUTH_REDIRECT_URI,
  post_logout_redirect_uri: OAUTH_POST_LOGOUT_REDIRECT_URI,
  silent_redirect_uri: OAUTH_SILENT_REDIRECT_URI,
  scope: OAUTH_SCOPE,
  response_type: 'code',
  loadUserInfo: true,
  automaticSilentRenew: true,
  monitorSession: true,
  checkSessionIntervalInSeconds: 5,
  silentRequestTimeoutInSeconds: 10,
  includeIdTokenInSilentRenew: false,
  userStore: new WebStorageStateStore({ store: localStorage }),
})

userManager.events.addAccessTokenExpiring(() => {
  userManager.signinSilent().catch(() => {
    // 静默刷新失败，降级为重新登录
  })
})
