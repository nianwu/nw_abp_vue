/**
 * LocalConfigProvider — 返回静态 ApplicationConfigurationDto，不发起 API 请求
 */
import { mockAppConfig } from '@/mocks/data/app-config';
export const localConfigProvider = {
    async fetchConfig() {
        return mockAppConfig;
    },
};
