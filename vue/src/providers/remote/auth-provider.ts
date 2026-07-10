/**
 * RemoteAuthProvider — 使用 oidc-client-ts 进行 OIDC 认证
 */
import { useAuthStore } from '@/slices/core'
import { userManager } from '@/plugins/oidc'
import type { AuthProvider } from '@/providers/types'

export const remoteAuthProvider: AuthProvider = {
  async trySilentLogin(): Promise<boolean> {
    const authStore = useAuthStore()
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
      // 静默登录失败
    }
    return false
  },

  async login() {
    await userManager.signinRedirect()
  },

  async logout() {
    const authStore = useAuthStore()
    authStore.clearUser()
    await userManager.signoutRedirect()
  },

  async getToken() {
    const user = await userManager.getUser()
    return user?.access_token || null
  },
}
