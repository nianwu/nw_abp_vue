/**
 * StandaloneConfigProvider — 返回默认 ApplicationConfigurationDto，不发起 API 请求
 *
 * 使用内置默认配置（全权限），仅 standalone 模式使用。
 * remote 模式不使用此数据，远程获取失败直接报错。
 */
import { defaultAppConfig } from '@/defaults/app-config'
import type { ApplicationConfigurationDto } from '@/types/abp'
import type { ConfigProvider } from '@/providers/types'

export const standaloneConfigProvider: ConfigProvider = {
  async fetchConfig(): Promise<ApplicationConfigurationDto> {
    return defaultAppConfig
  },
}
