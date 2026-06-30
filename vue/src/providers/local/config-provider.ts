/**
 * LocalConfigProvider — 返回静态 ApplicationConfigurationDto，不发起 API 请求
 */
import { mockAppConfig } from '@/mocks/data/app-config'
import type { ApplicationConfigurationDto } from '@/types/abp'
import type { ConfigProvider } from '@/providers/types'

export const localConfigProvider: ConfigProvider = {
  async fetchConfig(): Promise<ApplicationConfigurationDto> {
    return mockAppConfig
  },
}
