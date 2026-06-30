/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import * as featureApi from '@/api/feature';
const props = defineProps();
const emit = defineEmits();
// ============================================================
// State
// ============================================================
const dialogVisible = ref(false);
const loading = ref(false);
const saving = ref(false);
const activeGroupName = ref('');
const featureGroups = ref([]);
const treeRefMap = ref({});
// Track original values for change detection
const originalValues = ref(new Map());
// Track current edited values
const currentValues = ref(new Map());
// Force re-render counter (for cascade disabled state)
const renderKey = ref(0);
// ============================================================
// Saved callbacks
// ============================================================
const savedCallbacks = [];
const treeProps = {
    children: 'children',
    label: 'displayName',
};
/**
 * Determine value type short name from IStringValueType.name
 */
function resolveValueTypeName(dto) {
    const name = dto.valueType?.name || '';
    if (name.includes('Toggle'))
        return 'ToggleStringValueType';
    if (name.includes('FreeText'))
        return 'FreeTextStringValueType';
    if (name.includes('Selection'))
        return 'SelectionStringValueType';
    return name;
}
/**
 * Extract selection options from valueType.properties
 */
function extractOptions(dto) {
    const props2 = dto.valueType?.properties || {};
    const items = props2.items;
    if (!items || !Array.isArray(items))
        return [];
    return items.map((item) => ({
        label: String(item.name || item.value || item),
        value: String(item.value || item.name || item),
    }));
}
/**
 * Build tree from flat feature list using parentName relationships
 */
