import { usePermission } from '@/composables/usePermission';
export function registerPermissionGuard(router) {
    router.beforeEach((to, _from, next) => {
        const policy = to.meta.requiredPolicy;
        if (!policy)
            return next();
        const { hasPermission } = usePermission();
        if (!hasPermission(policy)) {
            return next({ path: '/error/403' });
        }
        next();
    });
}
