/**
 * 租户 composable — 租户切换
 */
import { useSessionStore } from '@/slices/core'
import { useAppConfigStore } from '@/slices/config'

export function useTenant() {
  const session = useSessionStore()
  const appConfig = useAppConfigStore()

  const currentTenantName = () => appConfig.config?.currentTenant?.name || null
  const isMultiTenancyEnabled = () => appConfig.config?.multiTenancy?.isEnabled || false

  function switchTenant(tenantId: string | null): void {
    session.setTenant(tenantId)
  }

  return { currentTenantName, isMultiTenancyEnabled, switchTenant }
}
