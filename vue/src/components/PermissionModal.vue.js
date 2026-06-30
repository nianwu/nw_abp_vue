/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, reactive } from 'vue';
import * as permissionsApi from '@/api/permission';
const props = defineProps();
const emit = defineEmits();
// ============================================================
// State
// ============================================================
const dialogVisible = ref(false);
const loading = ref(false);
const saving = ref(false);
const activeTab = ref('groups');
const activeGroupName = ref('');
const permissionGroups = ref([]);
const treeRefMap = ref({});
const revCounter = ref(0); // triggers reactive recomputation of change counts
const resourcesLoading = ref(false);
const permStateMap = ref(new Map());
// ============================================================
// Saved callbacks
// ============================================================
const savedCallbacks = [];
const treeProps = {
    children: 'children',
    label: 'label',
    disabled: (data) => !data.isEditable,
};
function buildTree(permissions) {
    if (!permissions || permissions.length === 0)
        return [];
    const nodeMap = new Map();
    const roots = [];
    // First pass: create all nodes
    for (const p of permissions) {
        if (!p.name)
            continue;
        nodeMap.set(p.name, {
            id: p.name,
            label: p.displayName || p.name,
            children: [],
            isEditable: p.isEditable,
            grantedProviders: p.grantedProviders || [],
        });
    }
    // Second pass: build parent-child relationships
    for (const p of permissions) {
        if (!p.name)
            continue;
        const node = nodeMap.get(p.name);
        if (!node)
            continue;
        if (p.parentName && nodeMap.has(p.parentName)) {
            nodeMap.get(p.parentName).children.push(node);
        }
        else {
            roots.push(node);
        }
    }
    // Clean up empty children arrays
    function clean(nodes) {
        for (const n of nodes) {
            if (n.children && n.children.length === 0) {
                delete n.children;
            }
            else if (n.children) {
                clean(n.children);
            }
        }
    }
    clean(roots);
    return roots;
}
function flattenTree(nodes) {
    const result = [];
    function walk(list) {
        for (const n of list) {
            result.push(n);
            if (n.children)
                walk(n.children);
        }
    }
    walk(nodes);
    return result;
}
function setTreeRef(name, el) {
    if (el) {
        treeRefMap.value[name] = el;
    }
}
function incrementRevision() {
    revCounter.value++;
}
/** Collect all checked keys from all trees */
function getAllCheckedKeys() {
    const keys = [];
    for (const groupName of Object.keys(treeRefMap.value)) {
        const tree = treeRefMap.value[groupName];
        if (tree && typeof tree.getCheckedKeys === 'function') {
            keys.push(...tree.getCheckedKeys());
        }
    }
    return keys;
}
// ============================================================
// Change summary (computed reactively via revCounter)
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _trigger = computed(() => revCounter.value);
const grantCount = computed(() => {
    void revCounter.value; // 依赖追踪
    const checked = new Set(getAllCheckedKeys());
    let count = 0;
    for (const [, state] of permStateMap.value) {
        if (checked.has(state.name) && !state.originalGranted)
            count++;
    }
    return count;
});
const revokeCount = computed(() => {
    void revCounter.value;
    const checked = new Set(getAllCheckedKeys());
    let count = 0;
    for (const [, state] of permStateMap.value) {
        if (!checked.has(state.name) && state.originalGranted)
            count++;
    }
    return count;
});
const changeCount = computed(() => grantCount.value + revokeCount.value);
// ============================================================
// Provider badge helpers
// ============================================================
const providerColorMap = {
    R: 'primary', // Role → blue
    U: 'success', // User → green
    T: 'warning', // Tenant → orange
};
function badgeType(providerName) {
    return providerColorMap[providerName || ''] || 'info';
}
function providerLabel(providerName) {
    const labels = {
        R: 'Role',
        U: 'User',
        T: 'Tenant',
    };
    return labels[providerName || ''] || providerName || 'Unknown';
}
const resourceView = ref('list');
const resourcePermissions = ref([]);
const resourceProviders = ref([]);
const rpAddLevels = ref([]);
const rpSearchResults = ref([]);
const rpSearch = reactive({
    resourceName: '',
    resourceKey: '',
});
const rpAdd = reactive({
    resourceName: '',
    searchQuery: '',
    resourceKey: '',
    permissions: [],
});
const rpEditItem = ref(null);
// ============================================================
// Data loading
// ============================================================
async function loadPermissions() {
    loading.value = true;
    try {
        const result = await permissionsApi.getPermissions({
            providerName: props.providerName,
            providerKey: props.providerKey,
        });
        permissionGroups.value = result.groups || [];
        // Build permission state map for change tracking
        const map = new Map();
        for (const group of result.groups || []) {
            for (const p of group.permissions || []) {
                if (p.name) {
                    map.set(p.name, { name: p.name, originalGranted: p.isGranted });
                }
            }
        }
        permStateMap.value = map;
        if (result.groups && result.groups.length > 0) {
            activeGroupName.value = result.groups[0].name || '';
        }
    }
    catch (e) {
        console.error('Failed to load permissions', e);
    }
    finally {
        loading.value = false;
    }
}
async function loadResourceProviders() {
    try {
        const result = await permissionsApi.getResourceProviders();
        resourceProviders.value = result.providers || [];
    }
    catch {
        // Resource providers may not be configured
    }
}
// ============================================================
// Resource permissions: search / add / remove
// ============================================================
async function searchResourcePermissions() {
    if (!rpSearch.resourceName || !rpSearch.resourceKey)
        return;
    resourcesLoading.value = true;
    try {
        const result = await permissionsApi.getResourcePermissions({
            resourceName: rpSearch.resourceName,
            resourceKey: rpSearch.resourceKey,
        });
        resourcePermissions.value = result.permissions || [];
    }
    catch {
        resourcePermissions.value = [];
    }
    finally {
        resourcesLoading.value = false;
    }
}
async function searchRpKeys() {
    if (!rpAdd.resourceName || !rpAdd.searchQuery)
        return;
    try {
        const result = await permissionsApi.searchResourceProviderKeys({
            resourceName: rpAdd.resourceName,
            filter: rpAdd.searchQuery,
        });
        rpSearchResults.value = result.keys || [];
    }
    catch {
        rpSearchResults.value = [];
    }
}
async function onRpAddTypeChange() {
    rpAdd.resourceKey = '';
    rpAdd.searchQuery = '';
    rpAdd.permissions = [];
    rpSearchResults.value = [];
    rpAddLevels.value = [];
    if (rpAdd.resourceName) {
        try {
            const result = await permissionsApi.getResourcePermissionDefinitions({
                resourceName: rpAdd.resourceName,
            });
            rpAddLevels.value = result.permissions || [];
        }
        catch {
            rpAddLevels.value = [];
        }
    }
}
async function onRpResourceTypeChange() {
    rpSearch.resourceKey = '';
    resourcePermissions.value = [];
}
function showResourceAdd() {
    resourceView.value = 'add';
}
function cancelResourceAdd() {
    resourceView.value = 'list';
    rpAdd.resourceName = '';
    rpAdd.searchQuery = '';
    rpAdd.resourceKey = '';
    rpAdd.permissions = [];
    rpSearchResults.value = [];
    rpAddLevels.value = [];
}
function showResourceEdit(row) {
    rpEditItem.value = row;
    resourceView.value = 'edit';
}
async function confirmAddResourcePermission() {
    if (!rpAdd.resourceKey || !rpAdd.permissions.length)
        return;
    saving.value = true;
    try {
        await permissionsApi.updateResourcePermissions({
            providerName: props.providerName,
            providerKey: props.providerKey,
            permissions: rpAdd.permissions,
        }, {
            resourceName: rpAdd.resourceName,
            resourceKey: rpAdd.resourceKey,
        });
        // Refresh list with current search params
        rpSearch.resourceName = rpAdd.resourceName;
        rpSearch.resourceKey = rpAdd.resourceKey;
        resourceView.value = 'list';
        await searchResourcePermissions();
        cancelResourceAdd();
    }
    catch {
        // Error handled by HTTP interceptor
    }
    finally {
        saving.value = false;
    }
}
async function removeResourcePermission(row) {
    const { ElMessageBox } = await import('element-plus');
    try {
        await ElMessageBox.confirm(`确定移除资源 "${row.providerKey}" 的权限吗？`, '确认删除', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    }
    catch {
        return;
    }
    saving.value = true;
    try {
        const resourceName = rpSearch.resourceName;
        const resourceKey = rpSearch.resourceKey;
        await permissionsApi.deleteResourcePermission({
            resourceName,
            resourceKey,
            providerName: row.providerName,
            providerKey: row.providerKey,
        });
        await searchResourcePermissions();
        resourceView.value = 'list';
    }
    catch {
        // Error handled by HTTP interceptor
    }
    finally {
        saving.value = false;
    }
}
// ============================================================
// Save permission tree changes
// ============================================================
async function handleSave() {
    saving.value = true;
    try {
        const checkedKeys = new Set(getAllCheckedKeys());
        const changedPerms = [];
        for (const [, state] of permStateMap.value) {
            const isNowGranted = checkedKeys.has(state.name);
            if (isNowGranted !== state.originalGranted) {
                changedPerms.push({ name: state.name, isGranted: isNowGranted });
            }
        }
        if (changedPerms.length > 0) {
            await permissionsApi.updatePermissions({ permissions: changedPerms }, { providerName: props.providerName, providerKey: props.providerKey });
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
    await loadPermissions();
    await loadResourceProviders();
}
function handleCancel() {
    dialogVisible.value = false;
    emit('close');
}
async function handleBeforeClose(done) {
    if (changeCount.value > 0) {
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
/** @type {__VLS_StyleScopedClasses['group-tabs']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onOpen': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "权限管理",
    width: "900px",
    closeOnClickModal: (false),
    beforeClose: (__VLS_ctx.handleBeforeClose),
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onOpen': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "权限管理",
    width: "900px",
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
    ...{ class: "permission-modal-body" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (!__VLS_ctx.loading && __VLS_ctx.permissionGroups.length === 0) {
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
        modelValue: (__VLS_ctx.activeTab),
    }));
    const __VLS_15 = __VLS_14({
        modelValue: (__VLS_ctx.activeTab),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    const __VLS_17 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        label: "权限组",
        name: "groups",
    }));
    const __VLS_19 = __VLS_18({
        label: "权限组",
        name: "groups",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    const __VLS_21 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        modelValue: (__VLS_ctx.activeGroupName),
        tabPosition: "left",
        ...{ class: "group-tabs" },
    }));
    const __VLS_23 = __VLS_22({
        modelValue: (__VLS_ctx.activeGroupName),
        tabPosition: "left",
        ...{ class: "group-tabs" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    for (const [group] of __VLS_getVForSourceType((__VLS_ctx.permissionGroups))) {
        const __VLS_25 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            key: (group.name),
            label: (group.displayName || group.name),
            name: (group.name),
        }));
        const __VLS_27 = __VLS_26({
            key: (group.name),
            label: (group.displayName || group.name),
            name: (group.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        __VLS_28.slots.default;
        const __VLS_29 = {}.ElTree;
        /** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            ...{ 'onCheck': {} },
            ref: ((el) => __VLS_ctx.setTreeRef(group.name, el)),
            data: (__VLS_ctx.buildTree(group.permissions)),
            props: (__VLS_ctx.treeProps),
            showCheckbox: true,
            nodeKey: "id",
            defaultExpandAll: true,
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onCheck': {} },
            ref: ((el) => __VLS_ctx.setTreeRef(group.name, el)),
            data: (__VLS_ctx.buildTree(group.permissions)),
            props: (__VLS_ctx.treeProps),
            showCheckbox: true,
            nodeKey: "id",
            defaultExpandAll: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_33;
        let __VLS_34;
        let __VLS_35;
        const __VLS_36 = {
            onCheck: (__VLS_ctx.incrementRevision)
        };
        __VLS_32.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_32.slots;
            const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "permission-node" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "permission-label" },
            });
            (data.label);
            if (data.grantedProviders && data.grantedProviders.length) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "grant-badges" },
                });
                for (const [p] of __VLS_getVForSourceType((data.grantedProviders))) {
                    const __VLS_37 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
                        key: (`${p.providerName}-${p.providerKey}`),
                        type: (__VLS_ctx.badgeType(p.providerName)),
                        size: "small",
                        ...{ class: "grant-tag" },
                    }));
                    const __VLS_39 = __VLS_38({
                        key: (`${p.providerName}-${p.providerKey}`),
                        type: (__VLS_ctx.badgeType(p.providerName)),
                        size: "small",
                        ...{ class: "grant-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
                    __VLS_40.slots.default;
                    (__VLS_ctx.providerLabel(p.providerName));
                    var __VLS_40;
                }
            }
        }
        var __VLS_32;
        var __VLS_28;
    }
    var __VLS_24;
    var __VLS_20;
    const __VLS_41 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        label: "资源权限",
        name: "resources",
    }));
    const __VLS_43 = __VLS_42({
        label: "资源权限",
        name: "resources",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_44.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "resource-permissions-panel" },
    });
    if (__VLS_ctx.resourceView === 'list') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "rp-toolbar" },
        });
        const __VLS_45 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }));
        const __VLS_47 = __VLS_46({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        let __VLS_49;
        let __VLS_50;
        let __VLS_51;
        const __VLS_52 = {
            onClick: (__VLS_ctx.showResourceAdd)
        };
        __VLS_48.slots.default;
        var __VLS_48;
        const __VLS_53 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
            ...{ class: "rp-search-form" },
            inline: true,
        }));
        const __VLS_55 = __VLS_54({
            ...{ class: "rp-search-form" },
            inline: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        __VLS_56.slots.default;
        const __VLS_57 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
            label: "资源类型",
        }));
        const __VLS_59 = __VLS_58({
            label: "资源类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        __VLS_60.slots.default;
        const __VLS_61 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.rpSearch.resourceName),
            placeholder: "选择",
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.rpSearch.resourceName),
            placeholder: "选择",
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_65;
        let __VLS_66;
        let __VLS_67;
        const __VLS_68 = {
            onChange: (__VLS_ctx.onRpResourceTypeChange)
        };
        __VLS_64.slots.default;
        for (const [p] of __VLS_getVForSourceType((__VLS_ctx.resourceProviders))) {
            const __VLS_69 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
                key: (p.name),
                label: (p.displayName || p.name),
                value: (p.name),
            }));
            const __VLS_71 = __VLS_70({
                key: (p.name),
                label: (p.displayName || p.name),
                value: (p.name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        }
        var __VLS_64;
        var __VLS_60;
        const __VLS_73 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
            label: "资源密钥",
        }));
        const __VLS_75 = __VLS_74({
            label: "资源密钥",
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        __VLS_76.slots.default;
        const __VLS_77 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
            modelValue: (__VLS_ctx.rpSearch.resourceKey),
            placeholder: "输入资源密钥",
            ...{ style: {} },
        }));
        const __VLS_79 = __VLS_78({
            modelValue: (__VLS_ctx.rpSearch.resourceKey),
            placeholder: "输入资源密钥",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        var __VLS_76;
        const __VLS_81 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
        const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
        __VLS_84.slots.default;
        const __VLS_85 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_87 = __VLS_86({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        let __VLS_89;
        let __VLS_90;
        let __VLS_91;
        const __VLS_92 = {
            onClick: (__VLS_ctx.searchResourcePermissions)
        };
        __VLS_88.slots.default;
        var __VLS_88;
        var __VLS_84;
        var __VLS_56;
        const __VLS_93 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            data: (__VLS_ctx.resourcePermissions),
            emptyText: "请在上方选择资源类型和密钥后查询",
            stripe: true,
            size: "small",
        }));
        const __VLS_95 = __VLS_94({
            data: (__VLS_ctx.resourcePermissions),
            emptyText: "请在上方选择资源类型和密钥后查询",
            stripe: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.resourcesLoading) }, null, null);
        __VLS_96.slots.default;
        const __VLS_97 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            prop: "providerDisplayName",
            label: "资源类型",
            minWidth: "100",
        }));
        const __VLS_99 = __VLS_98({
            prop: "providerDisplayName",
            label: "资源类型",
            minWidth: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        const __VLS_101 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
            prop: "providerKey",
            label: "资源密钥",
            minWidth: "160",
        }));
        const __VLS_103 = __VLS_102({
            prop: "providerKey",
            label: "资源密钥",
            minWidth: "160",
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        const __VLS_105 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            label: "权限",
            minWidth: "200",
        }));
        const __VLS_107 = __VLS_106({
            label: "权限",
            minWidth: "200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        __VLS_108.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_108.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            (row.permissions?.map((p) => p.displayName || p.name).join(', ') || '-');
        }
        var __VLS_108;
        const __VLS_109 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            label: "操作",
            width: "160",
            fixed: "right",
        }));
        const __VLS_111 = __VLS_110({
            label: "操作",
            width: "160",
            fixed: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        __VLS_112.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_112.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_113 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                ...{ 'onClick': {} },
                size: "small",
            }));
            const __VLS_115 = __VLS_114({
                ...{ 'onClick': {} },
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
            let __VLS_117;
            let __VLS_118;
            let __VLS_119;
            const __VLS_120 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.loading && __VLS_ctx.permissionGroups.length === 0))
                        return;
                    if (!(__VLS_ctx.resourceView === 'list'))
                        return;
                    __VLS_ctx.showResourceEdit(row);
                }
            };
            __VLS_116.slots.default;
            var __VLS_116;
            const __VLS_121 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
                ...{ 'onClick': {} },
                size: "small",
                type: "danger",
            }));
            const __VLS_123 = __VLS_122({
                ...{ 'onClick': {} },
                size: "small",
                type: "danger",
            }, ...__VLS_functionalComponentArgsRest(__VLS_122));
            let __VLS_125;
            let __VLS_126;
            let __VLS_127;
            const __VLS_128 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.loading && __VLS_ctx.permissionGroups.length === 0))
                        return;
                    if (!(__VLS_ctx.resourceView === 'list'))
                        return;
                    __VLS_ctx.removeResourcePermission(row);
                }
            };
            __VLS_124.slots.default;
            var __VLS_124;
        }
        var __VLS_112;
        var __VLS_96;
    }
    if (__VLS_ctx.resourceView === 'add') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "rp-section-title" },
        });
        const __VLS_129 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
            labelWidth: "100px",
            ...{ class: "rp-form" },
        }));
        const __VLS_131 = __VLS_130({
            labelWidth: "100px",
            ...{ class: "rp-form" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        __VLS_132.slots.default;
        const __VLS_133 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
            label: "资源类型",
        }));
        const __VLS_135 = __VLS_134({
            label: "资源类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        __VLS_136.slots.default;
        const __VLS_137 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.rpAdd.resourceName),
            placeholder: "选择资源类型",
        }));
        const __VLS_139 = __VLS_138({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.rpAdd.resourceName),
            placeholder: "选择资源类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        let __VLS_141;
        let __VLS_142;
        let __VLS_143;
        const __VLS_144 = {
            onChange: (__VLS_ctx.onRpAddTypeChange)
        };
        __VLS_140.slots.default;
        for (const [p] of __VLS_getVForSourceType((__VLS_ctx.resourceProviders))) {
            const __VLS_145 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
                key: (p.name),
                label: (p.displayName || p.name),
                value: (p.name),
            }));
            const __VLS_147 = __VLS_146({
                key: (p.name),
                label: (p.displayName || p.name),
                value: (p.name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        }
        var __VLS_140;
        var __VLS_136;
        const __VLS_149 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            label: "搜索资源",
        }));
        const __VLS_151 = __VLS_150({
            label: "搜索资源",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        __VLS_152.slots.default;
        const __VLS_153 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            modelValue: (__VLS_ctx.rpAdd.searchQuery),
            placeholder: "输入关键字搜索",
            ...{ style: {} },
        }));
        const __VLS_155 = __VLS_154({
            modelValue: (__VLS_ctx.rpAdd.searchQuery),
            placeholder: "输入关键字搜索",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        const __VLS_157 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            ...{ 'onClick': {} },
            ...{ style: {} },
        }));
        const __VLS_159 = __VLS_158({
            ...{ 'onClick': {} },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        let __VLS_161;
        let __VLS_162;
        let __VLS_163;
        const __VLS_164 = {
            onClick: (__VLS_ctx.searchRpKeys)
        };
        __VLS_160.slots.default;
        var __VLS_160;
        var __VLS_152;
        const __VLS_165 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            label: "选择资源",
        }));
        const __VLS_167 = __VLS_166({
            label: "选择资源",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        __VLS_168.slots.default;
        const __VLS_169 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
            modelValue: (__VLS_ctx.rpAdd.resourceKey),
            placeholder: "选择资源",
            ...{ style: {} },
        }));
        const __VLS_171 = __VLS_170({
            modelValue: (__VLS_ctx.rpAdd.resourceKey),
            placeholder: "选择资源",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        __VLS_172.slots.default;
        for (const [k] of __VLS_getVForSourceType((__VLS_ctx.rpSearchResults))) {
            const __VLS_173 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
                key: (k.providerKey),
                label: (k.providerDisplayName || k.providerKey),
                value: (k.providerKey),
            }));
            const __VLS_175 = __VLS_174({
                key: (k.providerKey),
                label: (k.providerDisplayName || k.providerKey),
                value: (k.providerKey),
            }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        }
        var __VLS_172;
        var __VLS_168;
        if (__VLS_ctx.rpAddLevels.length) {
            const __VLS_177 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
                label: "权限级别",
            }));
            const __VLS_179 = __VLS_178({
                label: "权限级别",
            }, ...__VLS_functionalComponentArgsRest(__VLS_178));
            __VLS_180.slots.default;
            const __VLS_181 = {}.ElCheckboxGroup;
            /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
            // @ts-ignore
            const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
                modelValue: (__VLS_ctx.rpAdd.permissions),
            }));
            const __VLS_183 = __VLS_182({
                modelValue: (__VLS_ctx.rpAdd.permissions),
            }, ...__VLS_functionalComponentArgsRest(__VLS_182));
            __VLS_184.slots.default;
            for (const [d] of __VLS_getVForSourceType((__VLS_ctx.rpAddLevels))) {
                const __VLS_185 = {}.ElCheckbox;
                /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
                // @ts-ignore
                const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
                    key: (d.name),
                    label: (d.name),
                    value: (d.name),
                }));
                const __VLS_187 = __VLS_186({
                    key: (d.name),
                    label: (d.name),
                    value: (d.name),
                }, ...__VLS_functionalComponentArgsRest(__VLS_186));
                __VLS_188.slots.default;
                (d.displayName || d.name);
                var __VLS_188;
            }
            var __VLS_184;
            var __VLS_180;
        }
        const __VLS_189 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({}));
        const __VLS_191 = __VLS_190({}, ...__VLS_functionalComponentArgsRest(__VLS_190));
        __VLS_192.slots.default;
        const __VLS_193 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.rpAdd.resourceKey || !__VLS_ctx.rpAdd.permissions.length),
        }));
        const __VLS_195 = __VLS_194({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.rpAdd.resourceKey || !__VLS_ctx.rpAdd.permissions.length),
        }, ...__VLS_functionalComponentArgsRest(__VLS_194));
        let __VLS_197;
        let __VLS_198;
        let __VLS_199;
        const __VLS_200 = {
            onClick: (__VLS_ctx.confirmAddResourcePermission)
        };
        __VLS_196.slots.default;
        var __VLS_196;
        const __VLS_201 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
            ...{ 'onClick': {} },
        }));
        const __VLS_203 = __VLS_202({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_202));
        let __VLS_205;
        let __VLS_206;
        let __VLS_207;
        const __VLS_208 = {
            onClick: (__VLS_ctx.cancelResourceAdd)
        };
        __VLS_204.slots.default;
        var __VLS_204;
        var __VLS_192;
        var __VLS_132;
    }
    if (__VLS_ctx.resourceView === 'edit' && __VLS_ctx.rpEditItem) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
            ...{ class: "rp-section-title" },
        });
        const __VLS_209 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
            labelWidth: "100px",
            ...{ class: "rp-form" },
        }));
        const __VLS_211 = __VLS_210({
            labelWidth: "100px",
            ...{ class: "rp-form" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        __VLS_212.slots.default;
        const __VLS_213 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
            label: "资源类型",
        }));
        const __VLS_215 = __VLS_214({
            label: "资源类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        __VLS_216.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.rpEditItem.providerDisplayName || __VLS_ctx.rpEditItem.providerName);
        var __VLS_216;
        const __VLS_217 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
            label: "资源密钥",
        }));
        const __VLS_219 = __VLS_218({
            label: "资源密钥",
        }, ...__VLS_functionalComponentArgsRest(__VLS_218));
        __VLS_220.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.rpEditItem.providerKey);
        var __VLS_220;
        const __VLS_221 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
            label: "当前权限",
        }));
        const __VLS_223 = __VLS_222({
            label: "当前权限",
        }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        __VLS_224.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.rpEditItem.permissions?.map((p) => p.displayName || p.name).join(', ') || '-');
        var __VLS_224;
        const __VLS_225 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
            label: "操作",
        }));
        const __VLS_227 = __VLS_226({
            label: "操作",
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        __VLS_228.slots.default;
        const __VLS_229 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_231 = __VLS_230({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_230));
        let __VLS_233;
        let __VLS_234;
        let __VLS_235;
        const __VLS_236 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.loading && __VLS_ctx.permissionGroups.length === 0))
                    return;
                if (!(__VLS_ctx.resourceView === 'edit' && __VLS_ctx.rpEditItem))
                    return;
                __VLS_ctx.removeResourcePermission(__VLS_ctx.rpEditItem);
            }
        };
        __VLS_232.slots.default;
        var __VLS_232;
        const __VLS_237 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
            ...{ 'onClick': {} },
        }));
        const __VLS_239 = __VLS_238({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        let __VLS_241;
        let __VLS_242;
        let __VLS_243;
        const __VLS_244 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.loading && __VLS_ctx.permissionGroups.length === 0))
                    return;
                if (!(__VLS_ctx.resourceView === 'edit' && __VLS_ctx.rpEditItem))
                    return;
                __VLS_ctx.resourceView = 'list';
            }
        };
        __VLS_240.slots.default;
        var __VLS_240;
        var __VLS_228;
        var __VLS_212;
    }
    var __VLS_44;
    var __VLS_16;
}
if (__VLS_ctx.changeCount > 0 && __VLS_ctx.activeTab === 'groups') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "change-summary" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "change-grant" },
    });
    (__VLS_ctx.grantCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "change-sep" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "change-revoke" },
    });
    (__VLS_ctx.revokeCount);
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_245 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
        ...{ 'onClick': {} },
    }));
    const __VLS_247 = __VLS_246({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    let __VLS_249;
    let __VLS_250;
    let __VLS_251;
    const __VLS_252 = {
        onClick: (__VLS_ctx.handleCancel)
    };
    __VLS_248.slots.default;
    var __VLS_248;
    const __VLS_253 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
        disabled: (__VLS_ctx.saving),
    }));
    const __VLS_255 = __VLS_254({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
        disabled: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_254));
    let __VLS_257;
    let __VLS_258;
    let __VLS_259;
    const __VLS_260 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_256.slots.default;
    var __VLS_256;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['permission-modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['group-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-node']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-label']} */ ;
/** @type {__VLS_StyleScopedClasses['grant-badges']} */ ;
/** @type {__VLS_StyleScopedClasses['grant-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['resource-permissions-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['rp-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['rp-search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['rp-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['rp-form']} */ ;
/** @type {__VLS_StyleScopedClasses['rp-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['rp-form']} */ ;
/** @type {__VLS_StyleScopedClasses['change-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['change-grant']} */ ;
/** @type {__VLS_StyleScopedClasses['change-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['change-revoke']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            dialogVisible: dialogVisible,
            loading: loading,
            saving: saving,
            activeTab: activeTab,
            activeGroupName: activeGroupName,
            permissionGroups: permissionGroups,
            resourcesLoading: resourcesLoading,
            treeProps: treeProps,
            buildTree: buildTree,
            setTreeRef: setTreeRef,
            incrementRevision: incrementRevision,
            grantCount: grantCount,
            revokeCount: revokeCount,
            changeCount: changeCount,
            badgeType: badgeType,
            providerLabel: providerLabel,
            resourceView: resourceView,
            resourcePermissions: resourcePermissions,
            resourceProviders: resourceProviders,
            rpAddLevels: rpAddLevels,
            rpSearchResults: rpSearchResults,
            rpSearch: rpSearch,
            rpAdd: rpAdd,
            rpEditItem: rpEditItem,
            searchResourcePermissions: searchResourcePermissions,
            searchRpKeys: searchRpKeys,
            onRpAddTypeChange: onRpAddTypeChange,
            onRpResourceTypeChange: onRpResourceTypeChange,
            showResourceAdd: showResourceAdd,
            cancelResourceAdd: cancelResourceAdd,
            showResourceEdit: showResourceEdit,
            confirmAddResourcePermission: confirmAddResourcePermission,
            removeResourcePermission: removeResourcePermission,
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
