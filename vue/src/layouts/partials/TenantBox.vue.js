/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useAppConfigStore } from '@/stores/app-config';
const appConfig = useAppConfigStore();
const isMultiTenancyEnabled = computed(() => appConfig.config?.multiTenancy?.isEnabled || false);
const currentTenant = computed(() => appConfig.config?.currentTenant?.name || 'Host');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.isMultiTenancyEnabled) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-gray-600 text-sm mr-2" },
    });
    (__VLS_ctx.currentTenant);
}
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isMultiTenancyEnabled: isMultiTenancyEnabled,
            currentTenant: currentTenant,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
