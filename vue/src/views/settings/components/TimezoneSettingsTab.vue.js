/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useSessionStore } from '@/stores/session';
import { showSuccess, showError } from '@/components/AbpToast';
import * as settingsApi from '@/api/settings';
// ---- stores ----
const sessionStore = useSessionStore();
// ---- state ----
const loading = ref(true);
const saving = ref(false);
const timezoneList = ref([]);
const selectedTimezone = ref('');
const localTimezone = ref('');
const timezoneError = ref('');
// ---- load ----
async function loadTimezones() {
    loading.value = true;
    timezoneError.value = '';
    try {
        const zones = await settingsApi.getTimezones();
        timezoneList.value = zones;
        // pre-select current timezone from session or local
        selectedTimezone.value = sessionStore.timezone || localTimezone.value;
    }
    catch {
        timezoneError.value = '加载时区列表失败';
    }
    finally {
        loading.value = false;
    }
}
onMounted(() => {
    localTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    loadTimezones();
});
// ---- save ----
async function handleSave() {
    if (!selectedTimezone.value) {
        showError('请选择一个时区');
        return;
    }
    saving.value = true;
    try {
        await settingsApi.updateTimezone(selectedTimezone.value);
        // update session store — http interceptor reads X-Timezone from here
        sessionStore.timezone = selectedTimezone.value;
        showSuccess('时区设置已保存');
    }
    catch {
        showError('保存时区设置失败');
    }
    finally {
        saving.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-8 text-center text-gray-400" },
    });
}
else if (__VLS_ctx.timezoneError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-8 text-center text-red-400" },
    });
    (__VLS_ctx.timezoneError);
    const __VLS_0 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        ...{ class: "ml-3" },
        size: "small",
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        ...{ class: "ml-3" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (__VLS_ctx.loadTimezones)
    };
    __VLS_3.slots.default;
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500 mb-4" },
    });
    const __VLS_8 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        labelPosition: "top",
    }));
    const __VLS_10 = __VLS_9({
        labelPosition: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        label: "时区",
    }));
    const __VLS_14 = __VLS_13({
        label: "时区",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        modelValue: (__VLS_ctx.selectedTimezone),
        ...{ class: "w-full" },
        placeholder: "请选择时区",
        filterable: true,
        clearable: true,
    }));
    const __VLS_18 = __VLS_17({
        modelValue: (__VLS_ctx.selectedTimezone),
        ...{ class: "w-full" },
        placeholder: "请选择时区",
        filterable: true,
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    for (const [tz] of __VLS_getVForSourceType((__VLS_ctx.timezoneList))) {
        const __VLS_20 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            key: (tz),
            label: (tz),
            value: (tz),
        }));
        const __VLS_22 = __VLS_21({
            key: (tz),
            label: (tz),
            value: (tz),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    var __VLS_19;
    var __VLS_15;
    if (__VLS_ctx.selectedTimezone) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-1 text-sm text-gray-400" },
        });
        (__VLS_ctx.localTimezone);
    }
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-6" },
    });
    const __VLS_24 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_27.slots.default;
    var __VLS_27;
}
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            saving: saving,
            timezoneList: timezoneList,
            selectedTimezone: selectedTimezone,
            localTimezone: localTimezone,
            timezoneError: timezoneError,
            loadTimezones: loadTimezones,
            handleSave: handleSave,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
