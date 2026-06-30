/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { showSuccess, showError } from '@/components/AbpToast';
import * as settingsApi from '@/api/settings';
// ---- form fields ----
const emailFields = [
    { name: 'smtpHost', type: 'text', label: 'SMTP 主机', required: true },
    { name: 'smtpPort', type: 'number', label: 'SMTP 端口', required: true },
    { name: 'smtpUserName', type: 'text', label: 'SMTP 用户名' },
    { name: 'smtpPassword', type: 'password', label: 'SMTP 密码' },
    { name: 'smtpDomain', type: 'text', label: 'SMTP 域' },
    { name: 'smtpEnableSsl', type: 'switch', label: '启用 SSL' },
    { name: 'smtpUseDefaultCredentials', type: 'switch', label: '使用默认凭据' },
    { name: 'defaultFromAddress', type: 'email', label: '默认发件地址', required: true },
    { name: 'defaultFromDisplayName', type: 'text', label: '默认发件显示名' },
];
// ---- state ----
const loading = ref(true);
const saving = ref(false);
const sending = ref(false);
const showSendDialog = ref(false);
const formData = ref({
    smtpHost: '',
    smtpPort: 25,
    smtpUserName: '',
    smtpPassword: '',
    smtpDomain: '',
    smtpEnableSsl: false,
    smtpUseDefaultCredentials: false,
    defaultFromAddress: '',
    defaultFromDisplayName: '',
});
const testEmailForm = reactive({
    subject: 'ABP 测试邮件',
    body: '',
    targetEmailAddress: '',
});
// ---- load ----
async function loadSettings() {
    loading.value = true;
    try {
        const data = await settingsApi.getEmailSettings();
        Object.assign(formData.value, data);
    }
    catch {
        showError('加载邮件设置失败');
    }
    finally {
        loading.value = false;
    }
}
onMounted(loadSettings);
// ---- save ----
async function handleSave() {
    saving.value = true;
    try {
        await settingsApi.updateEmailSettings({
            smtpHost: formData.value['smtpHost'] ?? '',
            smtpPort: formData.value['smtpPort'] ?? 25,
            smtpUserName: formData.value['smtpUserName'] ?? '',
            smtpPassword: formData.value['smtpPassword'] ?? '',
            smtpDomain: formData.value['smtpDomain'] ?? '',
            smtpEnableSsl: formData.value['smtpEnableSsl'] ?? false,
            smtpUseDefaultCredentials: formData.value['smtpUseDefaultCredentials'] ?? false,
            defaultFromAddress: formData.value['defaultFromAddress'] ?? '',
            defaultFromDisplayName: formData.value['defaultFromDisplayName'] ?? '',
        });
        showSuccess('邮件设置已保存');
    }
    catch {
        showError('保存邮件设置失败');
    }
    finally {
        saving.value = false;
    }
}
// ---- send test email ----
async function handleSendTestEmail() {
    const target = testEmailForm.targetEmailAddress.trim();
    const subject = testEmailForm.subject.trim();
    if (!target) {
        showError('请输入收件人地址');
        return;
    }
    if (!subject) {
        showError('请输入邮件主题');
        return;
    }
    const senderAddress = formData.value['defaultFromAddress'] ?? '';
    if (!senderAddress) {
        showError('请先设置默认发件地址');
        return;
    }
    const input = {
        subject,
        body: testEmailForm.body || null,
        senderEmailAddress: senderAddress,
        targetEmailAddress: target,
    };
    sending.value = true;
    try {
        await settingsApi.sendTestEmail(input);
        showSuccess('测试邮件已发送');
        showSendDialog.value = false;
        testEmailForm.body = '';
        testEmailForm.targetEmailAddress = '';
        testEmailForm.subject = 'ABP 测试邮件';
    }
    catch {
        showError('发送测试邮件失败');
    }
    finally {
        sending.value = false;
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
else {
    const __VLS_0 = {}.AbpDynamicForm;
    /** @type {[typeof __VLS_components.AbpDynamicForm, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        modelValue: (__VLS_ctx.formData),
        fields: (__VLS_ctx.emailFields),
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_ctx.formData),
        fields: (__VLS_ctx.emailFields),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-6 flex gap-3" },
    });
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_7.slots.default;
    var __VLS_7;
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.formData.defaultFromAddress),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.formData.defaultFromAddress),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.loading))
                return;
            __VLS_ctx.showSendDialog = true;
        }
    };
    __VLS_15.slots.default;
    var __VLS_15;
    const __VLS_20 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        modelValue: (__VLS_ctx.showSendDialog),
        title: "发送测试邮件",
        width: "500px",
        closeOnClickModal: (false),
    }));
    const __VLS_22 = __VLS_21({
        modelValue: (__VLS_ctx.showSendDialog),
        title: "发送测试邮件",
        width: "500px",
        closeOnClickModal: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        model: (__VLS_ctx.testEmailForm),
        labelPosition: "top",
    }));
    const __VLS_26 = __VLS_25({
        model: (__VLS_ctx.testEmailForm),
        labelPosition: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        label: "收件人地址",
        required: true,
    }));
    const __VLS_30 = __VLS_29({
        label: "收件人地址",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        modelValue: (__VLS_ctx.testEmailForm.targetEmailAddress),
        placeholder: "recipient@example.com",
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.testEmailForm.targetEmailAddress),
        placeholder: "recipient@example.com",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    var __VLS_31;
    const __VLS_36 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        label: "主题",
        required: true,
    }));
    const __VLS_38 = __VLS_37({
        label: "主题",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        modelValue: (__VLS_ctx.testEmailForm.subject),
        placeholder: "测试邮件主题",
    }));
    const __VLS_42 = __VLS_41({
        modelValue: (__VLS_ctx.testEmailForm.subject),
        placeholder: "测试邮件主题",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    var __VLS_39;
    const __VLS_44 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "正文",
    }));
    const __VLS_46 = __VLS_45({
        label: "正文",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        modelValue: (__VLS_ctx.testEmailForm.body),
        type: "textarea",
        rows: (4),
        placeholder: "邮件正文（可选）",
    }));
    const __VLS_50 = __VLS_49({
        modelValue: (__VLS_ctx.testEmailForm.body),
        type: "textarea",
        rows: (4),
        placeholder: "邮件正文（可选）",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    var __VLS_47;
    var __VLS_27;
    {
        const { footer: __VLS_thisSlot } = __VLS_23.slots;
        const __VLS_52 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.showSendDialog = false;
            }
        };
        __VLS_55.slots.default;
        var __VLS_55;
        const __VLS_60 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.sending),
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.sending),
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (__VLS_ctx.handleSendTestEmail)
        };
        __VLS_63.slots.default;
        var __VLS_63;
    }
    var __VLS_23;
}
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emailFields: emailFields,
            loading: loading,
            saving: saving,
            sending: sending,
            showSendDialog: showSendDialog,
            formData: formData,
            testEmailForm: testEmailForm,
            handleSave: handleSave,
            handleSendTestEmail: handleSendTestEmail,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
