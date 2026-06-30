/**
 * 本地化 composable
 */
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/session'
import { switchLanguage } from '@/plugins/i18n'

export function useLocalization() {
  const { t, locale } = useI18n()
  const session = useSessionStore()

  async function changeLanguage(lang: string): Promise<void> {
    await switchLanguage(lang)
    session.setLanguage(lang)
  }

  return { t, locale, changeLanguage }
}
