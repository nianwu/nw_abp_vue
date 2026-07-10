/**
 * 认证状态 Store
 *
 * 管理 OIDC 认证令牌与用户认证状态。
 * 使用 pinia-plugin-persistedstate 持久化到 localStorage。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'oidc-client-ts'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(null)
    const idToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const isAuthenticated = ref(false)
    const isInitialized = ref(false)

    /** 从 OIDC User 对象设置全部 token */
    function setUser(oidcUser: User) {
      accessToken.value = oidcUser.access_token
      idToken.value = oidcUser.id_token ?? null
      refreshToken.value = oidcUser.refresh_token ?? null
      isAuthenticated.value = true
      isInitialized.value = true
    }

    function setTokens(access: string | null, id: string | null, refresh: string | null) {
      accessToken.value = access
      idToken.value = id
      refreshToken.value = refresh
      isAuthenticated.value = !!access
    }

    function clearUser() {
      accessToken.value = null
      idToken.value = null
      refreshToken.value = null
      isAuthenticated.value = false
    }

    function $reset() {
      clearUser()
      isInitialized.value = false
    }

    return {
      accessToken, idToken, refreshToken, isAuthenticated, isInitialized,
      setUser, setTokens, clearUser, $reset,
    }
  },
  {
    persist: {
      key: 'abp-auth',
      pick: ['accessToken', 'idToken', 'refreshToken', 'isAuthenticated'],
    },
  },
)
