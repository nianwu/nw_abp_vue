import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermission } from '@/composables/usePermission';
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
    // 按路径前缀分组
    const groups = new Map();
    for (const r of routes) {
        const prefix = r.path.split('/')[1] || 'other';
        const label = { identity: '身份管理', 'tenant-management': '租户管理', 'setting-management': '设置管理' }[prefix] || prefix;
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
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    defaultActive: (__VLS_ctx.activePath),
    collapse: (__VLS_ctx.collapsed),
    ...{ class: ({ 'h-full': true, 'w-16': __VLS_ctx.collapsed, 'w-56': !__VLS_ctx.collapsed }) },
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409eff",
    router: true,
}));
const __VLS_2 = __VLS_1({
    defaultActive: (__VLS_ctx.activePath),
    collapse: (__VLS_ctx.collapsed),
    ...{ class: ({ 'h-full': true, 'w-16': __VLS_ctx.collapsed, 'w-56': !__VLS_ctx.collapsed }) },
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409eff",
    router: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
for (const [group] of __VLS_getVForSourceType((__VLS_ctx.menuGroups))) {
    const __VLS_5 = {}.ElMenuItemGroup;
    /** @type {[typeof __VLS_components.ElMenuItemGroup, typeof __VLS_components.elMenuItemGroup, typeof __VLS_components.ElMenuItemGroup, typeof __VLS_components.elMenuItemGroup, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        title: (group.title),
    }));
    const __VLS_7 = __VLS_6({
        title: (group.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    for (const [item] of __VLS_getVForSourceType((group.items))) {
        const __VLS_9 = {}.ElMenuItem;
        /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            key: (item.path),
            index: (item.path),
        }));
        const __VLS_11 = __VLS_10({
            key: (item.path),
            index: (item.path),
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        __VLS_12.slots.default;
        if (item.meta?.icon) {
            const __VLS_13 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
            const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
            __VLS_16.slots.default;
            const __VLS_17 = ((item.meta.icon));
            // @ts-ignore
            const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
            const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
            var __VLS_16;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.meta?.title || item.name);
        var __VLS_12;
    }
    var __VLS_8;
}
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
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
