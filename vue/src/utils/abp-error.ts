/**
 * ABP RemoteServiceErrorResponse 解析工具
 */
import type { RemoteServiceErrorInfo, RemoteServiceValidationErrorInfo } from '@/types/abp'

export interface ParsedAbpError {
  code?: string
  message?: string
  details?: string
  /** 字段名 → 错误消息映射 */
  fieldErrors: Record<string, string[]>
}

/** 将 ABP 验证错误数组转为字段名索引的 Map */
function mapValidationErrors(
  errors?: RemoteServiceValidationErrorInfo[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  if (!errors) return map
  for (const e of errors) {
    const msg = e.message || 'Validation error'
    if (e.members && e.members.length > 0) {
      for (const member of e.members) {
        if (!map[member]) map[member] = []
        map[member].push(msg)
      }
    } else {
      if (!map['_general']) map['_general'] = []
      map['_general'].push(msg)
    }
  }
  return map
}

/** 从 axios 响应中提取 ABP 业务错误 */
export function parseAbpError(error: unknown): ParsedAbpError | null {
  const e = error as { abpError?: RemoteServiceErrorInfo; response?: { data?: RemoteServiceErrorInfo } }
  const info = e.abpError || e.response?.data

  if (!info) return null

  return {
    code: info.code,
    message: info.message,
    details: info.details,
    fieldErrors: mapValidationErrors(
      (info as RemoteServiceErrorInfo & { validationErrors?: RemoteServiceValidationErrorInfo[] }).validationErrors,
    ),
  }
}
