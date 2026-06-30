/**
 * 权限守卫 — 路由 meta.requiredPolicy 不满足时跳转 403
 */
import type { Router } from 'vue-router'
import { usePermission } from '@/composables/usePermission'

export function registerPermissionGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const policy = to.meta.requiredPolicy as string | undefined
    if (!policy) return next()

    const { hasPermission } = usePermission()
    if (!hasPermission(policy)) {
      return next({ path: '/error/403' })
    }
    next()
  })
}
