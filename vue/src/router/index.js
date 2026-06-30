import { createRouter, createWebHistory } from 'vue-router';
import { registerAuthGuard } from './guards/auth';
import { registerPermissionGuard } from './guards/permission';
const routes = [
    {
        path: '/',
        name: 'Home',
        meta: { layout: 'application' },
        component: () => import('@/views/HomeView.vue'),
    },
    // OIDC
    { path: '/oidc-callback', name: 'OidcCallback', component: () => import('@/views/auth/OidcCallbackView.vue') },
    // Account (AccountLayout)
    { path: '/account/login', name: 'Login', meta: { layout: 'account' }, component: () => import('@/views/auth/LoginView.vue') },
    { path: '/account/register', name: 'Register', meta: { layout: 'account' }, component: () => import('@/views/auth/RegisterView.vue') },
    { path: '/account/forgot-password', name: 'ForgotPassword', meta: { layout: 'account' }, component: () => import('@/views/auth/ForgotPasswordView.vue') },
    { path: '/account/reset-password', name: 'ResetPassword', meta: { layout: 'account' }, component: () => import('@/views/auth/ResetPasswordView.vue') },
    { path: '/account/manage-profile', name: 'ManageProfile', meta: { layout: 'application', requiredPolicy: 'AbpAccount.AccountManagement' }, component: () => import('@/views/auth/ManageProfileView.vue') },
    // Identity (ApplicationLayout)
    { path: '/identity/users', name: 'Users', meta: { layout: 'application', requiredPolicy: 'AbpIdentity.Users', title: '用户管理' }, component: () => import('@/views/identity/UsersView.vue') },
    { path: '/identity/roles', name: 'Roles', meta: { layout: 'application', requiredPolicy: 'AbpIdentity.Roles', title: '角色管理' }, component: () => import('@/views/identity/RolesView.vue') },
    // Tenant (ApplicationLayout)
    { path: '/tenant-management/tenants', name: 'Tenants', meta: { layout: 'application', requiredPolicy: 'AbpTenantManagement.Tenants', title: '租户管理' }, component: () => import('@/views/tenant/TenantsView.vue') },
    // Settings (ApplicationLayout)
    { path: '/setting-management', name: 'Settings', meta: { layout: 'application', requiredPolicy: 'AbpAccount.SettingManagement', title: '设置管理' }, component: () => import('@/views/settings/SettingsView.vue') },
    // Error pages
    { path: '/error/403', name: 'Error403', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 403 } },
    { path: '/error/404', name: 'Error404', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 404 } },
    { path: '/error/500', name: 'Error500', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 500 } },
    // Catch-all
    { path: '/:pathMatch(.*)*', redirect: '/error/404' },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
registerAuthGuard(router);
registerPermissionGuard(router);
// 动态页面标题
router.afterEach((to) => {
    document.title = (to.meta.title || 'ABP Vue') + ' | ABP';
});
export default router;
