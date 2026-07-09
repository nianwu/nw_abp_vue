/**
 * RemoteConfigProvider — 从后端获取 ApplicationConfiguration
 */
import httpClient from '@/api/http'
import type { ApplicationConfigurationDto } from '@/types/abp'
import type { ConfigProvider } from '@/providers/types'

export const remoteConfigProvider: ConfigProvider = {
  async fetchConfig(): Promise<ApplicationConfigurationDto> {
    const { data } = await httpClient.get<ApplicationConfigurationDto>(
      '/api/abp/application-configuration',
      { params: { includeLocalizationResources: false } },
    )
    return data
  },
}
