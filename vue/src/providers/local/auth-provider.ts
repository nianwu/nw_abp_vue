/**
 * LocalAuthProvider — 注入模拟认证态，跳过 OIDC 交互
 */
import { useAuthStore } from '@/stores/auth'
import type { AuthProvider } from '@/providers/types'

export const localAuthProvider: AuthProvider = {
  async trySilentLogin(): Promise<boolean> {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) return true
    authStore.setTokens(
      'local-access-token-for-dev',
      'local-id-token',
      'local-refresh-token',
    )
    return true
  },

  async login(): Promise<void> {
    // 本地模式：直接标记已认证
    const authStore = useAuthStore()
    authStore.setTokens(
      'local-access-token-for-dev',
      'local-id-token',
      'local-refresh-token',
    )
  },

  async logout(): Promise<void> {
    const authStore = useAuthStore()
    authStore.clearUser()
  },

  async getToken(): Promise<string | null> {
    return useAuthStore().accessToken
  },
}
