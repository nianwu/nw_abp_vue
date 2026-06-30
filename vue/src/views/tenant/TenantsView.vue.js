import { ref } from 'vue';
import AbpDataTable from '@/components/AbpDataTable.vue';
import TenantCreateEditModal from './components/TenantCreateEditModal.vue';
import ConnectionStringPanel from './components/ConnectionStringPanel.vue';
import { showConfirm } from '@/components/AbpConfirmDialog';
import { showSuccess, showError, showInfo } from '@/components/AbpToast';
import * as tenantApi from '@/api/tenant';
const tableRef = ref();
const modalVisible = ref(false);
const connectionStringVisible = ref(false);
const editingTenantId = ref(null);
const selectedTenantId = ref(null);
const columns = [
    { prop: 'name', label: '名称', minWidth: '140' },
    { prop: 'adminEmailAddress', label: '管理员邮箱', minWidth: '180' },
    { prop: 'editionName', label: '版本', minWidth: '120' },
    { prop: 'isActive', label: '启用', width: '80', sortable: false },
];
async function fetchTenants(params) {
    return tenantApi.getTenants(params);
}
function openCreate() {
    editingTenantId.value = null;
    modalVisible.value = true;
}
function openEdit(row) {
    editingTenantId.value = row.id || null;
    modalVisible.value = true;
}
function openConnectionStrings(row) {
    selectedTenantId.value = row.id || null;
    connectionStringVisible.value = true;
}
async function handleToggleActive(row, active) {
    try {
        await tenantApi.updateTenant(row.id, {
            name: row.name || '',
            isActive: active,
            concurrencyStamp: row.concurrencyStamp,
        });
        showSuccess(active ? '已启用' : '已禁用');
        tableRef.value?.refresh();
    }
    catch {
        showError('操作失败');
    }
}
async function handleDelete(row) {
    const ok = await showConfirm({
        title: '删除租户',
        message: `确定删除租户 "${row.name}" 吗？`,
    });
    if (!ok)
        return;
    try {
        await tenantApi.deleteTenant(row.id);
        showSuccess('删除成功');
        tableRef.value?.refresh();
    }
    catch {
        showError('删除失败');
    }
}
function handleFeature(row) {
    window.dispatchEvent(new CustomEvent('abp:open-feature-modal', {
        detail: { providerName: 'T', providerKey: row.id },
    }));
    showInfo('功能管理 — 待 B5 任务集成');
}
function onSaved() {
    modalVisible.value = false;
    tableRef.value?.refresh();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4" },
});
/** @type {[typeof AbpDataTable, typeof AbpDataTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AbpDataTable, new AbpDataTable({
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    api: (__VLS_ctx.fetchTenants),
    searchPlaceholder: "搜索租户...",
}));
const __VLS_1 = __VLS_0({
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    api: (__VLS_ctx.fetchTenants),
    searchPlaceholder: "搜索租户...",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {typeof __VLS_ctx.tableRef} */ ;
var __VLS_3 = {};
__VLS_2.slots.default;
{
    const { 'toolbar-actions': __VLS_thisSlot } = __VLS_2.slots;
    const __VLS_5 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_9;
    let __VLS_10;
    let __VLS_11;
    const __VLS_12 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_8.slots.default;
    var __VLS_8;
}
{
    const { 'cell-isActive': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_13 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onChange': {} },
        modelValue: (!!row.isActive),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onChange': {} },
        modelValue: (!!row.isActive),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onChange: ((v) => __VLS_ctx.handleToggleActive(row, !!v))
    };
    var __VLS_16;
}
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_21 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_24.slots.default;
    var __VLS_24;
    const __VLS_29 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openConnectionStrings(row);
        }
    };
    __VLS_32.slots.default;
    var __VLS_32;
    const __VLS_37 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_41;
    let __VLS_42;
    let __VLS_43;
    const __VLS_44 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_40.slots.default;
    var __VLS_40;
    const __VLS_45 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_49;
    let __VLS_50;
    let __VLS_51;
    const __VLS_52 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleFeature(row);
        }
    };
    __VLS_48.slots.default;
    var __VLS_48;
}
var __VLS_2;
/** @type {[typeof TenantCreateEditModal, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(TenantCreateEditModal, new TenantCreateEditModal({
    ...{ 'onSaved': {} },
    visible: (__VLS_ctx.modalVisible),
    tenantId: (__VLS_ctx.editingTenantId),
}));
const __VLS_54 = __VLS_53({
    ...{ 'onSaved': {} },
    visible: (__VLS_ctx.modalVisible),
    tenantId: (__VLS_ctx.editingTenantId),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onSaved: (__VLS_ctx.onSaved)
};
var __VLS_55;
/** @type {[typeof ConnectionStringPanel, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(ConnectionStringPanel, new ConnectionStringPanel({
    visible: (__VLS_ctx.connectionStringVisible),
    tenantId: (__VLS_ctx.selectedTenantId),
}));
const __VLS_61 = __VLS_60({
    visible: (__VLS_ctx.connectionStringVisible),
    tenantId: (__VLS_ctx.selectedTenantId),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
// @ts-ignore
var __VLS_4 = __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AbpDataTable: AbpDataTable,
            TenantCreateEditModal: TenantCreateEditModal,
            ConnectionStringPanel: ConnectionStringPanel,
            tableRef: tableRef,
            modalVisible: modalVisible,
            connectionStringVisible: connectionStringVisible,
            editingTenantId: editingTenantId,
            selectedTenantId: selectedTenantId,
            columns: columns,
            fetchTenants: fetchTenants,
            openCreate: openCreate,
            openEdit: openEdit,
            openConnectionStrings: openConnectionStrings,
            handleToggleActive: handleToggleActive,
            handleDelete: handleDelete,
            handleFeature: handleFeature,
            onSaved: onSaved,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
