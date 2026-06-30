/**
 * 权限 composable — 从 app-config store 的 grantedPolicies 校验
 */
import { useAppConfigStore } from '@/stores/app-config';
export function usePermission() {
    const appConfig = useAppConfigStore();
    /** 检查当前用户是否持有指定 policy */
    function hasPermission(policy) {
        if (!appConfig.config?.auth?.grantedPolicies)
            return false;
        return appConfig.config.auth.grantedPolicies[policy] === true;
    }
    /** 批量检查，全部满足返回 true */
    function hasAllPermissions(policies) {
        return policies.every((p) => hasPermission(p));
    }
    /** 批量检查，任一满足返回 true */
    function hasAnyPermission(policies) {
        return policies.some((p) => hasPermission(p));
    }
    return { hasPermission, hasAllPermissions, hasAnyPermission };
}
/** 路由守卫用的权限检查函数（可用于 beforeEach） */
export function permissionGuard(policy) {
    if (!policy)
        return true;
    const { hasPermission } = usePermission();
    return hasPermission(policy);
}
