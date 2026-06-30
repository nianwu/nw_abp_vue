/**
 * LocalI18nProvider — 使用内置静态翻译，不发起 API 请求
 */
import i18n from '@/plugins/i18n';
import { useSessionStore } from '@/stores/session';
import { mockLocalization } from '@/mocks/data/localization';
export const localI18nProvider = {
    async loadMessages(lang) {
        const messages = {};
        if (mockLocalization?.resources) {
            for (const [name, resource] of Object.entries(mockLocalization.resources)) {
                const r = resource;
                if (r.texts)
                    messages[name] = r.texts;
            }
        }
        i18n.global.setLocaleMessage(lang, messages);
        i18n.global.locale = lang;
    },
    async switchLanguage(lang) {
        await this.loadMessages(lang);
        useSessionStore().setLanguage(lang);
    },
};
export { i18n };
