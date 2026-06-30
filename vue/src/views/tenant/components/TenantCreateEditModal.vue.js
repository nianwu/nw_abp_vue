import { ref, computed, watch } from 'vue';
import AbpModal from '@/components/AbpModal.vue';
import AbpDynamicForm from '@/components/AbpDynamicForm.vue';
import { showSuccess, showError } from '@/components/AbpToast';
import * as tenantApi from '@/api/tenant';
import { parseAbpError } from '@/utils/abp-error';
const props = defineProps();
const emit = defineEmits();
const submitting = ref(false);
const fieldErrors = ref({});
const formData = ref({
    name: '',
    adminEmailAddress: '',
    adminPassword: '',
    isActive: true,
});
const createFields = [
    { name: 'name', type: 'text', label: '名称', required: true },
    { name: 'adminEmailAddress', type: 'email', label: '管理员邮箱', required: true },
    { name: 'adminPassword', type: 'password', label: '管理员密码', required: true },
    { name: 'isActive', type: 'switch', label: '启用' },
];
const editFields = [
    { name: 'name', type: 'text', label: '名称', required: true },
    { name: 'isActive', type: 'switch', label: '启用' },
];
const computedFields = computed(() => props.tenantId ? editFields : createFields);
// 编辑模式加载租户数据
watch(() => props.visible, async (v) => {
    if (!v)
        return;
    fieldErrors.value = {};
    if (props.tenantId) {
        try {
            const tenant = await tenantApi.getTenant(props.tenantId);
            formData.value = {
                name: tenant.name || '',
                isActive: tenant.isActive ?? true,
            };
        }
        catch {
            showError('加载租户信息失败');
        }
    }
    else {
        formData.value = {
            name: '',
            adminEmailAddress: '',
            adminPassword: '',
            isActive: true,
        };
    }
});
async function handleSubmit() {
    submitting.value = true;
    try {
        if (props.tenantId) {
            await tenantApi.updateTenant(props.tenantId, formData.value);
        }
        else {
            await tenantApi.createTenant(formData.value);
        }
        showSuccess(props.tenantId ? '更新成功' : '创建成功');
        emit('saved');
    }
    catch (e) {
        const parsed = parseAbpError(e);
        if (parsed?.fieldErrors)
            fieldErrors.value = parsed.fieldErrors;
        showError(parsed?.message || '操作失败');
    }
    finally {
        submitting.value = false;
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
    title: (__VLS_ctx.tenantId ? '编辑租户' : '新建租户'),
    loading: (__VLS_ctx.submitting),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onConfirm': {} },
    ...{ 'onUpdate:visible': {} },
    visible: (__VLS_ctx.visible),
    title: (__VLS_ctx.tenantId ? '编辑租户' : '新建租户'),
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onConfirm: (__VLS_ctx.handleSubmit)
};
const __VLS_7 = {
    'onUpdate:visible': (...[$event]) => {
        __VLS_ctx.$emit('update:visible', $event);
    }
};
var __VLS_8 = {};
__VLS_2.slots.default;
/** @type {[typeof AbpDynamicForm, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(AbpDynamicForm, new AbpDynamicForm({
    modelValue: (__VLS_ctx.formData),
    fields: (__VLS_ctx.computedFields),
    fieldErrors: (__VLS_ctx.fieldErrors),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.formData),
    fields: (__VLS_ctx.computedFields),
    fieldErrors: (__VLS_ctx.fieldErrors),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AbpModal: AbpModal,
            AbpDynamicForm: AbpDynamicForm,
            submitting: submitting,
            fieldErrors: fieldErrors,
            formData: formData,
            computedFields: computedFields,
            handleSubmit: handleSubmit,
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
