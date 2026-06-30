/**
 * RemoteI18nProvider — 从后端 ABP API 加载远程本地化资源
 */
import i18n from '@/plugins/i18n';
import { loadLocaleMessages, switchLanguage } from '@/plugins/i18n';
export const remoteI18nProvider = {
    async loadMessages(lang) {
        await loadLocaleMessages(lang);
    },
    async switchLanguage(lang) {
        await switchLanguage(lang);
    },
};
/** 获取 vue-i18n 实例（用于 app.use） */
export { i18n };
