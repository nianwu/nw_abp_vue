/**
 * 会话信息 Store
 *
 * 管理当前租户、用户语言、时区等会话级信息。
 * 使用 pinia-plugin-persistedstate 持久化到 localStorage。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore(
  'session',
  () => {
    // ---- state ----
    const tenantId = ref<string | null>(null)
    const tenantName = ref<string | null>(null)
    const language = ref<string | null>(null)
    const timezone = ref<string | null>(null)
    const currentUserId = ref<string | null>(null)
    const currentUserName = ref<string | null>(null)

    // ---- actions ----
    function setSession(info: {
      tenantId?: string | null
      tenantName?: string | null
      language?: string | null
      timezone?: string | null
      currentUserId?: string | null
      currentUserName?: string | null
    }) {
      if (info.tenantId !== undefined) tenantId.value = info.tenantId
      if (info.tenantName !== undefined) tenantName.value = info.tenantName
      if (info.language !== undefined) language.value = info.language
      if (info.timezone !== undefined) timezone.value = info.timezone
      if (info.currentUserId !== undefined) currentUserId.value = info.currentUserId
      if (info.currentUserName !== undefined) currentUserName.value = info.currentUserName
    }

    function setLanguage(lang: string) { language.value = lang }
    function setTenant(id: string | null) { tenantId.value = id }

    function $reset() {
      tenantId.value = null
      tenantName.value = null
      language.value = null
      timezone.value = null
      currentUserId.value = null
      currentUserName.value = null
    }

    return {
      tenantId,
      tenantName,
      language,
      timezone,
      currentUserId,
      currentUserName,
      setLanguage, setTenant, setSession, $reset,
    }
  },
  {
    persist: {
      key: 'abp-session',
      pick: ['tenantId', 'tenantName', 'language', 'timezone', 'currentUserId', 'currentUserName'],
    },
  },
)
