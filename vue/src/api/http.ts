/**
 * HTTP 客户端 — Axios 实例 + ABP 5 拦截器链
 *
 * 此文件是唯一手工维护的 HTTP 基础设施文件。
 * ABP CLI (abp generate-proxy) 生成的 API 代理文件依赖此处导出的 httpClient。
 *
 * ⚠️ 避免顶层 import Pinia store（会导致循环依赖）。
 *    拦截器内通过动态 import() 访问 store，仅在请求时调用，此时 Pinia 已注册。
 */

import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/slices/config'
import type { RemoteServiceErrorResponse } from '@/types/abp'

// ============================================================
// Axios 实例
// ============================================================

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ============================================================
// 拦截器内懒加载工具（动态 import 避免循环依赖）
// ============================================================

async function getAccessToken(): Promise<string | null> {
  try {
    const { useAuthStore } = await import('@/slices/core')
    return useAuthStore().accessToken || null
  } catch {
    return null
  }
}

async function getTenantId(): Promise<string | null> {
  try {
    const { useSessionStore } = await import('@/slices/core')
    return useSessionStore().tenantId || null
  } catch {
    return null
  }
}

async function getLanguage(): Promise<string | null> {
  try {
    const { useSessionStore } = await import('@/slices/core')
    return useSessionStore().language || null
  } catch {
    return null
  }
}

async function getTimezone(): Promise<string> {
  try {
    const { useSessionStore } = await import('@/slices/core')
    return useSessionStore().timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

async function handle401() {
  try {
    const { useAuthStore } = await import('@/slices/core')
    useAuthStore().$reset()
    // 登出重定向在 A4 的 useAuth 中实现
    window.dispatchEvent(new CustomEvent('abp:auth-expired'))
  } catch {
    // 静默处理
  }
}

// ============================================================
// 请求拦截器 1-4: 注入 ABP 标准请求头
// ============================================================

httpClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const [token, tenantId, language, timezone] = await Promise.all([
    getAccessToken(),
    getTenantId(),
    getLanguage(),
    getTimezone(),
  ])

  if (token) config.headers.Authorization = `Bearer ${token}`
  if (tenantId) config.headers['__tenant'] = tenantId
  if (language) config.headers['Accept-Language'] = language
  config.headers['X-Timezone'] = timezone

  return config
})

// ============================================================
// 响应拦截器 5: 错误处理 + 401 登出
// ============================================================

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<RemoteServiceErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        handle401()
        return Promise.reject(error)
      }

      if (data?.error) {
        const abpError = {
          code: data.error.code,
          message: data.error.message,
          details: data.error.details,
          validationErrors: data.error.validationErrors || [],
        }
        return Promise.reject({ ...error, abpError })
      }
    }
    return Promise.reject(error)
  },
)

// ============================================================
// 导出
// ============================================================

export { httpClient }
export default httpClient
