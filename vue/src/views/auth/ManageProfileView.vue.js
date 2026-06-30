/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-5xl" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-semibold mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 xl:grid-cols-2 gap-6 items-start" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    const __VLS_4 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
}
/** @type {[typeof AbpDynamicForm, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(AbpDynamicForm, new AbpDynamicForm({
    ...{ 'onUpdate:modelValue': {} },
    fields: (__VLS_ctx.profileFields),
    modelValue: (__VLS_ctx.profileForm),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onUpdate:modelValue': {} },
    fields: (__VLS_ctx.profileFields),
    modelValue: (__VLS_ctx.profileForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.profileForm = $event;
    }
};
var __VLS_14;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4" },
});
const __VLS_19 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingProfile),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingProfile),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onClick: (__VLS_ctx.handleUpdateProfile)
};
__VLS_22.slots.default;
var __VLS_22;
var __VLS_3;
const __VLS_27 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    shadow: "never",
}));
const __VLS_29 = __VLS_28({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_30.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    const __VLS_31 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
    const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    const __VLS_35 = {}.Lock;
    /** @type {[typeof __VLS_components.Lock, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
    var __VLS_34;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
}
const __VLS_39 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    ...{ 'onSubmit': {} },
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelPosition: "top",
}));
const __VLS_41 = __VLS_40({
    ...{ 'onSubmit': {} },
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
let __VLS_45;
const __VLS_46 = {
    onSubmit: () => { }
};
/** @type {typeof __VLS_ctx.passwordFormRef} */ ;
var __VLS_47 = {};
__VLS_42.slots.default;
const __VLS_49 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    label: "当前密码",
    prop: "currentPassword",
    required: true,
}));
const __VLS_51 = __VLS_50({
    label: "当前密码",
    prop: "currentPassword",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.passwordForm.currentPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.passwordForm.currentPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
var __VLS_52;
const __VLS_57 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    label: "新密码",
    prop: "newPassword",
    required: true,
}));
const __VLS_59 = __VLS_58({
    label: "新密码",
    prop: "newPassword",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}));
const __VLS_63 = __VLS_62({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
var __VLS_60;
const __VLS_65 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "确认新密码",
    prop: "confirmPassword",
    required: true,
}));
const __VLS_67 = __VLS_66({
    label: "确认新密码",
    prop: "confirmPassword",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
const __VLS_69 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
const __VLS_71 = __VLS_70({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
var __VLS_68;
const __VLS_73 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingPassword),
}));
const __VLS_79 = __VLS_78({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.savingPassword),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_81;
let __VLS_82;
let __VLS_83;
const __VLS_84 = {
    onClick: (__VLS_ctx.handleChangePassword)
};
__VLS_80.slots.default;
var __VLS_80;
var __VLS_76;
var __VLS_42;
var __VLS_30;
/** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
// @ts-ignore
var __VLS_48 = __VLS_47;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            User: User,
            Lock: Lock,
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
