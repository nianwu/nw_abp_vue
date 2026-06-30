import { ref, reactive, onMounted } from 'vue';
import { getProfile, updateProfile, changePassword } from '@/api/account';
import { showSuccess, showError } from '@/components/AbpToast';
import AbpDynamicForm from '@/components/AbpDynamicForm.vue';
// ============================================================
// Profile fields definition
// ============================================================
const profileFields = [
    { name: 'userName', type: 'text', label: '用户名', required: true, placeholder: '请输入用户名' },
    { name: 'name', type: 'text', label: '名字', placeholder: '请输入名字' },
    { name: 'surname', type: 'text', label: '姓氏', placeholder: '请输入姓氏' },
    { name: 'email', type: 'email', label: '邮箱', required: true, placeholder: '请输入邮箱' },
    { name: 'phoneNumber', type: 'text', label: '手机号', placeholder: '请输入手机号' },
];
const profileForm = reactive({
    userName: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
});
const concurrencyStamp = ref(null);
const savingProfile = ref(false);
async function loadProfile() {
    try {
        const profile = await getProfile();
        profileForm.userName = profile.userName ?? '';
        profileForm.name = profile.name ?? '';
        profileForm.surname = profile.surname ?? '';
        profileForm.email = profile.email ?? '';
        profileForm.phoneNumber = profile.phoneNumber ?? '';
        concurrencyStamp.value = profile.concurrencyStamp;
    }
    catch (e) {
        const err = e;
        if (err.abpError?.message)
            showError(err.abpError.message);
        else
            showError('加载个人资料失败');
    }
}
async function handleUpdateProfile() {
    savingProfile.value = true;
    try {
        await updateProfile({
            userName: profileForm.userName || null,
            email: profileForm.email || null,
            name: profileForm.name || null,
            surname: profileForm.surname || null,
            phoneNumber: profileForm.phoneNumber || null,
            concurrencyStamp: concurrencyStamp.value,
            extraProperties: {},
        });
        showSuccess('个人资料已更新');
        // 重新加载以获取最新的 concurrencyStamp
        await loadProfile();
    }
    catch (e) {
        const err = e;
        if (err.abpError?.message)
            showError(err.abpError.message);
        else
            showError('保存失败，请稍后重试');
    }
    finally {
        savingProfile.value = false;
    }
}
// ============================================================
// Password change
// ============================================================
const passwordFormRef = ref();
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const validateConfirmNewPassword = (_rule, value, callback) => {
    if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
    }
    else {
        callback();
    }
};
const passwordRules = reactive({
    currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validateConfirmNewPassword, trigger: 'blur' },
    ],
});
const savingPassword = ref(false);
async function handleChangePassword() {
    if (!passwordFormRef.value)
        return;
    const valid = await passwordFormRef.value.validate().catch(() => false);
    if (!valid)
        return;
    savingPassword.value = true;
    try {
        await changePassword({
            currentPassword: passwordForm.currentPassword || null,
            newPassword: passwordForm.newPassword,
        });
        showSuccess('密码修改成功');
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
    }
    catch (e) {
        const err = e;
        if (err.abpError?.message)
            showError(err.abpError.message);
        else
            showError('修改密码失败，请稍后重试');
    }
    finally {
        savingPassword.value = false;
    }
}
// ============================================================
// Lifecycle
// ============================================================
onMounted(loadProfile);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-semibold mb-6" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "mb-6" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
}
/** @type {[typeof AbpDynamicForm, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(AbpDynamicForm, new AbpDynamicForm({
    ...{ 'onUpdate:modelValue': {} },
    fields: (__VLS_ctx.profileFields),
    modelValue: (__VLS_ctx.profileForm),
}));
const __VLS_5 = __VLS_4({
    ...{ 'onUpdate:modelValue': {} },
    fields: (__VLS_ctx.profileFields),
    modelValue: (__VLS_ctx.profileForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.profileForm = $event;
    }
};
var __VLS_6;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4" },
});
const __VLS_11 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingProfile),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingProfile),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onClick: (__VLS_ctx.handleUpdateProfile)
};
__VLS_14.slots.default;
var __VLS_14;
var __VLS_3;
const __VLS_19 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    shadow: "never",
}));
const __VLS_21 = __VLS_20({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_22.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
}
const __VLS_23 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ 'onSubmit': {} },
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelPosition: "top",
}));
const __VLS_25 = __VLS_24({
    ...{ 'onSubmit': {} },
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    onSubmit: () => { }
};
/** @type {typeof __VLS_ctx.passwordFormRef} */ ;
var __VLS_31 = {};
__VLS_26.slots.default;
const __VLS_33 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    label: "当前密码",
    prop: "currentPassword",
    required: true,
}));
const __VLS_35 = __VLS_34({
    label: "当前密码",
    prop: "currentPassword",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.passwordForm.currentPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.passwordForm.currentPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
var __VLS_36;
const __VLS_41 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    label: "新密码",
    prop: "newPassword",
    required: true,
}));
const __VLS_43 = __VLS_42({
    label: "新密码",
    prop: "newPassword",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
var __VLS_44;
const __VLS_49 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    label: "确认新密码",
    prop: "confirmPassword",
    required: true,
}));
const __VLS_51 = __VLS_50({
    label: "确认新密码",
    prop: "confirmPassword",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
var __VLS_52;
const __VLS_57 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingPassword),
}));
const __VLS_63 = __VLS_62({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingPassword),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    onClick: (__VLS_ctx.handleChangePassword)
};
__VLS_64.slots.default;
var __VLS_64;
var __VLS_60;
var __VLS_26;
var __VLS_22;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
// @ts-ignore
var __VLS_32 = __VLS_31;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AbpDynamicForm: AbpDynamicForm,
            profileFields: profileFields,
            profileForm: profileForm,
            savingProfile: savingProfile,
            handleUpdateProfile: handleUpdateProfile,
            passwordFormRef: passwordFormRef,
            passwordForm: passwordForm,
            passwordRules: passwordRules,
            savingPassword: savingPassword,
            handleChangePassword: handleChangePassword,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
