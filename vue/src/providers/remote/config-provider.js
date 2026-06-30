/**
 * RemoteConfigProvider — 从后端获取 ApplicationConfiguration
 */
import httpClient from '@/api/http';
export const remoteConfigProvider = {
    async fetchConfig() {
        const { data } = await httpClient.get('/api/abp/application-configuration', { params: { includeLocalizationResources: false } });
        return data;
    },
};
