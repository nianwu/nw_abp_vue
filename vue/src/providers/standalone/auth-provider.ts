/**
 * StandaloneAuthProvider — 注入模拟认证态，跳过 OIDC 交互
 */
import { useAuthStore } from '@/stores/auth'
import type { AuthProvider } from '@/providers/types'

export const standaloneAuthProvider: AuthProvider = {
  async trySilentLogin(): Promise<boolean> {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) return true
    authStore.setTokens(
      'standalone-access-token-for-dev',
      'standalone-id-token',
      'standalone-refresh-token',
    )
    return true
  },

  async login(): Promise<void> {
    // standalone 模式：直接标记已认证
    const authStore = useAuthStore()
    authStore.setTokens(
      'standalone-access-token-for-dev',
      'standalone-id-token',
      'standalone-refresh-token',
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