function buildTreeData(features) {
    if (!features || features.length === 0)
        return [];
    const nodeMap = new Map();
    const roots = [];
    // Sort by depth so parents come before children
    const sorted = [...features].sort((a, b) => a.depth - b.depth);
    for (const f of sorted) {
        if (!f.name)
            continue;
        const currentVal = currentValues.value.get(f.name) ?? f.value ?? '';
        const valueTypeName = resolveValueTypeName(f);
        const node = {
            name: f.name,
            displayName: f.displayName || f.name,
            children: [],
            valueTypeName,
            currentValue: currentVal,
            _disabled: false,
            _options: valueTypeName === 'SelectionStringValueType' ? extractOptions(f) : undefined,
            _original: f,
        };
        nodeMap.set(f.name, node);
        if (f.parentName && nodeMap.has(f.parentName)) {
            nodeMap.get(f.parentName).children.push(node);
        }
        else {
            roots.push(node);
        }
    }
    // Clean up empty children arrays and apply cascade disabled
    function postProcess(nodes, parentDisabled) {
        for (const n of nodes) {
            if (n.children && n.children.length === 0) {
                delete n.children;
            }
            // Cascade: parent toggle off → children disabled
            if (n.valueTypeName === 'ToggleStringValueType') {
                n._disabled = parentDisabled || n.currentValue !== 'true';
            }
            else {
                n._disabled = parentDisabled;
            }
            if (n.children) {
                postProcess(n.children, n._disabled);
            }
        }
    }
    postProcess(roots, false);
    return roots;
}
function setTreeRef(name, el) {
    if (el) {
        treeRefMap.value[name] = el;
    }
}
// ============================================================
// Value change handlers
// ============================================================
function onToggleChange(node, value) {
    node.currentValue = value ? 'true' : 'false';
    currentValues.value.set(node.name, node.currentValue);
    // When toggling off a parent, auto-disable children via re-render
    triggerRerender();
}
function onTextChange(node, value) {
    node.currentValue = value;
    currentValues.value.set(node.name, value);
}
function onSelectChange(node, value) {
    node.currentValue = value;
    currentValues.value.set(node.name, value);
}
function triggerRerender() {
    renderKey.value++;
}
// ============================================================
// Dirty tracking
// ============================================================
const dirtyCount = computed(() => {
    void renderKey.value; // dependency tracking
    let count = 0;
    for (const [name, orig] of originalValues.value) {
        const current = currentValues.value.get(name) ?? orig;
        if (current !== orig)
            count++;
    }
    return count;
});
// ============================================================
// Data loading
// ============================================================
async function loadFeatures() {
    loading.value = true;
    try {
        const result = await featureApi.getFeatures({
            providerName: props.providerName,
            providerKey: props.providerKey,
        });
        featureGroups.value = result.groups || [];
        // Reset tracking maps
        const newOriginals = new Map();
        const newCurrents = new Map();
        for (const group of result.groups || []) {
            for (const f of group.features || []) {
                if (f.name) {
                    const val = f.value ?? '';
                    newOriginals.set(f.name, val);
                    newCurrents.set(f.name, val);
                }
            }
        }
        originalValues.value = newOriginals;
        currentValues.value = newCurrents;
        if (result.groups && result.groups.length > 0) {
            activeGroupName.value = result.groups[0].name || '';
        }
    }
    catch (e) {
        console.error('Failed to load features', e);
    }
    finally {
        loading.value = false;
    }
}
// ============================================================
// Save
// ============================================================
async function handleSave() {
    saving.value = true;
    try {
        const changedFeatures = [];
        for (const [name, orig] of originalValues.value) {
            const current = currentValues.value.get(name) ?? orig;
            if (current !== orig) {
                changedFeatures.push({ name, value: current });
            }
        }
        if (changedFeatures.length > 0) {
            await featureApi.updateFeatures({ features: changedFeatures }, { providerName: props.providerName, providerKey: props.providerKey });
        }
        // Fire saved callbacks
        for (const cb of savedCallbacks) {
            try {
                cb();
            }
            catch { /* swallow callback errors */ }
        }
        emit('saveSuccess');
        dialogVisible.value = false;
    }
    catch {
        // Error handled by HTTP interceptor
    }
    finally {
        saving.value = false;
    }
}
// ============================================================
// Dialog lifecycle
// ============================================================
async function handleOpen() {
    renderKey.value = 0;
    await loadFeatures();
}
function handleCancel() {
    dialogVisible.value = false;
    emit('close');
}
async function handleBeforeClose(done) {
    if (dirtyCount.value > 0) {
        const { ElMessageBox } = await import('element-plus');
        try {
            await ElMessageBox.confirm('有未保存的更改，确定关闭吗？', '提示', { confirmButtonText: '确定关闭', cancelButtonText: '取消', type: 'warning' });
            done();
        }
        catch {
            // cancelled
        }
    }
    else {
        done();
    }
}
// ============================================================
// Imperative API exposed to parent
// ============================================================
function open() {
    dialogVisible.value = true;
}
function close() {
    dialogVisible.value = false;
}
function registerSavedCallback(cb) {
    savedCallbacks.push(cb);
}
const __VLS_exposed = {
    open,
    close,
    onSaved: registerSavedCallback,
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onOpen': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "功能管理",
    width: "800px",
    closeOnClickModal: (false),
    beforeClose: (__VLS_ctx.handleBeforeClose),
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onOpen': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "功能管理",
    width: "800px",
    closeOnClickModal: (false),
    beforeClose: (__VLS_ctx.handleBeforeClose),
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onOpen: (__VLS_ctx.handleOpen)
};
var __VLS_8 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feature-modal-body" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (!__VLS_ctx.loading && __VLS_ctx.featureGroups.length === 0) {
    const __VLS_9 = {}.AbpEmptyState;
    /** @type {[typeof __VLS_components.AbpEmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
else {
    const __VLS_13 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        modelValue: (__VLS_ctx.activeGroupName),
    }));
    const __VLS_15 = __VLS_14({
        modelValue: (__VLS_ctx.activeGroupName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    for (const [group] of __VLS_getVForSourceType((__VLS_ctx.featureGroups))) {
        const __VLS_17 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            key: (group.name),
            label: (group.displayName || group.name),
            name: (group.name),
        }));
        const __VLS_19 = __VLS_18({
            key: (group.name),
            label: (group.displayName || group.name),
            name: (group.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        __VLS_20.slots.default;
        const __VLS_21 = {}.ElTree;
        /** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ref: ((el) => __VLS_ctx.setTreeRef(group.name, el)),
            data: (__VLS_ctx.buildTreeData(group.features || [])),
            props: (__VLS_ctx.treeProps),
            nodeKey: "name",
            defaultExpandAll: true,
            expandOnClickNode: (false),
        }));
        const __VLS_23 = __VLS_22({
            ref: ((el) => __VLS_ctx.setTreeRef(group.name, el)),
            data: (__VLS_ctx.buildTreeData(group.features || [])),
            props: (__VLS_ctx.treeProps),
            nodeKey: "name",
            defaultExpandAll: true,
            expandOnClickNode: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        __VLS_24.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_24.slots;
            const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feature-node" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "feature-label" },
            });
            (data.displayName || data.name);
            if (data.valueTypeName === 'ToggleStringValueType') {
                const __VLS_25 = {}.ElSwitch;
                /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
                // @ts-ignore
                const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
                    ...{ 'onChange': {} },
                    modelValue: (data.currentValue === 'true'),
                    disabled: (data._disabled),
                    ...{ style: {} },
                }));
                const __VLS_27 = __VLS_26({
                    ...{ 'onChange': {} },
                    modelValue: (data.currentValue === 'true'),
                    disabled: (data._disabled),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_26));
                let __VLS_29;
                let __VLS_30;
                let __VLS_31;
                const __VLS_32 = {
                    onChange: ((v) => __VLS_ctx.onToggleChange(data, v))
                };
                var __VLS_28;
            }
            else if (data.valueTypeName === 'FreeTextStringValueType') {
                const __VLS_33 = {}.ElInput;
                /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
                // @ts-ignore
                const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
                    ...{ 'onChange': {} },
                    modelValue: (data.currentValue),
                    disabled: (data._disabled),
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_35 = __VLS_34({
                    ...{ 'onChange': {} },
                    modelValue: (data.currentValue),
                    disabled: (data._disabled),
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_34));
                let __VLS_37;
                let __VLS_38;
                let __VLS_39;
                const __VLS_40 = {
                    onChange: ((v) => __VLS_ctx.onTextChange(data, v))
                };
                var __VLS_36;
            }
            else if (data.valueTypeName === 'SelectionStringValueType') {
                const __VLS_41 = {}.ElSelect;
                /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
                // @ts-ignore
                const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                    ...{ 'onChange': {} },
                    modelValue: (data.currentValue),
                    disabled: (data._disabled),
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_43 = __VLS_42({
                    ...{ 'onChange': {} },
                    modelValue: (data.currentValue),
                    disabled: (data._disabled),
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_42));
                let __VLS_45;
                let __VLS_46;
                let __VLS_47;
                const __VLS_48 = {
                    onChange: ((v) => __VLS_ctx.onSelectChange(data, v))
                };
                __VLS_44.slots.default;
                for (const [opt] of __VLS_getVForSourceType((data._options))) {
                    const __VLS_49 = {}.ElOption;
                    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
                    // @ts-ignore
                    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
                        key: (opt.value),
                        label: (opt.label),
                        value: (opt.value),
                    }));
                    const __VLS_51 = __VLS_50({
                        key: (opt.value),
                        label: (opt.label),
                        value: (opt.value),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
                }
                var __VLS_44;
            }
            else {
                const __VLS_53 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_55 = __VLS_54({
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_54));
                __VLS_56.slots.default;
                (data.currentValue || '-');
                var __VLS_56;
            }
        }
        var __VLS_24;
        var __VLS_20;
    }
    var __VLS_16;
}
if (__VLS_ctx.dirtyCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "change-summary" },
    });
    (__VLS_ctx.dirtyCount);
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_57 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_61;
    let __VLS_62;
    let __VLS_63;
    const __VLS_64 = {
        onClick: (__VLS_ctx.handleCancel)
    };
    __VLS_60.slots.default;
    var __VLS_60;
    const __VLS_65 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
        disabled: (__VLS_ctx.saving),
    }));
    const __VLS_67 = __VLS_66({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
        disabled: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    let __VLS_69;
    let __VLS_70;
    let __VLS_71;
    const __VLS_72 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_68.slots.default;
    var __VLS_68;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['feature-modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-node']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-label']} */ ;
/** @type {__VLS_StyleScopedClasses['change-summary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            dialogVisible: dialogVisible,
            loading: loading,
            saving: saving,
            activeGroupName: activeGroupName,
            featureGroups: featureGroups,
            treeProps: treeProps,
            buildTreeData: buildTreeData,
            setTreeRef: setTreeRef,
            onToggleChange: onToggleChange,
            onTextChange: onTextChange,
            onSelectChange: onSelectChange,
            dirtyCount: dirtyCount,
            handleSave: handleSave,
            handleOpen: handleOpen,
            handleCancel: handleCancel,
            handleBeforeClose: handleBeforeClose,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
