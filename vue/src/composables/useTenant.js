/**
 * 租户 composable — 租户切换
 */
import { useSessionStore } from '@/stores/session';
import { useAppConfigStore } from '@/stores/app-config';
export function useTenant() {
    const session = useSessionStore();
    const appConfig = useAppConfigStore();
    const currentTenantName = () => appConfig.config?.currentTenant?.name || null;
    const isMultiTenancyEnabled = () => appConfig.config?.multiTenancy?.isEnabled || false;
    function switchTenant(tenantId) {
        session.setTenant(tenantId);
    }
    return { currentTenantName, isMultiTenancyEnabled, switchTenant };
}
