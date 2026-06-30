/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch } from 'vue';
import AbpModal from '@/components/AbpModal.vue';
import AbpDynamicForm from '@/components/AbpDynamicForm.vue';
import { showSuccess, showError } from '@/components/AbpToast';
import * as usersApi from '@/api/identity-users';
import * as rolesApi from '@/api/identity-roles';
import { parseAbpError } from '@/utils/abp-error';
const props = defineProps();
const emit = defineEmits();
const formRef = ref();
const activeTab = ref('info');
const submitting = ref(false);
const fieldErrors = ref({});
const selectedRoles = ref([]);
const formData = ref({
    userName: '', name: '', surname: '', email: '', phoneNumber: '', password: '', isActive: true, lockoutEnabled: true,
});
const roleOptions = ref([]);
const createFields = [
    { name: 'userName', type: 'text', label: '用户名', required: true },
    { name: 'name', type: 'text', label: '姓名' },
    { name: 'surname', type: 'text', label: '姓氏' },
    { name: 'email', type: 'email', label: '邮箱', required: true },
    { name: 'phoneNumber', type: 'text', label: '手机号' },
    { name: 'password', type: 'password', label: '密码', required: true },
    { name: 'isActive', type: 'switch', label: '启用' },
];
const editFields = [
    { name: 'userName', type: 'text', label: '用户名', required: true },
    { name: 'name', type: 'text', label: '姓名' },
    { name: 'surname', type: 'text', label: '姓氏' },
    { name: 'email', type: 'email', label: '邮箱', required: true },
    { name: 'phoneNumber', type: 'text', label: '手机号' },
    { name: 'password', type: 'password', label: '密码', placeholder: '留空则不修改密码' },
    { name: 'isActive', type: 'switch', label: '启用' },
];
const fields = computed(() => props.userId ? editFields : createFields);
// 编辑模式加载用户数据
watch(() => props.visible, async (v) => {
    if (!v)
        return;
    fieldErrors.value = {};
    if (props.userId) {
        try {
            const user = await usersApi.getUser(props.userId);
            formData.value = { ...user, password: '' };
        }
        catch {
            showError('加载用户信息失败');
        }
    }
    else {
        formData.value = { userName: '', name: '', surname: '', email: '', phoneNumber: '', password: '', isActive: true, lockoutEnabled: true };
        // 加载角色
        try {
            const res = await rolesApi.getAllRoles();
            roleOptions.value = (res.items || []).map((r) => ({ key: r.name || '', label: r.name || '' }));
        }
        catch { /**/ }
    }
});
async function handleSubmit() {
    const valid = await formRef.value?.validate();
    if (!valid)
        return;
    submitting.value = true;
    try {
        if (props.userId) {
            await usersApi.updateUser(props.userId, formData.value);
        }
        else {
            await usersApi.createUser(formData.value);
        }
        showSuccess(props.userId ? '更新成功' : '创建成功');
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
    title: (__VLS_ctx.userId ? '编辑用户' : '新建用户'),
    loading: (__VLS_ctx.submitting),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onConfirm': {} },
    ...{ 'onUpdate:visible': {} },
    visible: (__VLS_ctx.visible),
    title: (__VLS_ctx.userId ? '编辑用户' : '新建用户'),
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
const __VLS_9 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "基本信息",
    name: "info",
}));
const __VLS_15 = __VLS_14({
    label: "基本信息",
    name: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
/** @type {[typeof AbpDynamicForm, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(AbpDynamicForm, new AbpDynamicForm({
    ref: "formRef",
    modelValue: (__VLS_ctx.formData),
    fields: (__VLS_ctx.fields),
    fieldErrors: (__VLS_ctx.fieldErrors),
}));
const __VLS_18 = __VLS_17({
    ref: "formRef",
    modelValue: (__VLS_ctx.formData),
    fields: (__VLS_ctx.fields),
    fieldErrors: (__VLS_ctx.fieldErrors),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_20 = {};
var __VLS_19;
var __VLS_16;
if (!__VLS_ctx.userId) {
    const __VLS_22 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        label: "角色分配",
        name: "roles",
    }));
    const __VLS_24 = __VLS_23({
        label: "角色分配",
        name: "roles",
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_25.slots.default;
    const __VLS_26 = {}.ElTransfer;
    /** @type {[typeof __VLS_components.ElTransfer, typeof __VLS_components.elTransfer, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        modelValue: (__VLS_ctx.selectedRoles),
        data: (__VLS_ctx.roleOptions),
        titles: (['可用角色', '已分配']),
    }));
    const __VLS_28 = __VLS_27({
        modelValue: (__VLS_ctx.selectedRoles),
        data: (__VLS_ctx.roleOptions),
        titles: (['可用角色', '已分配']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    var __VLS_25;
}
var __VLS_12;
var __VLS_2;
// @ts-ignore
var __VLS_21 = __VLS_20;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AbpModal: AbpModal,
            AbpDynamicForm: AbpDynamicForm,
            formRef: formRef,
            activeTab: activeTab,
            submitting: submitting,
            fieldErrors: fieldErrors,
            selectedRoles: selectedRoles,
            formData: formData,
            roleOptions: roleOptions,
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
