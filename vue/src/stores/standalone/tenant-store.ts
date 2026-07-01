/**
 * 租户管理 localStorage store — 租户 CRUD + 连接字符串管理
 *
 * 数据存储于 localStorage，键：abp:local:tenants / abp:local:connectionStrings
 */

import { load, save } from './storage'
import type { TenantDto } from '@/types/tenant'
import type { PagedResultDto } from '@/types/api'

const TENANTS_KEY = 'tenants'
const CONN_STR_KEY = 'connectionStrings'

function getTenants(): TenantDto[] {
  return load<TenantDto[]>(TENANTS_KEY) || []
}

function setTenants(tenants: TenantDto[]): void {
  save(TENANTS_KEY, tenants)
}

function getConnectionStrings(): Record<string, string> {
  return load<Record<string, string>>(CONN_STR_KEY) || {}
}

function setConnectionStrings(data: Record<string, string>): void {
  save(CONN_STR_KEY, data)
}

// ============================================================
// 租户 CRUD
// ============================================================

let tenantSeq = load<number>('tenantSeq') || 0

export function setTenantSeq(n: number): void {
  tenantSeq = n
  save('tenantSeq', n)
}

export function standaloneGetTenants(params?: {
  filter?: string
  skipCount?: number
  maxResultCount?: number
}): PagedResultDto<TenantDto> {
  const { filter = '', skipCount = 0, maxResultCount = 10 } = params || {}
  const tenants = getTenants()
  let filtered = tenants.filter(
    (t) => !filter || (t.name || '').toLowerCase().includes(filter.toLowerCase()),
  )
  const total = filtered.length
  filtered = filtered.slice(skipCount, skipCount + maxResultCount)
  return { items: filtered, totalCount: total }
}

export function standaloneGetTenant(id: string): TenantDto | undefined {
  return getTenants().find((t) => t.id === id)
}

export function standaloneCreateTenant(data: {
  name: string
  adminEmailAddress: string
  adminPassword: string
}): TenantDto {
  const tenants = getTenants()
  setTenantSeq(tenantSeq + 1)
  const newTenant: TenantDto = {
    id: `t${tenantSeq + 1}`,
    name: data.name,
    isActive: true,
    adminEmailAddress: data.adminEmailAddress,
    editionName: 'Standard',
    creationTime: new Date().toISOString(),
    concurrencyStamp: `cs-t${tenantSeq + 1}`,
    extraProperties: {},
  }
  tenants.unshift(newTenant)
  setTenants(tenants)
  return newTenant
}

export function standaloneUpdateTenant(
  id: string,
  data: { name?: string; isActive?: boolean },
): TenantDto | undefined {
  const tenants = getTenants()
  const idx = tenants.findIndex((t) => t.id === id)
  if (idx === -1) return undefined
  if (data.name !== undefined) tenants[idx].name = data.name
  if (data.isActive !== undefined) tenants[idx].isActive = data.isActive
  tenants[idx].lastModificationTime = new Date().toISOString()
  setTenants(tenants)
  return tenants[idx]
}

export function standaloneDeleteTenant(id: string): boolean {
  const tenants = getTenants()
  const idx = tenants.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tenants.splice(idx, 1)
  setTenants(tenants)
  return true
}

// ============================================================
// 连接字符串
// ============================================================

export function standaloneGetDefaultConnectionString(id: string): string {
  return getConnectionStrings()[id] || ''
}

export function standaloneUpdateDefaultConnectionString(id: string, connStr: string): void {
  const data = getConnectionStrings()
  data[id] = connStr
  setConnectionStrings(data)
}

export function standaloneDeleteDefaultConnectionString(id: string): void {
  const data = getConnectionStrings()
  delete data[id]
  setConnectionStrings(data)
}
