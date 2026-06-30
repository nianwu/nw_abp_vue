import { reactive, watch } from 'vue';
const props = defineProps();
const emit = defineEmits();
const formValues = reactive({ ...props.modelValue });
watch(() => props.modelValue, (v) => {
    Object.keys(v).forEach((k) => { formValues[k] = v[k]; });
});
watch(formValues, (v) => emit('update:modelValue', { ...v }), { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.formValues),
    labelPosition: "top",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.formValues),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onSubmit: () => { }
};
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_8 = {};
__VLS_3.slots.default;
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.fields))) {
    const __VLS_10 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        label: (field.label),
        required: (field.required),
        error: (__VLS_ctx.fieldErrors?.[field.name]?.[0]),
        validateStatus: (__VLS_ctx.fieldErrors?.[field.name] ? 'error' : undefined),
    }));
    const __VLS_12 = __VLS_11({
        label: (field.label),
        required: (field.required),
        error: (__VLS_ctx.fieldErrors?.[field.name]?.[0]),
        validateStatus: (__VLS_ctx.fieldErrors?.[field.name] ? 'error' : undefined),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_13.slots.default;
    if (field.type === 'text') {
        const __VLS_14 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
            modelValue: (__VLS_ctx.formValues[field.name]),
            placeholder: (field.placeholder),
            readonly: (field.readonly),
        }));
        const __VLS_16 = __VLS_15({
            modelValue: (__VLS_ctx.formValues[field.name]),
            placeholder: (field.placeholder),
            readonly: (field.readonly),
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    }
    else if (field.type === 'number') {
        const __VLS_18 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
            modelValue: (__VLS_ctx.formValues[field.name]),
            placeholder: (field.placeholder),
            readonly: (field.readonly),
            controls: (true),
        }));
        const __VLS_20 = __VLS_19({
            modelValue: (__VLS_ctx.formValues[field.name]),
            placeholder: (field.placeholder),
            readonly: (field.readonly),
            controls: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    }
    else if (field.type === 'email') {
        const __VLS_22 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "email",
            placeholder: (field.placeholder),
            readonly: (field.readonly),
        }));
        const __VLS_24 = __VLS_23({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "email",
            placeholder: (field.placeholder),
            readonly: (field.readonly),
        }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    }
    else if (field.type === 'password') {
        const __VLS_26 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "password",
            showPassword: true,
            placeholder: (field.placeholder),
        }));
        const __VLS_28 = __VLS_27({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "password",
            showPassword: true,
            placeholder: (field.placeholder),
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    }
    else if (field.type === 'switch') {
        const __VLS_30 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
            modelValue: (__VLS_ctx.formValues[field.name]),
        }));
        const __VLS_32 = __VLS_31({
            modelValue: (__VLS_ctx.formValues[field.name]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    }
    else if (field.type === 'select') {
        const __VLS_34 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            modelValue: (__VLS_ctx.formValues[field.name]),
            placeholder: (field.placeholder),
            ...{ class: "w-full" },
        }));
        const __VLS_36 = __VLS_35({
            modelValue: (__VLS_ctx.formValues[field.name]),
            placeholder: (field.placeholder),
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        __VLS_37.slots.default;
        for (const [opt] of __VLS_getVForSourceType((field.options))) {
            const __VLS_38 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
                key: (String(opt.value)),
                label: (opt.label),
                value: (opt.value),
            }));
            const __VLS_40 = __VLS_39({
                key: (String(opt.value)),
                label: (opt.label),
                value: (opt.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        }
        var __VLS_37;
    }
    else if (field.type === 'date') {
        const __VLS_42 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "date",
            placeholder: (field.placeholder),
            ...{ class: "w-full" },
            valueFormat: "YYYY-MM-DD",
        }));
        const __VLS_44 = __VLS_43({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "date",
            placeholder: (field.placeholder),
            ...{ class: "w-full" },
            valueFormat: "YYYY-MM-DD",
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    }
    else if (field.type === 'textarea') {
        const __VLS_46 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "textarea",
            rows: (3),
            placeholder: (field.placeholder),
        }));
        const __VLS_48 = __VLS_47({
            modelValue: (__VLS_ctx.formValues[field.name]),
            type: "textarea",
            rows: (3),
            placeholder: (field.placeholder),
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    }
    var __VLS_13;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
var __VLS_9 = __VLS_8;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formValues: formValues,
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
