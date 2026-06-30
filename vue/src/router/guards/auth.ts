/**
 * 认证守卫 — 未登录时跳转 OIDC 登录
 */
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function registerAuthGuard(router: Router): void {
  router.beforeEach(async (to, _from, next) => {
    // OIDC 回调页和白名单路由跳过认证
    const publicPaths = ['/oidc-callback', '/error/403', '/error/404', '/error/500']
    if (publicPaths.includes(to.path)) return next()

    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      // 存储目标 URL 用于回调后跳转
      return next({ path: '/oidc-callback', query: { redirect: to.fullPath } })
    }
    next()
  })
}
