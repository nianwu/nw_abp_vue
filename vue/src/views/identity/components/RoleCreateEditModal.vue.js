import { ref, watch } from 'vue';
import AbpModal from '@/components/AbpModal.vue';
import AbpDynamicForm from '@/components/AbpDynamicForm.vue';
import { showSuccess, showError } from '@/components/AbpToast';
import * as identityRolesApi from '@/api/identity-roles';
import { parseAbpError } from '@/utils/abp-error';
const props = defineProps();
const emit = defineEmits();
const submitting = ref(false);
const fieldErrors = ref({});
const formData = ref({
    name: '',
    isDefault: false,
    isPublic: false,
});
const fields = [
    { name: 'name', type: 'text', label: '角色名', required: true },
    { name: 'isDefault', type: 'switch', label: '默认角色' },
    { name: 'isPublic', type: 'switch', label: '公开角色' },
];
// 编辑模式加载角色数据
watch(() => props.visible, async (v) => {
    if (!v)
        return;
    fieldErrors.value = {};
    if (props.roleId) {
        try {
            const role = await identityRolesApi.getRole(props.roleId);
            formData.value = { name: role.name ?? '', isDefault: role.isDefault, isPublic: role.isPublic };
        }
        catch {
            showError('加载角色信息失败');
        }
    }
    else {
        formData.value = { name: '', isDefault: false, isPublic: false };
    }
});
async function handleSubmit() {
    submitting.value = true;
    try {
        if (props.roleId) {
            await identityRolesApi.updateRole(props.roleId, formData.value);
        }
        else {
            await identityRolesApi.createRole(formData.value);
        }
        showSuccess(props.roleId ? '更新成功' : '创建成功');
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
    title: (__VLS_ctx.roleId ? '编辑角色' : '新建角色'),
    loading: (__VLS_ctx.submitting),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onConfirm': {} },
    ...{ 'onUpdate:visible': {} },
    visible: (__VLS_ctx.visible),
    title: (__VLS_ctx.roleId ? '编辑角色' : '新建角色'),
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
    fields: (__VLS_ctx.fields),
    fieldErrors: (__VLS_ctx.fieldErrors),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.formData),
    fields: (__VLS_ctx.fields),
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
            fields: fields,
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
