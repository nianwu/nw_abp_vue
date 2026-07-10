/**
 * 认证守卫 — 未登录时跳转 OIDC 登录
 */
import type { Router } from 'vue-router'
import { useAuthStore } from '@/slices/core'

export function registerAuthGuard(router: Router): void {
  router.beforeEach(async (to, _from, next) => {
    // OIDC 回调页和白名单路由跳过认证
    // 公开路径：OIDC 回调、错误页、账户页面、meta.public
    if (
      to.path === '/oidc-callback' ||
      to.path.startsWith('/error/') ||
      to.path.startsWith('/account/') ||
      to.meta.public === true
    ) {
      return next()
    }

    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      // 存储目标 URL 用于回调后跳转
      return next({ path: '/oidc-callback', query: { redirect: to.fullPath } })
    }
    next()
  })
}
