import { ref, computed, onMounted } from 'vue';
import { Search, Operation } from '@element-plus/icons-vue';
import HTTPClient from '@/api/http';
import AbpEmptyState from './AbpEmptyState.vue';
const props = withDefaults(defineProps(), {
    searchable: true,
    searchPlaceholder: '搜索...',
    paginated: true,
    pageSizes: () => [10, 20, 50, 100],
    defaultSortProp: 'creationTime',
    rowKey: 'id',
    selectable: false,
    maxHeight: undefined,
    actionsWidth: '180',
});
const __VLS_emit = defineEmits();
// 状态
const items = ref([]);
const totalCount = ref(0);
const loading = ref(false);
const initialLoadDone = ref(false);
const searchText = ref('');
const currentPage = ref(1);
const pageSize = ref(props.pageSizes[0]);
const sortProp = ref(null);
const sortOrder = ref(null);
const visibleColumns = ref(props.columns.map((c) => c.prop));
// 计算
const filteredColumns = computed(() => props.columns.filter((c) => visibleColumns.value.includes(c.prop)));
let debounceTimer = null;
// 加载数据
async function loadData() {
    loading.value = true;
    try {
        const params = { maxResultCount: pageSize.value, skipCount: (currentPage.value - 1) * pageSize.value };
        if (searchText.value)
            params.filter = searchText.value;
        if (sortProp.value)
            params.sorting = `${sortProp.value} ${sortOrder.value}`;
        const result = typeof props.api === 'string'
            ? (await HTTPClient.get(props.api, { params })).data
            : await props.api(params);
        items.value = result.items || [];
        totalCount.value = result.totalCount;
        initialLoadDone.value = true;
    }
    finally {
        loading.value = false;
    }
}
// 搜索防抖
function onSearchInput() {
    if (debounceTimer)
        clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { currentPage.value = 1; loadData(); }, 300);
}
function onSearchClear() { searchText.value = ''; currentPage.value = 1; loadData(); }
// 排序
function onSortChange(sort) {
    sortProp.value = sort.prop;
    sortOrder.value = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : null;
    loadData();
}
// 分页
function onPageChange(p) { currentPage.value = p; loadData(); }
function onPageSizeChange(s) { pageSize.value = s; currentPage.value = 1; loadData(); }
// 初始化
onMounted(() => loadData());
// 暴露刷新方法
const __VLS_exposed = { loadData, refresh: loadData };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    searchable: true,
    searchPlaceholder: '搜索...',
    paginated: true,
    pageSizes: () => [10, 20, 50, 100],
    defaultSortProp: 'creationTime',
    rowKey: 'id',
    selectable: false,
    maxHeight: undefined,
    actionsWidth: '180',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "abp-data-table" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-4 flex-wrap gap-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
