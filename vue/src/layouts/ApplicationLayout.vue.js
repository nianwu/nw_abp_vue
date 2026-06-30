import { ref } from 'vue';
import SideMenu from './partials/SideMenu.vue';
import TopBar from './partials/TopBar.vue';
import AbpBreadcrumb from '@/components/AbpBreadcrumb.vue';
const sidebarCollapsed = ref(false);
const mobileDrawer = ref(false);
function toggleSidebar() {
    if (window.innerWidth < 768) {
        mobileDrawer.value = !mobileDrawer.value;
    }
    else {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "h-screen" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "h-screen" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "hidden md:block" },
    width: (__VLS_ctx.sidebarCollapsed ? '64px' : '260px'),
    ...{ style: {} },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "hidden md:block" },
    width: (__VLS_ctx.sidebarCollapsed ? '64px' : '260px'),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof SideMenu, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(SideMenu, new SideMenu({
    collapsed: (__VLS_ctx.sidebarCollapsed),
}));
const __VLS_10 = __VLS_9({
    collapsed: (__VLS_ctx.sidebarCollapsed),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_8;
const __VLS_12 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.mobileDrawer),
    direction: "ltr",
    size: "260px",
    withHeader: (false),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.mobileDrawer),
    direction: "ltr",
    size: "260px",
    withHeader: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
/** @type {[typeof SideMenu, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(SideMenu, new SideMenu({
    collapsed: (false),
}));
const __VLS_17 = __VLS_16({
    collapsed: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_15;
const __VLS_19 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
/** @type {[typeof TopBar, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(TopBar, new TopBar({
    ...{ 'onToggleSidebar': {} },
}));
const __VLS_24 = __VLS_23({
    ...{ 'onToggleSidebar': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onToggleSidebar: (__VLS_ctx.toggleSidebar)
};
var __VLS_25;
const __VLS_30 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    ...{ class: "flex flex-col" },
}));
const __VLS_32 = __VLS_31({
    ...{ class: "flex flex-col" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
/** @type {[typeof AbpBreadcrumb, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(AbpBreadcrumb, new AbpBreadcrumb({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1" },
});
const __VLS_37 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
var __VLS_33;
var __VLS_22;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SideMenu: SideMenu,
            TopBar: TopBar,
            AbpBreadcrumb: AbpBreadcrumb,
            sidebarCollapsed: sidebarCollapsed,
            mobileDrawer: mobileDrawer,
            toggleSidebar: toggleSidebar,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
