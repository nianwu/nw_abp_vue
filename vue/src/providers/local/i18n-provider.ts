/**
 * LocalI18nProvider — 使用内置默认翻译，不发起 API 请求
 */
import i18n from '@/plugins/i18n'
import { useSessionStore } from '@/stores/session'
import { defaultLocalization } from '@/defaults/localization'
import type { I18nProvider } from '@/providers/types'

export const localI18nProvider: I18nProvider = {
  async loadMessages(lang: string) {
    const messages: Record<string, Record<string, string>> = {}
    if (defaultLocalization?.resources) {
      for (const [name, resource] of Object.entries(defaultLocalization.resources)) {
        const r = resource as { texts: Record<string, string> }
        if (r.texts) messages[name] = r.texts
      }
    }
    i18n.global.setLocaleMessage(lang, messages)
    ;(i18n.global.locale as any) = lang
  },

  async switchLanguage(lang: string) {
    await this.loadMessages(lang)
    useSessionStore().setLanguage(lang)
  },
}

export { i18n }