if (__VLS_ctx.searchable) {
    const __VLS_0 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onInput': {} },
        ...{ 'onClear': {} },
        modelValue: (__VLS_ctx.searchText),
        placeholder: (__VLS_ctx.searchPlaceholder),
        clearable: true,
        ...{ class: "w-56" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onInput': {} },
        ...{ 'onClear': {} },
        modelValue: (__VLS_ctx.searchText),
        placeholder: (__VLS_ctx.searchPlaceholder),
        clearable: true,
        ...{ class: "w-56" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onInput: (__VLS_ctx.onSearchInput)
    };
    const __VLS_8 = {
        onClear: (__VLS_ctx.onSearchClear)
    };
    __VLS_3.slots.default;
    {
        const { prefix: __VLS_thisSlot } = __VLS_3.slots;
        const __VLS_9 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
        const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
        __VLS_12.slots.default;
        const __VLS_13 = {}.Search;
        /** @type {[typeof __VLS_components.Search, ]} */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
        const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
        var __VLS_12;
    }
    var __VLS_3;
}
var __VLS_17 = {};
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
if (__VLS_ctx.columns.length > 0) {
    const __VLS_19 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        placement: "bottom-end",
        width: (200),
        trigger: "click",
    }));
    const __VLS_21 = __VLS_20({
        placement: "bottom-end",
        width: (200),
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_22.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_22.slots;
        const __VLS_23 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
            size: "small",
            plain: true,
        }));
        const __VLS_25 = __VLS_24({
            size: "small",
            plain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        __VLS_26.slots.default;
        const __VLS_27 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({}));
        const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
        __VLS_30.slots.default;
        const __VLS_31 = {}.Operation;
        /** @type {[typeof __VLS_components.Operation, ]} */ ;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
        const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
        var __VLS_30;
        var __VLS_26;
    }
    const __VLS_35 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        modelValue: (__VLS_ctx.visibleColumns),
    }));
    const __VLS_37 = __VLS_36({
        modelValue: (__VLS_ctx.visibleColumns),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    __VLS_38.slots.default;
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (col.prop),
            ...{ class: "py-1" },
        });
        const __VLS_39 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
            label: (col.prop),
            value: (col.prop),
        }));
        const __VLS_41 = __VLS_40({
            label: (col.prop),
            value: (col.prop),
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        __VLS_42.slots.default;
        (col.label);
        var __VLS_42;
    }
    var __VLS_38;
    var __VLS_22;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overflow-x-auto" },
});
const __VLS_43 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    ...{ 'onSortChange': {} },
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.loading && !__VLS_ctx.initialLoadDone ? [] : __VLS_ctx.items),
    elementLoadingText: ('加载中...'),
    defaultSort: ({ prop: __VLS_ctx.defaultSortProp, order: 'descending' }),
    stripe: true,
    border: true,
    rowKey: (__VLS_ctx.rowKey),
    maxHeight: (__VLS_ctx.maxHeight),
}));
const __VLS_45 = __VLS_44({
    ...{ 'onSortChange': {} },
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.loading && !__VLS_ctx.initialLoadDone ? [] : __VLS_ctx.items),
    elementLoadingText: ('加载中...'),
    defaultSort: ({ prop: __VLS_ctx.defaultSortProp, order: 'descending' }),
    stripe: true,
    border: true,
    rowKey: (__VLS_ctx.rowKey),
    maxHeight: (__VLS_ctx.maxHeight),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_47;
let __VLS_48;
let __VLS_49;
const __VLS_50 = {
    onSortChange: (__VLS_ctx.onSortChange)
};
const __VLS_51 = {
    onSelectionChange: (...[$event]) => {
        __VLS_ctx.$emit('selection-change', $event);
    }
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_46.slots.default;
if (__VLS_ctx.selectable) {
    const __VLS_52 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        type: "selection",
        width: "50",
    }));
    const __VLS_54 = __VLS_53({
        type: "selection",
        width: "50",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.filteredColumns))) {
    const __VLS_56 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        prop: (col.prop),
        label: (col.label),
        width: (col.width),
        minWidth: (col.minWidth),
        sortable: (col.sortable !== false ? 'custom' : false),
    }));
    const __VLS_58 = __VLS_57({
        prop: (col.prop),
        label: (col.label),
        width: (col.width),
        minWidth: (col.minWidth),
        sortable: (col.sortable !== false ? 'custom' : false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_59.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        var __VLS_60 = {
            row: (scope.row),
            $index: (scope.$index),
            column: (col),
        };
        var __VLS_61 = __VLS_tryAsConstant(`cell-${col.prop}`);
        (col.formatter ? col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) : scope.row[col.prop]);
    }
    var __VLS_59;
}
if (__VLS_ctx.$slots.actions) {
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "操作",
        width: (__VLS_ctx.actionsWidth),
        fixed: "right",
    }));
    const __VLS_66 = __VLS_65({
        label: "操作",
        width: (__VLS_ctx.actionsWidth),
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_67.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        var __VLS_68 = {
            row: (scope.row),
            $index: (scope.$index),
        };
    }
    var __VLS_67;
}
if (__VLS_ctx.loading && !__VLS_ctx.initialLoadDone) {
    {
        const { empty: __VLS_thisSlot } = __VLS_46.slots;
        const __VLS_70 = {}.ElSkeleton;
        /** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
            rows: (5),
            animated: true,
        }));
        const __VLS_72 = __VLS_71({
            rows: (5),
            animated: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    }
}
if (!__VLS_ctx.loading && __VLS_ctx.totalCount === 0) {
    {
        const { empty: __VLS_thisSlot } = __VLS_46.slots;
        /** @type {[typeof AbpEmptyState, ]} */ ;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(AbpEmptyState, new AbpEmptyState({
            type: (__VLS_ctx.searchText ? 'no-results' : 'empty'),
        }));
        const __VLS_75 = __VLS_74({
            type: (__VLS_ctx.searchText ? 'no-results' : 'empty'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    }
}
var __VLS_46;
if (__VLS_ctx.paginated && __VLS_ctx.totalCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end mt-4" },
    });
    const __VLS_77 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        pageSizes: (__VLS_ctx.pageSizes),
        total: (__VLS_ctx.totalCount),
        layout: "total, sizes, prev, pager, next, jumper",
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        pageSizes: (__VLS_ctx.pageSizes),
        total: (__VLS_ctx.totalCount),
        layout: "total, sizes, prev, pager, next, jumper",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_81;
    let __VLS_82;
    let __VLS_83;
    const __VLS_84 = {
        onSizeChange: (__VLS_ctx.onPageSizeChange)
    };
    const __VLS_85 = {
        onCurrentChange: (__VLS_ctx.onPageChange)
    };
    var __VLS_80;
}
/** @type {__VLS_StyleScopedClasses['abp-data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-56']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17, __VLS_62 = __VLS_61, __VLS_63 = __VLS_60, __VLS_69 = __VLS_68;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Operation: Operation,
            AbpEmptyState: AbpEmptyState,
            items: items,
            totalCount: totalCount,
            loading: loading,
            initialLoadDone: initialLoadDone,
            searchText: searchText,
            currentPage: currentPage,
            pageSize: pageSize,
            visibleColumns: visibleColumns,
            filteredColumns: filteredColumns,
            onSearchInput: onSearchInput,
            onSearchClear: onSearchClear,
            onSortChange: onSortChange,
            onPageChange: onPageChange,
            onPageSizeChange: onPageSizeChange,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
