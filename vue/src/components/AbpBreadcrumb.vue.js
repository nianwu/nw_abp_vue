import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const breadcrumbs = computed(() => route.matched
    .filter((r) => r.name)
    .map((r) => ({ path: r.path, name: r.name, meta: r.meta })));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    separator: "/",
    ...{ class: "py-2" },
}));
const __VLS_2 = __VLS_1({
    separator: "/",
    ...{ class: "py-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
for (const [item, i] of __VLS_getVForSourceType((__VLS_ctx.breadcrumbs))) {
    const __VLS_5 = {}.ElBreadcrumbItem;
    /** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        key: (item.path),
        to: (i < __VLS_ctx.breadcrumbs.length - 1 ? item.path : undefined),
    }));
    const __VLS_7 = __VLS_6({
        key: (item.path),
        to: (i < __VLS_ctx.breadcrumbs.length - 1 ? item.path : undefined),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    (item.meta?.title || item.name);
    var __VLS_8;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            breadcrumbs: breadcrumbs,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
