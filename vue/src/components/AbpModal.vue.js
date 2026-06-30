/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, ref, onMounted, onUnmounted } from 'vue';
const props = withDefaults(defineProps(), {
    size: 'md',
    loading: false,
    dirty: false,
    confirmLabel: '保存',
    cancelLabel: '取消',
});
const emit = defineEmits();
const sizeMap = { sm: '420px', md: '600px', lg: '800px', xl: '1000px', fullscreen: '100%' };
const dialogWidth = computed(() => sizeMap[props.size]);
const isFullscreen = ref(false);
function handleResize() { isFullscreen.value = window.innerWidth < 768; }
onMounted(() => { handleResize(); window.addEventListener('resize', handleResize); });
onUnmounted(() => window.removeEventListener('resize', handleResize));
async function handleBeforeClose(done) {
    if (props.dirty) {
        try {
            const { showConfirm } = await import('./AbpConfirmDialog');
            const ok = await showConfirm({ title: '提示', message: '有未保存的更改，确定关闭吗？' });
            if (ok)
                done();
        }
        catch {
            done();
        }
    }
    else {
        done();
    }
}
function handleConfirm() { emit('confirm'); }
function handleCancel() { emit('update:visible', false); emit('cancel'); }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    size: 'md',
    loading: false,
    dirty: false,
    confirmLabel: '保存',
    cancelLabel: '取消',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.title),
    width: (__VLS_ctx.dialogWidth),
    fullscreen: (__VLS_ctx.isFullscreen),
    closeOnClickModal: (false),
    closeOnPressEscape: (!__VLS_ctx.dirty),
    beforeClose: (__VLS_ctx.handleBeforeClose),
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.title),
    width: (__VLS_ctx.dialogWidth),
    fullscreen: (__VLS_ctx.isFullscreen),
    closeOnClickModal: (false),
    closeOnPressEscape: (!__VLS_ctx.dirty),
    beforeClose: (__VLS_ctx.handleBeforeClose),
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.$emit('update:visible', $event);
    }
};
var __VLS_8 = {};
__VLS_3.slots.default;
var __VLS_9 = {};
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_11 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_15;
    let __VLS_16;
    let __VLS_17;
    const __VLS_18 = {
        onClick: (__VLS_ctx.handleCancel)
    };
    __VLS_14.slots.default;
    (__VLS_ctx.cancelLabel);
    var __VLS_14;
    const __VLS_19 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    let __VLS_25;
    const __VLS_26 = {
        onClick: (__VLS_ctx.handleConfirm)
    };
    __VLS_22.slots.default;
    (__VLS_ctx.confirmLabel);
    var __VLS_22;
}
var __VLS_3;
// @ts-ignore
var __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            dialogWidth: dialogWidth,
            isFullscreen: isFullscreen,
            handleBeforeClose: handleBeforeClose,
            handleConfirm: handleConfirm,
            handleCancel: handleCancel,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
