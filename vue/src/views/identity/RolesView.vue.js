import { ref } from 'vue';
import AbpDataTable from '@/components/AbpDataTable.vue';
import RoleCreateEditModal from './components/RoleCreateEditModal.vue';
import { showConfirm } from '@/components/AbpConfirmDialog';
import { showSuccess, showError } from '@/components/AbpToast';
import * as identityRolesApi from '@/api/identity-roles';
const tableRef = ref();
const modalVisible = ref(false);
const editingRoleId = ref(null);
const columns = [
    { prop: 'name', label: '角色名', minWidth: '140' },
    { prop: 'isDefault', label: '默认角色', minWidth: '100' },
    { prop: 'isPublic', label: '公开角色', minWidth: '100' },
    { prop: 'isStatic', label: '静态角色', minWidth: '100' },
];
async function fetchRoles(params) {
    return identityRolesApi.getRoles(params);
}
function openCreate() { editingRoleId.value = null; modalVisible.value = true; }
function openEdit(row) { editingRoleId.value = row.id; modalVisible.value = true; }
async function handleDelete(row) {
    if (row.isStatic)
        return;
    const ok = await showConfirm({ title: '删除角色', message: `确定删除角色 "${row.name}" 吗？` });
    if (!ok)
        return;
    try {
        await identityRolesApi.deleteRole(row.id);
        showSuccess('删除成功');
        tableRef.value?.refresh();
    }
    catch {
        showError('删除失败');
    }
}
/** 保留给 B4 权限管理使用（动态导入，编译时不存在） */
let _openPermissionModal = null;
async function getPermissionModal() {
    if (!_openPermissionModal) {
        // @ts-expect-error — B4 任务创建前模块不存在，运行时 catch 静默兜底
        const mod = await import('@/utils/permission-modal');
        _openPermissionModal = mod.openPermissionModal;
    }
    return _openPermissionModal;
}
async function handleOpenPermission(row) {
    try {
        const fn = await getPermissionModal();
        if (fn)
            fn({ providerName: 'R', providerKey: row.name ?? '' });
        else
            showError('权限管理组件尚未就绪');
    }
    catch {
        showError('权限管理组件尚未就绪');
    }
}
function onSaved() { modalVisible.value = false; tableRef.value?.refresh(); }
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
    api: (__VLS_ctx.fetchRoles),
    searchPlaceholder: "搜索角色...",
}));
const __VLS_1 = __VLS_0({
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    api: (__VLS_ctx.fetchRoles),
    searchPlaceholder: "搜索角色...",
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
    const { 'cell-isDefault': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.isDefault) {
        const __VLS_13 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
            type: "success",
            size: "small",
        }));
        const __VLS_15 = __VLS_14({
            type: "success",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        __VLS_16.slots.default;
        var __VLS_16;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
}
{
    const { 'cell-isPublic': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.isPublic) {
        const __VLS_17 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            type: "info",
            size: "small",
        }));
        const __VLS_19 = __VLS_18({
            type: "info",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        __VLS_20.slots.default;
        var __VLS_20;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
}
{
    const { 'cell-isStatic': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.isStatic) {
        const __VLS_21 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            type: "warning",
            size: "small",
        }));
        const __VLS_23 = __VLS_22({
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        __VLS_24.slots.default;
        var __VLS_24;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
}
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_25 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_28.slots.default;
    var __VLS_28;
    const __VLS_33 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        disabled: (row.isStatic),
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        disabled: (row.isStatic),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_37;
    let __VLS_38;
    let __VLS_39;
    const __VLS_40 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_36.slots.default;
    var __VLS_36;
    const __VLS_41 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        plain: true,
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleOpenPermission(row);
        }
    };
    __VLS_44.slots.default;
    var __VLS_44;
}
var __VLS_2;
/** @type {[typeof RoleCreateEditModal, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(RoleCreateEditModal, new RoleCreateEditModal({
    ...{ 'onSaved': {} },
    visible: (__VLS_ctx.modalVisible),
    roleId: (__VLS_ctx.editingRoleId),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onSaved': {} },
    visible: (__VLS_ctx.modalVisible),
    roleId: (__VLS_ctx.editingRoleId),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onSaved: (__VLS_ctx.onSaved)
};
var __VLS_51;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
// @ts-ignore
var __VLS_4 = __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AbpDataTable: AbpDataTable,
            RoleCreateEditModal: RoleCreateEditModal,
            tableRef: tableRef,
            modalVisible: modalVisible,
            editingRoleId: editingRoleId,
            columns: columns,
            fetchRoles: fetchRoles,
            openCreate: openCreate,
            openEdit: openEdit,
            handleDelete: handleDelete,
            handleOpenPermission: handleOpenPermission,
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
