/**
 * 会话信息 Store
 *
 * 管理当前租户、用户语言、时区等会话级信息。
 * 使用 pinia-plugin-persistedstate 持久化到 localStorage。
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useSessionStore = defineStore('session', () => {
    // ---- state ----
    const tenantId = ref(null);
    const tenantName = ref(null);
    const language = ref(null);
    const timezone = ref(null);
    const currentUserId = ref(null);
    const currentUserName = ref(null);
    // ---- actions ----
    function setSession(info) {
        if (info.tenantId !== undefined)
            tenantId.value = info.tenantId;
        if (info.tenantName !== undefined)
            tenantName.value = info.tenantName;
        if (info.language !== undefined)
            language.value = info.language;
        if (info.timezone !== undefined)
            timezone.value = info.timezone;
        if (info.currentUserId !== undefined)
            currentUserId.value = info.currentUserId;
        if (info.currentUserName !== undefined)
            currentUserName.value = info.currentUserName;
    }
    function setLanguage(lang) { language.value = lang; }
    function setTenant(id) { tenantId.value = id; }
    function $reset() {
        tenantId.value = null;
        tenantName.value = null;
        language.value = null;
        timezone.value = null;
        currentUserId.value = null;
        currentUserName.value = null;
    }
    return {
        tenantId,
        tenantName,
        language,
        timezone,
        currentUserId,
        currentUserName,
        setLanguage, setTenant, setSession, $reset,
    };
}, {
    persist: {
        key: 'abp-session',
        pick: ['tenantId', 'tenantName', 'language', 'timezone', 'currentUserId', 'currentUserName'],
    },
});
