/**
 * Provider 注册中心 — Vite 构建时根据 VITE_PROVIDER_MODE 选择实现
 *
 *   VITE_PROVIDER_MODE=standalone → 独立模式（解耦接口依赖，localStorage + 种子数据）
 *   VITE_PROVIDER_MODE=remote     → 联调模式（后端 API + OIDC）
 *
 * 业务代码导入：
 *   import { providers, i18n } from '@/providers'
 */
import type { AppProviders } from './types'
import { standaloneI18nProvider, i18n as standaloneI18n } from './standalone/i18n-provider'
import { standaloneConfigProvider } from './standalone/config-provider'
import { standaloneAuthProvider } from './standalone/auth-provider'
import { remoteI18nProvider, i18n as remoteI18n } from './remote/i18n-provider'
import { remoteConfigProvider } from './remote/config-provider'
import { remoteAuthProvider } from './remote/auth-provider'

const MODE: 'standalone' | 'remote' =
  (import.meta.env.VITE_PROVIDER_MODE as 'standalone' | 'remote') || 'standalone'

function createProviders(): { providers: AppProviders; i18n: any } {
  if (MODE === 'remote') {
    return {
      providers: {
        i18n: remoteI18nProvider,
        config: remoteConfigProvider,
        auth: remoteAuthProvider,
        setupInfrastructure: () => {
          // remote 模式无需额外基础设施（Vite proxy 转发到后端）
        },
      },
      i18n: remoteI18n,
    }
  }

  // standalone 模式 — 解耦接口依赖，快速开发迭代
  return {
    providers: {
      i18n: standaloneI18nProvider,
      config: standaloneConfigProvider,
      auth: standaloneAuthProvider,
      setupInfrastructure: async () => {
        const { seedDemoData } = await import('@/stores/standalone/seeds/demo')
        const { registerStandaloneHttpInterceptor } = await import('@/stores/standalone/http-interceptor')
        const { default: httpClient } = await import('@/api/http')
        seedDemoData()
        registerStandaloneHttpInterceptor(httpClient)
      },
    },
    i18n: standaloneI18n,
  }
}

const { providers: _p, i18n: _i } = createProviders()

export const providers: AppProviders = _p
export const i18n: any = _i
