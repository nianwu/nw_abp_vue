import { ref, watch } from 'vue';
import AbpModal from '@/components/AbpModal.vue';
import { showSuccess, showError } from '@/components/AbpToast';
import * as tenantApi from '@/api/tenant';
const props = defineProps();
const emit = defineEmits();
const loading = ref(false);
const submitting = ref(false);
const connectionStrings = ref([]);
watch(() => props.visible, async (v) => {
    if (!v || !props.tenantId)
        return;
    loading.value = true;
    try {
        const strings = await tenantApi.getConnectionStrings(props.tenantId);
        connectionStrings.value = Object.entries(strings || {}).map(([name, value]) => ({ name, value }));
    }
    catch {
        connectionStrings.value = [];
    }
    finally {
        loading.value = false;
    }
});
async function handleSave() {
    if (!props.tenantId)
        return;
    submitting.value = true;
    try {
        for (const cs of connectionStrings.value) {
            await tenantApi.setConnectionString(props.tenantId, cs.name, cs.value);
        }
        showSuccess('连接字符串已保存');
        emit('update:visible', false);
    }
    catch {
        showError('保存失败');
    }
    finally {
        submitting.value = false;
    }
}
async function handleDelete(name) {
    if (!props.tenantId)
        return;
    try {
        await tenantApi.deleteConnectionString(props.tenantId, name);
        connectionStrings.value = connectionStrings.value.filter((cs) => cs.name !== name);
        showSuccess('已删除');
    }
    catch {
        showError('删除失败');
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof AbpModal, typeof AbpModal, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AbpModal, new AbpModal({
    ...{ 'onConfirm': {} },
    ...{ 'onUpdate:visible': {} },
    visible: (__VLS_ctx.visible),
    title: "连接字符串",
    size: "lg",
    loading: (__VLS_ctx.submitting),
    confirmLabel: "保存",
}));
const __VLS_1 = __VLS_0({
    ...{ 'onConfirm': {} },
    ...{ 'onUpdate:visible': {} },
    visible: (__VLS_ctx.visible),
    title: "连接字符串",
    size: "lg",
    loading: (__VLS_ctx.submitting),
    confirmLabel: "保存",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onConfirm: (__VLS_ctx.handleSave)
};
const __VLS_7 = {
    'onUpdate:visible': (...[$event]) => {
        __VLS_ctx.$emit('update:visible', $event);
    }
};
var __VLS_8 = {};
__VLS_2.slots.default;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-8 text-gray-400" },
    });
}
else {
    if (__VLS_ctx.connectionStrings.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center py-8 text-gray-400" },
        });
    }
    for (const [cs, index] of __VLS_getVForSourceType((__VLS_ctx.connectionStrings))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: "mb-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "text-sm font-medium text-gray-600" },
        });
        (cs.name);
        const __VLS_9 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
            link: true,
        }));
        const __VLS_11 = __VLS_10({
            ...{ 'onClick': {} },
            size: "small",
            type: "danger",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        let __VLS_13;
        let __VLS_14;
        let __VLS_15;
        const __VLS_16 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.handleDelete(cs.name);
            }
        };
        __VLS_12.slots.default;
        var __VLS_12;
        const __VLS_17 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            modelValue: (cs.value),
            type: "textarea",
            rows: (3),
            placeholder: "请输入连接字符串",
        }));
        const __VLS_19 = __VLS_18({
            modelValue: (cs.value),
            type: "textarea",
            rows: (3),
            placeholder: "请输入连接字符串",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        if (index < __VLS_ctx.connectionStrings.length - 1) {
            const __VLS_21 = {}.ElDivider;
            /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
            // @ts-ignore
            const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
            const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
        }
    }
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AbpModal: AbpModal,
            loading: loading,
            submitting: submitting,
            connectionStrings: connectionStrings,
            handleSave: handleSave,
            handleDelete: handleDelete,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
