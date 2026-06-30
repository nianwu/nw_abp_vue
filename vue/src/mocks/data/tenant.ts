/**
 * Mock 租户管理数据 — 支持内存 CRUD 操作
 */
import type { TenantDto } from '@/types/tenant'
import type { PagedResultDto } from '@/types/api'

const tenants: TenantDto[] = [
  { id: 't1', name: 'AcmeCorp', isActive: true, adminEmailAddress: 'admin@acme.com', editionName: 'Enterprise', creationTime: '2026-01-10T08:00:00Z', lastModificationTime: '2026-06-15T09:00:00Z', concurrencyStamp: 'cs-t1', extraProperties: {} },
  { id: 't2', name: 'BetaLabs', isActive: true, adminEmailAddress: 'admin@betalabs.io', editionName: 'Standard', creationTime: '2026-03-05T10:00:00Z', lastModificationTime: '2026-06-20T14:00:00Z', concurrencyStamp: 'cs-t2', extraProperties: {} },
  { id: 't3', name: 'GammaInc', isActive: false, adminEmailAddress: 'admin@gamma.co', editionName: 'Basic', creationTime: '2026-05-20T12:00:00Z', concurrencyStamp: 'cs-t3', extraProperties: {} },
]

let tenantSeq = 3

const connectionStrings: Record<string, string> = {
  t1: 'Server=localhost;Database=AcmeCorp;Trusted_Connection=True',
  t2: 'Server=localhost;Database=BetaLabs;Trusted_Connection=True',
}

export function mockGetTenants(params?: { filter?: string; skipCount?: number; maxResultCount?: number }): PagedResultDto<TenantDto> {
  const { filter = '', skipCount = 0, maxResultCount = 10 } = params || {}
  let filtered = tenants.filter(t => !filter || t.name?.toLowerCase().includes(filter.toLowerCase()))
  const total = filtered.length
  filtered = filtered.slice(skipCount, skipCount + maxResultCount)
  return { items: filtered, totalCount: total }
}

export function mockGetTenant(id: string): TenantDto | undefined {
  return tenants.find(t => t.id === id)
}

export function mockCreateTenant(data: { name: string; adminEmailAddress: string; adminPassword: string }): TenantDto {
  const newTenant: TenantDto = {
    id: `t${++tenantSeq}`,
    name: data.name,
    isActive: true,
    adminEmailAddress: data.adminEmailAddress,
    editionName: 'Standard',
    creationTime: new Date().toISOString(),
    concurrencyStamp: `cs-t${tenantSeq}`,
    extraProperties: {},
  }
  tenants.unshift(newTenant)
  return newTenant
}

export function mockUpdateTenant(id: string, data: { name: string }): TenantDto | undefined {
  const idx = tenants.findIndex(t => t.id === id)
  if (idx === -1) return undefined
  tenants[idx] = { ...tenants[idx], name: data.name }
  return tenants[idx]
}

export function mockDeleteTenant(id: string): boolean {
  const idx = tenants.findIndex(t => t.id === id)
  if (idx === -1) return false
  tenants.splice(idx, 1)
  return true
}

export function mockGetDefaultConnectionString(id: string): string {
  return connectionStrings[id] || ''
}

export function mockUpdateDefaultConnectionString(id: string, connStr: string): void {
  connectionStrings[id] = connStr
}

export function mockDeleteDefaultConnectionString(id: string): void {
  delete connectionStrings[id]
}
