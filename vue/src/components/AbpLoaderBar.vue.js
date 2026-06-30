/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
/**
 * 全局加载进度条 — nprogress 封装
 * 通过 httpClient 拦截器自动联动，无需手动调用
 */
import nprogress from 'nprogress';
let pending = 0;
export function startLoader() {
    if (pending === 0)
        nprogress.start();
    pending++;
}
export function stopLoader() {
    pending = Math.max(0, pending - 1);
    if (pending === 0)
        nprogress.done();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({});
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
