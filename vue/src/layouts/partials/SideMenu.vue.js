/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HomeFilled, User, Avatar, OfficeBuilding, Setting } from '@element-plus/icons-vue';
import { usePermission } from '@/composables/usePermission';
const ICON_MAP = {
    '/identity/users': User,
    '/identity/roles': Avatar,
    '/tenant-management/tenants': OfficeBuilding,
    '/setting-management': Setting,
};
function iconFor(path) {
    return ICON_MAP[path] || null;
}
const __VLS_props = defineProps();
const route = useRoute();
const router = useRouter();
const { hasPermission } = usePermission();
const activePath = computed(() => route.path);
const menuGroups = computed(() => {
    const routes = router.getRoutes().filter((r) => {
        if (!r.name || !r.path || r.path.includes(':'))
            return false;
        const policy = r.meta.requiredPolicy;
        if (policy && !hasPermission(policy))
            return false;
        return r.path !== '/' && r.path !== '/oidc-callback' && !r.path.startsWith('/account') && !r.path.startsWith('/error');
    });
    const groups = new Map();
    for (const r of routes) {
        const prefix = r.path.split('/')[1] || 'other';
        const prefixLabels = {
            identity: '身份管理',
            'tenant-management': '租户管理',
            'setting-management': '设置管理',
        };
        const label = prefixLabels[prefix] || `其他 (${prefix})`;
        if (!groups.has(label))
            groups.set(label, []);
        groups.get(label).push({ path: r.path, name: r.name, meta: r.meta });
    }
    return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item-group__title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    defaultActive: (__VLS_ctx.activePath),
    collapse: (__VLS_ctx.collapsed),
    ...{ class: "flex-1 w-full" },
    router: true,
}));
const __VLS_2 = __VLS_1({
    defaultActive: (__VLS_ctx.activePath),
    collapse: (__VLS_ctx.collapsed),
    ...{ class: "flex-1 w-full" },
    router: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    index: "/",
}));
const __VLS_7 = __VLS_6({
    index: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.HomeFilled;
/** @type {[typeof __VLS_components.HomeFilled, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_8;
for (const [group] of __VLS_getVForSourceType((__VLS_ctx.menuGroups))) {
    const __VLS_17 = {}.ElMenuItemGroup;
    /** @type {[typeof __VLS_components.ElMenuItemGroup, typeof __VLS_components.elMenuItemGroup, typeof __VLS_components.ElMenuItemGroup, typeof __VLS_components.elMenuItemGroup, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        title: (group.title),
    }));
    const __VLS_19 = __VLS_18({
        title: (group.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    for (const [item] of __VLS_getVForSourceType((group.items))) {
        const __VLS_21 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            key: (item.path),
            index: (item.path),
        }));
        const __VLS_23 = __VLS_22({
            key: (item.path),
            index: (item.path),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        __VLS_24.slots.default;
        if (__VLS_ctx.iconFor(item.path)) {
            const __VLS_25 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
            const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
            __VLS_28.slots.default;
            const __VLS_29 = ((__VLS_ctx.iconFor(item.path)));
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
            const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
            var __VLS_28;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.meta?.title || item.name);
        var __VLS_24;
    }
    var __VLS_20;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            HomeFilled: HomeFilled,
            iconFor: iconFor,
            activePath: activePath,
            menuGroups: menuGroups,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
