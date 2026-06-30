/**
 * Provider 注册中心 — Vite 构建时根据 VITE_PROVIDER_MODE 选择实现
 *
 *   VITE_PROVIDER_MODE=local   → 独立开发（零外部依赖，静态数据 + HTTP 拦截）
 *   VITE_PROVIDER_MODE=remote  → 联调后端 + OIDC
 *
 * 业务代码导入：
 *   import { providers, i18n } from '@/providers'
 */
import type { AppProviders } from './types'
import { localI18nProvider, i18n as localI18n } from './local/i18n-provider'
import { localConfigProvider } from './local/config-provider'
import { localAuthProvider } from './local/auth-provider'
import { remoteI18nProvider, i18n as remoteI18n } from './remote/i18n-provider'
import { remoteConfigProvider } from './remote/config-provider'
import { remoteAuthProvider } from './remote/auth-provider'

const MODE: 'local' | 'remote' =
  (import.meta.env.VITE_PROVIDER_MODE as 'local' | 'remote') || 'local'

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

  // local 模式
  return {
    providers: {
      i18n: localI18nProvider,
      config: localConfigProvider,
      auth: localAuthProvider,
      setupInfrastructure: async () => {
        const { registerMockInterceptor } = await import('@/mocks/interceptors/mock-http')
        const { default: httpClient } = await import('@/api/http')
        registerMockInterceptor(httpClient)
      },
    },
    i18n: localI18n,
  }
}

const { providers: _p, i18n: _i } = createProviders()

export const providers: AppProviders = _p
export const i18n: any = _i
