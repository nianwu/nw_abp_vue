/**
 * RemoteI18nProvider — 从后端 ABP API 加载远程本地化资源
 *
 * API 失败时降级到本地默认翻译词条（纯文案，无安全风险）。
 */
import i18n from '@/plugins/i18n'
import { loadLocaleMessages, switchLanguage } from '@/plugins/i18n'
import { useSessionStore } from '@/stores/session-store'
import { defaultLocalization } from '@/core'
import type { I18nProvider } from '@/providers/types'

export const remoteI18nProvider: I18nProvider = {
  async loadMessages(lang: string) {
    try {
      await loadLocaleMessages(lang)
    } catch {
      // 降级到本地默认词条
      const messages: Record<string, Record<string, string>> = {}
      if (defaultLocalization?.resources) {
        for (const [name, resource] of Object.entries(defaultLocalization.resources)) {
          const r = resource as { texts: Record<string, string> }
          if (r.texts) messages[name] = r.texts
        }
      }
      i18n.global.setLocaleMessage(lang, messages)
      ;(i18n.global.locale as any) = lang
    }
  },
  async switchLanguage(lang: string) {
    try {
      await switchLanguage(lang)
    } catch {
      await this.loadMessages(lang)
      useSessionStore().setLanguage(lang)
    }
  },
}

/** 获取 vue-i18n 实例（用于 app.use） */
export { i18n }
