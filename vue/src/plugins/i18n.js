/**
 * vue-i18n 插件 — ABP 远程本地化资源加载
 */
import { createI18n } from 'vue-i18n';
import httpClient from '@/api/http';
import { useSessionStore } from '@/stores/session';
const i18n = createI18n({
    legacy: false,
    locale: 'zh-Hans',
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
});
/** 从后端加载指定语言的本地化资源 */
export async function loadLocaleMessages(lang) {
    const { data } = await httpClient.get('/api/abp/application-localization', { params: { cultureName: lang, onlyDynamics: false } });
    if (data?.resources) {
        const messages = {};
        for (const [resourceName, resource] of Object.entries(data.resources)) {
            const r = resource;
            if (r.texts)
                messages[resourceName] = r.texts;
        }
        i18n.global.setLocaleMessage(lang, messages);
    }
}
/** 切换语言并重新加载资源 */
export async function switchLanguage(lang) {
    await loadLocaleMessages(lang);
    i18n.global.locale = lang;
    useSessionStore().setLanguage(lang);
}
export default i18n;
