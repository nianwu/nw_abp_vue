/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { Search, Operation, Delete, Refresh } from '@element-plus/icons-vue';
import { format, formatDistanceStrict, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import HTTPClient from '@/api/http';
import AbpEmptyState from './AbpEmptyState.vue';
const DATE_RENDER_MODES = [
    { value: 'full', label: '完整日期', example: '2026-06-30 23:37:15' },
    { value: 'relative', label: '相对时间', example: '3 小时前 / >3天显示完整日期' },
    { value: 'combined', label: '完整+相对', example: '2026-06-30 23:37 (3小时前)' },
];
function formatDateCell(cell, mode) {
    if (!cell)
        return '-';
    let date;
    try {
        date = new Date(cell);
        if (isNaN(date.getTime()))
            return String(cell);
    }
    catch {
        return String(cell);
    }
    const full = format(date, 'yyyy-MM-dd HH:mm:ss');
    if (mode === 'full')
        return full;
    // 超过 3 天回退完整日期
    if (differenceInDays(Date.now(), date) > 3)
        return full;
    const relative = formatDistanceStrict(date, Date.now(), { locale: zhCN, addSuffix: true });
    if (mode === 'relative')
        return relative;
    // combined
    return `${full} (${relative})`;
}
const props = withDefaults(defineProps(), {
    searchable: true,
    searchPlaceholder: '搜索...',
    paginated: true,
    pageSizes: () => [10, 20, 50, 100],
    defaultSortProp: 'creationTime',
    rowKey: 'id',
    selectable: false,
    maxHeight: undefined,
    actionsWidth: '240',
});
const __VLS_emit = defineEmits();
// 状态
const items = ref([]);
const totalCount = ref(0);
const loading = ref(false);
const initialLoadDone = ref(false);
const searchText = ref('');
const STORAGE_PREFIX = 'abp:page-size:';
function loadPageSize() {
    if (!props.storageKey)
        return props.pageSizes[0];
    try {
        const saved = localStorage.getItem(STORAGE_PREFIX + props.storageKey);
        const n = saved ? parseInt(saved, 10) : 0;
        return props.pageSizes.includes(n) ? n : props.pageSizes[0];
    }
    catch {
        return props.pageSizes[0];
    }
}
function savePageSize(size) {
    if (!props.storageKey)
        return;
    try {
        localStorage.setItem(STORAGE_PREFIX + props.storageKey, String(size));
    }
    catch { /* quota exceeded */ }
}
// 日期列渲染格式 — 按 prop 存储，localStorage 持久化
const DATERENDER_KEY = 'abp:date-render:';
const dateRenderFormats = ref({});
function loadDateFormats() {
    if (!props.storageKey)
        return;
    const dateCols = props.columns.filter((c) => c.dateRender);
    for (const col of dateCols) {
        try {
            const saved = localStorage.getItem(DATERENDER_KEY + props.storageKey + ':' + col.prop);
            dateRenderFormats.value[col.prop] = saved && DATE_RENDER_MODES.some((m) => m.value === saved) ? saved : 'full';
        }
        catch {
            dateRenderFormats.value[col.prop] = 'full';
        }
    }
}
function setDateRenderFormat(prop, mode) {
    dateRenderFormats.value[prop] = mode;
    if (!props.storageKey)
        return;
    try {
        localStorage.setItem(DATERENDER_KEY + props.storageKey + ':' + prop, mode);
    }
    catch { /* quota */ }
}
loadDateFormats();
// 列宽持久化
const COLWIDTH_KEY = 'abp:col-width:';
const columnWidths = ref({});
function loadColWidths() {
    if (!props.storageKey)
        return;
    for (const col of props.columns) {
        try {
            const saved = localStorage.getItem(COLWIDTH_KEY + props.storageKey + ':' + col.prop);
            if (saved)
                columnWidths.value[col.prop] = saved;
        }
        catch { /* */ }
    }
    // 操作列宽
    try {
        const saved = localStorage.getItem(COLWIDTH_KEY + props.storageKey + ':__actions__');
        if (saved)
            columnWidths.value['__actions__'] = saved;
    }
    catch { /* */ }
}
loadColWidths();
function saveColWidth(prop, width) {
    columnWidths.value[prop] = width;
    if (!props.storageKey)
        return;
    try {
        localStorage.setItem(COLWIDTH_KEY + props.storageKey + ':' + prop, width);
    }
    catch { /* */ }
}
function resetColWidth(prop) {
    if (!props.storageKey)
        return;
    try {
        localStorage.removeItem(COLWIDTH_KEY + props.storageKey + ':' + prop);
    }
    catch { /* */ }
    delete columnWidths.value[prop];
    // 触发响应式更新
    columnWidths.value = { ...columnWidths.value };
}
function clearColWidths() {
    if (!props.storageKey)
        return;
    for (const col of props.columns) {
        try {
            localStorage.removeItem(COLWIDTH_KEY + props.storageKey + ':' + col.prop);
        }
        catch { /* */ }
    }
    try {
        localStorage.removeItem(COLWIDTH_KEY + props.storageKey + ':__actions__');
    }
    catch { /* */ }
    columnWidths.value = {};
}
function colResizedWidth(col) {
    return columnWidths.value[col.prop] || col.width || undefined;
}
const actionsColWidth = computed(() => columnWidths.value['__actions__'] || props.actionsWidth);
// Element Plus 原生列宽拖拽事件
function onHeaderDragEnd(newWidth, _oldWidth, column) {
    const key = column.property || '__actions__';
    saveColWidth(key, newWidth + 'px');
}
const currentPage = ref(1);
const pageSize = ref(loadPageSize());
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
function onPageSizeChange(s) { pageSize.value = s; savePageSize(s); currentPage.value = 1; loadData(); }
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
    actionsWidth: '240',
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
        width: (280),
        trigger: "hover",
    }));
    const __VLS_21 = __VLS_20({
        placement: "bottom-end",
        width: (280),
        trigger: "hover",
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
            title: "列设置",
        }));
        const __VLS_25 = __VLS_24({
            size: "small",
            plain: true,
            title: "列设置",
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "column-settings" },
    });
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
            ...{ class: "col-setting-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between" },
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
        if (__VLS_ctx.columnWidths[col.prop]) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-center gap-1" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-xs text-gray-400" },
            });
            (__VLS_ctx.columnWidths[col.prop]);
            const __VLS_43 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
                type: "danger",
                title: "重置此列宽",
            }));
            const __VLS_45 = __VLS_44({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
                type: "danger",
                title: "重置此列宽",
            }, ...__VLS_functionalComponentArgsRest(__VLS_44));
            let __VLS_47;
            let __VLS_48;
            let __VLS_49;
            const __VLS_50 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.columns.length > 0))
                        return;
                    if (!(__VLS_ctx.columnWidths[col.prop]))
                        return;
                    __VLS_ctx.resetColWidth(col.prop);
                }
            };
            __VLS_46.slots.default;
            const __VLS_51 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
                size: (12),
            }));
            const __VLS_53 = __VLS_52({
                size: (12),
            }, ...__VLS_functionalComponentArgsRest(__VLS_52));
            __VLS_54.slots.default;
            const __VLS_55 = {}.Delete;
            /** @type {[typeof __VLS_components.Delete, ]} */ ;
            // @ts-ignore
            const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({}));
            const __VLS_57 = __VLS_56({}, ...__VLS_functionalComponentArgsRest(__VLS_56));
            var __VLS_54;
            var __VLS_46;
        }
        if (col.dateRender && __VLS_ctx.visibleColumns.includes(col.prop)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "ml-6 mt-1" },
            });
            const __VLS_59 = {}.ElRadioGroup;
            /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
            // @ts-ignore
            const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
                ...{ 'onChange': {} },
                modelValue: (__VLS_ctx.dateRenderFormats[col.prop] || 'full'),
                size: "small",
            }));
            const __VLS_61 = __VLS_60({
                ...{ 'onChange': {} },
                modelValue: (__VLS_ctx.dateRenderFormats[col.prop] || 'full'),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_60));
            let __VLS_63;
            let __VLS_64;
            let __VLS_65;
            const __VLS_66 = {
                onChange: ((v) => __VLS_ctx.setDateRenderFormat(col.prop, v))
            };
            __VLS_62.slots.default;
            for (const [m] of __VLS_getVForSourceType((__VLS_ctx.DATE_RENDER_MODES))) {
                const __VLS_67 = {}.ElRadioButton;
                /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
                // @ts-ignore
                const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
                    key: (m.value),
                    value: (m.value),
                }));
                const __VLS_69 = __VLS_68({
                    key: (m.value),
                    value: (m.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_68));
                __VLS_70.slots.default;
                (m.label);
                var __VLS_70;
            }
            var __VLS_62;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "text-xs text-gray-400 mt-1" },
            });
            (__VLS_ctx.DATE_RENDER_MODES.find((m) => m.value === (__VLS_ctx.dateRenderFormats[col.prop] || 'full'))?.example);
        }
    }
    var __VLS_38;
    if (__VLS_ctx.$slots.actions && __VLS_ctx.columnWidths['__actions__']) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "col-setting-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs text-gray-400" },
        });
        (__VLS_ctx.columnWidths['__actions__']);
        const __VLS_71 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
            ...{ 'onClick': {} },
            size: "small",
            text: true,
            type: "primary",
            title: "重置列宽",
        }));
        const __VLS_73 = __VLS_72({
            ...{ 'onClick': {} },
            size: "small",
            text: true,
            type: "primary",
            title: "重置列宽",
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        let __VLS_75;
        let __VLS_76;
        let __VLS_77;
        const __VLS_78 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.columns.length > 0))
                    return;
                if (!(__VLS_ctx.$slots.actions && __VLS_ctx.columnWidths['__actions__']))
                    return;
                __VLS_ctx.resetColWidth('__actions__');
            }
        };
        __VLS_74.slots.default;
        const __VLS_79 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
            size: (12),
        }));
        const __VLS_81 = __VLS_80({
            size: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_80));
        __VLS_82.slots.default;
        const __VLS_83 = {}.Refresh;
        /** @type {[typeof __VLS_components.Refresh, ]} */ ;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({}));
        const __VLS_85 = __VLS_84({}, ...__VLS_functionalComponentArgsRest(__VLS_84));
        var __VLS_82;
        var __VLS_74;
    }
    const __VLS_87 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({}));
    const __VLS_89 = __VLS_88({}, ...__VLS_functionalComponentArgsRest(__VLS_88));
    const __VLS_91 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
        size: "small",
        plain: true,
        title: "清除所有手动调整的列宽，恢复默认",
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
        size: "small",
        plain: true,
        title: "清除所有手动调整的列宽，恢复默认",
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_95;
    let __VLS_96;
    let __VLS_97;
    const __VLS_98 = {
        onClick: (__VLS_ctx.clearColWidths)
    };
    __VLS_94.slots.default;
    var __VLS_94;
    var __VLS_22;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overflow-x-auto" },
});
const __VLS_99 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    ...{ 'onSortChange': {} },
    ...{ 'onSelectionChange': {} },
    ...{ 'onHeaderDragend': {} },
    data: (__VLS_ctx.loading && !__VLS_ctx.initialLoadDone ? [] : __VLS_ctx.items),
    elementLoadingText: ('加载中...'),
    defaultSort: ({ prop: __VLS_ctx.defaultSortProp, order: 'descending' }),
    stripe: true,
    border: true,
    rowKey: (__VLS_ctx.rowKey),
    maxHeight: (__VLS_ctx.maxHeight),
}));
const __VLS_101 = __VLS_100({
    ...{ 'onSortChange': {} },
    ...{ 'onSelectionChange': {} },
    ...{ 'onHeaderDragend': {} },
    data: (__VLS_ctx.loading && !__VLS_ctx.initialLoadDone ? [] : __VLS_ctx.items),
    elementLoadingText: ('加载中...'),
    defaultSort: ({ prop: __VLS_ctx.defaultSortProp, order: 'descending' }),
    stripe: true,
    border: true,
    rowKey: (__VLS_ctx.rowKey),
    maxHeight: (__VLS_ctx.maxHeight),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_103;
let __VLS_104;
let __VLS_105;
const __VLS_106 = {
    onSortChange: (__VLS_ctx.onSortChange)
};
const __VLS_107 = {
    onSelectionChange: (...[$event]) => {
        __VLS_ctx.$emit('selection-change', $event);
    }
};
const __VLS_108 = {
    onHeaderDragend: (__VLS_ctx.onHeaderDragEnd)
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_102.slots.default;
if (__VLS_ctx.selectable) {
    const __VLS_109 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        type: "selection",
        width: "50",
    }));
    const __VLS_111 = __VLS_110({
        type: "selection",
        width: "50",
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
}
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.filteredColumns))) {
    const __VLS_113 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        prop: (col.prop),
        label: (col.label),
        width: (__VLS_ctx.colResizedWidth(col)),
        minWidth: (col.minWidth || '80'),
        sortable: (col.sortable !== false ? 'custom' : false),
        className: (col.hideOnMobile ? 'hide-on-mobile' : undefined),
        resizable: (true),
        align: "center",
    }));
    const __VLS_115 = __VLS_114({
        prop: (col.prop),
        label: (col.label),
        width: (__VLS_ctx.colResizedWidth(col)),
        minWidth: (col.minWidth || '80'),
        sortable: (col.sortable !== false ? 'custom' : false),
        className: (col.hideOnMobile ? 'hide-on-mobile' : undefined),
        resizable: (true),
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_116.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_116.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        var __VLS_117 = {
            row: (scope.row),
            $index: (scope.$index),
            column: (col),
        };
        var __VLS_118 = __VLS_tryAsConstant(`cell-${col.prop}`);
        if (col.dateRender) {
            (__VLS_ctx.formatDateCell(scope.row[col.prop], __VLS_ctx.dateRenderFormats[col.prop] || 'full'));
        }
        else {
            (col.formatter ? col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) : scope.row[col.prop]);
        }
    }
    var __VLS_116;
}
if (__VLS_ctx.$slots.actions) {
    const __VLS_121 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        label: "操作",
        width: (__VLS_ctx.actionsColWidth),
        fixed: "right",
        align: "center",
        className: "actions-column",
    }));
    const __VLS_123 = __VLS_122({
        label: "操作",
        width: (__VLS_ctx.actionsColWidth),
        fixed: "right",
        align: "center",
        className: "actions-column",
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_124.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        var __VLS_125 = {
            row: (scope.row),
            $index: (scope.$index),
        };
    }
    var __VLS_124;
}
if (__VLS_ctx.loading && !__VLS_ctx.initialLoadDone) {
    {
        const { empty: __VLS_thisSlot } = __VLS_102.slots;
        const __VLS_127 = {}.ElSkeleton;
        /** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            rows: (5),
            animated: true,
        }));
        const __VLS_129 = __VLS_128({
            rows: (5),
            animated: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    }
}
if (!__VLS_ctx.loading && __VLS_ctx.totalCount === 0) {
    {
        const { empty: __VLS_thisSlot } = __VLS_102.slots;
        /** @type {[typeof AbpEmptyState, ]} */ ;
        // @ts-ignore
        const __VLS_131 = __VLS_asFunctionalComponent(AbpEmptyState, new AbpEmptyState({
            type: (__VLS_ctx.searchText ? 'no-results' : 'empty'),
        }));
        const __VLS_132 = __VLS_131({
            type: (__VLS_ctx.searchText ? 'no-results' : 'empty'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    }
}
var __VLS_102;
if (__VLS_ctx.paginated && __VLS_ctx.totalCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end mt-4" },
    });
    const __VLS_134 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        pageSizes: (__VLS_ctx.pageSizes),
        total: (__VLS_ctx.totalCount),
        layout: "total, sizes, prev, pager, next, jumper",
    }));
    const __VLS_136 = __VLS_135({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        pageSizes: (__VLS_ctx.pageSizes),
        total: (__VLS_ctx.totalCount),
        layout: "total, sizes, prev, pager, next, jumper",
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    let __VLS_138;
    let __VLS_139;
    let __VLS_140;
    const __VLS_141 = {
        onSizeChange: (__VLS_ctx.onPageSizeChange)
    };
    const __VLS_142 = {
        onCurrentChange: (__VLS_ctx.onPageChange)
    };
    var __VLS_137;
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
/** @type {__VLS_StyleScopedClasses['column-settings']} */ ;
/** @type {__VLS_StyleScopedClasses['col-setting-item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['col-setting-item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17, __VLS_119 = __VLS_118, __VLS_120 = __VLS_117, __VLS_126 = __VLS_125;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Operation: Operation,
            Delete: Delete,
            Refresh: Refresh,
            AbpEmptyState: AbpEmptyState,
            DATE_RENDER_MODES: DATE_RENDER_MODES,
            formatDateCell: formatDateCell,
            items: items,
            totalCount: totalCount,
            loading: loading,
            initialLoadDone: initialLoadDone,
            searchText: searchText,
            dateRenderFormats: dateRenderFormats,
            setDateRenderFormat: setDateRenderFormat,
            columnWidths: columnWidths,
            resetColWidth: resetColWidth,
            clearColWidths: clearColWidths,
            colResizedWidth: colResizedWidth,
            actionsColWidth: actionsColWidth,
            onHeaderDragEnd: onHeaderDragEnd,
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
