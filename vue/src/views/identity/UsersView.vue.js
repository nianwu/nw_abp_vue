/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { Edit, Lock, Delete } from '@element-plus/icons-vue';
import AbpDataTable from '@/components/AbpDataTable.vue';
import UserCreateEditModal from './components/UserCreateEditModal.vue';
import { showConfirm } from '@/components/AbpConfirmDialog';
import { showSuccess, showError } from '@/components/AbpToast';
import { openPermissionModal } from '@/utils/permission-modal';
import * as usersApi from '@/api/identity-users';
const tableRef = ref();
const modalVisible = ref(false);
const editingUserId = ref(null);
const columns = [
    { prop: 'userName', label: '用户名', minWidth: '120' },
    { prop: 'name', label: '姓名', minWidth: '100' },
    { prop: 'surname', label: '姓氏', minWidth: '100' },
    { prop: 'email', label: '邮箱', minWidth: '160' },
    { prop: 'phoneNumber', label: '手机号', minWidth: '120', hideOnMobile: true },
    { prop: 'creationTime', label: '创建时间', minWidth: '160', dateRender: true, hideOnMobile: true },
    { prop: 'lastModificationTime', label: '最后修改时间', minWidth: '160', dateRender: true, hideOnMobile: true },
];
async function fetchUsers(params) {
    return usersApi.getUsers(params);
}
function openCreate() { editingUserId.value = null; modalVisible.value = true; }
function openEdit(row) { editingUserId.value = row.id; modalVisible.value = true; }
async function handleDelete(row) {
    const ok = await showConfirm({ title: '删除用户', message: `确定删除用户 "${row.userName}" 吗？` });
    if (!ok)
        return;
    try {
        await usersApi.deleteUser(row.id);
        showSuccess('删除成功');
        tableRef.value?.refresh();
    }
    catch {
        showError('删除失败');
    }
}
function openPermissionForUser(row) {
    if (!row.id)
        return;
    const modal = openPermissionModal({
        providerName: 'U',
        providerKey: row.id,
    });
    modal.onSaved(() => {
        showSuccess('权限保存成功');
        tableRef.value?.refresh();
    });
    modal.open();
}
function onSaved() { modalVisible.value = false; tableRef.value?.refresh(); }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof AbpDataTable, typeof AbpDataTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AbpDataTable, new AbpDataTable({
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    api: (__VLS_ctx.fetchUsers),
    searchPlaceholder: "搜索用户...",
    storageKey: "identity-users",
}));
const __VLS_1 = __VLS_0({
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    api: (__VLS_ctx.fetchUsers),
    searchPlaceholder: "搜索用户...",
    storageKey: "identity-users",
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
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_13 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Edit),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Edit),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_16.slots.default;
    var __VLS_16;
    const __VLS_21 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "warning",
        icon: (__VLS_ctx.Lock),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "warning",
        icon: (__VLS_ctx.Lock),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openPermissionForUser(row);
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
        link: true,
        type: "danger",
        icon: (__VLS_ctx.Delete),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "danger",
        icon: (__VLS_ctx.Delete),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_32.slots.default;
    var __VLS_32;
}
var __VLS_2;
/** @type {[typeof UserCreateEditModal, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(UserCreateEditModal, new UserCreateEditModal({
    ...{ 'onSaved': {} },
    visible: (__VLS_ctx.modalVisible),
    userId: (__VLS_ctx.editingUserId),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onSaved': {} },
    visible: (__VLS_ctx.modalVisible),
    userId: (__VLS_ctx.editingUserId),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onSaved: (__VLS_ctx.onSaved)
};
var __VLS_39;
// @ts-ignore
var __VLS_4 = __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Edit: Edit,
            Lock: Lock,
            Delete: Delete,
            AbpDataTable: AbpDataTable,
            UserCreateEditModal: UserCreateEditModal,
            tableRef: tableRef,
            modalVisible: modalVisible,
            editingUserId: editingUserId,
            columns: columns,
            fetchUsers: fetchUsers,
            openCreate: openCreate,
            openEdit: openEdit,
            handleDelete: handleDelete,
            openPermissionForUser: openPermissionForUser,
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
