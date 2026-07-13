/**
 * 权限管理 localStorage store — 权限树（只读，由种子注入）
 *
 * 数据存储于 localStorage，键：abp:local:permissions
 */

import { load, save } from '@/core'
import type { GetPermissionListResultDto, PermissionGroupDto, PermissionGrantInfoDto } from '@/types/permission'

const KEY = 'permissions'

export function standaloneGetPermissions(): GetPermissionListResultDto | null {
  return load<GetPermissionListResultDto>(KEY)
}

export function standaloneSetPermissions(data: GetPermissionListResultDto): void {
  save(KEY, data)
}

export function standaloneUpdatePermission(permissionName: string, isGranted: boolean): void {
  const data = load<GetPermissionListResultDto>(KEY)
  if (!data) return
  for (const group of data.groups as PermissionGroupDto[]) {
    for (const perm of (group.permissions || []) as PermissionGrantInfoDto[]) {
      if (perm.name === permissionName) {
        perm.isGranted = isGranted
      }
    }
  }
  save(KEY, data)
}
