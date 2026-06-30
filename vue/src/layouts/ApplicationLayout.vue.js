/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import SideMenu from './partials/SideMenu.vue';
import TopBar from './partials/TopBar.vue';
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
    ...{ class: "h-screen flex flex-col" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "h-screen flex flex-col" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
/** @type {[typeof TopBar, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(TopBar, new TopBar({
    ...{ 'onToggleSidebar': {} },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onToggleSidebar': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onToggleSidebar: (__VLS_ctx.toggleSidebar)
};
var __VLS_7;
const __VLS_12 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "flex-1 overflow-hidden" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "flex-1 overflow-hidden" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "hidden md:flex flex-col shrink-0" },
    width: (__VLS_ctx.sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'),
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "hidden md:flex flex-col shrink-0" },
    width: (__VLS_ctx.sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
/** @type {[typeof SideMenu, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(SideMenu, new SideMenu({
    collapsed: (__VLS_ctx.sidebarCollapsed),
}));
const __VLS_21 = __VLS_20({
    collapsed: (__VLS_ctx.sidebarCollapsed),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_19;
const __VLS_23 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.mobileDrawer),
    direction: "ltr",
    size: "260",
    withHeader: (false),
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.mobileDrawer),
    direction: "ltr",
    size: "260",
    withHeader: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
/** @type {[typeof SideMenu, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(SideMenu, new SideMenu({
    collapsed: (false),
}));
const __VLS_28 = __VLS_27({
    collapsed: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
var __VLS_26;
const __VLS_30 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    ...{ class: "flex flex-col flex-1 overflow-hidden bg-[#f5f7fa]" },
    ...{ style: {} },
}));
const __VLS_32 = __VLS_31({
    ...{ class: "flex flex-col flex-1 overflow-hidden bg-[#f5f7fa]" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ class: "flex-1" },
}));
const __VLS_36 = __VLS_35({
    ...{ class: "flex-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
const __VLS_38 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
var __VLS_37;
var __VLS_33;
var __VLS_15;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[#f5f7fa]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SideMenu: SideMenu,
            TopBar: TopBar,
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
