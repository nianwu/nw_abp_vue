/**
 * 本地化 composable
 */
import { useI18n } from 'vue-i18n'
import { providers } from '@/providers'

export function useLocalization() {
  const { t, locale } = useI18n()

  async function changeLanguage(lang: string): Promise<void> {
    await providers.i18n.switchLanguage(lang)
  }

  return { t, locale, changeLanguage }
}
