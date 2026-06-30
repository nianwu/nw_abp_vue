/**
 * 应用配置 Store
 * 启动时从后端获取 ApplicationConfiguration 并缓存
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import httpClient from '@/api/http';
export const useAppConfigStore = defineStore('app-config', () => {
    const config = ref(null);
    const loading = ref(false);
    const error = ref(null);
    async function fetchConfig() {
        if (config.value)
            return; // 已缓存
        loading.value = true;
        error.value = null;
        try {
            const { data } = await httpClient.get('/api/abp/application-configuration', {
                params: { includeLocalizationResources: false },
            });
            config.value = data;
        }
        catch (e) {
            error.value = 'Failed to load application configuration';
            throw e;
        }
        finally {
            loading.value = false;
        }
    }
    return { config, loading, error, fetchConfig };
});
