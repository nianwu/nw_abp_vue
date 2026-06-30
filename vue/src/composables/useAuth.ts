/**
 * 认证 composable — 封装 OIDC 登录/登出/Token 获取
 */
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userManager } from '@/plugins/oidc'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  /** 发起 OIDC 登录 */
  async function login(): Promise<void> {
    await userManager.signinRedirect()
  }

  /** OIDC 回调处理 */
  async function handleCallback(): Promise<void> {
    const user = await userManager.signinRedirectCallback()
    authStore.setUser(user)
    const returnUrl = (user.state as { returnUrl?: string })?.returnUrl || '/'
    await router.push(returnUrl)
  }

  /** 登出 */
  async function logout(): Promise<void> {
    authStore.clearUser()
    await userManager.signoutRedirect()
  }

  /** 获取当前 access token */
  async function getToken(): Promise<string | null> {
    const user = await userManager.getUser()
    return user?.access_token || null
  }

  /** 静默登录（已有 session 时恢复） */
  async function trySilentLogin(): Promise<boolean> {
    const user = await userManager.getUser()
    if (user && !user.expired) {
      authStore.setUser(user)
      return true
    }
    try {
      const renewed = await userManager.signinSilent()
      if (renewed) {
        authStore.setUser(renewed)
        return true
      }
    } catch {
      // 静默登录失败，需要完整登录
    }
    return false
  }

  return { login, handleCallback, logout, getToken, trySilentLogin }
}
