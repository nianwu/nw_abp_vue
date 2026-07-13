import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { User, Avatar, OfficeBuilding, Setting } from '@element-plus/icons-vue'
import { registerAuthGuard } from './guards/auth'
import { registerPermissionGuard } from '@/router/guards/permission'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'application' },
    component: () => import('@/views/home/HomeView.vue'),
  },
  // OIDC
  { path: '/oidc-callback', name: 'OidcCallback', component: () => import('@/views/account/OidcCallbackView.vue') },
  // Account (AccountLayout)
  { path: '/account/login', name: 'Login', meta: { layout: 'account' }, component: () => import('@/views/account/LoginView.vue') },
  { path: '/account/register', name: 'Register', meta: { layout: 'account' }, component: () => import('@/views/account/RegisterView.vue') },
  { path: '/account/forgot-password', name: 'ForgotPassword', meta: { layout: 'account' }, component: () => import('@/views/account/ForgotPasswordView.vue') },
  { path: '/account/reset-password', name: 'ResetPassword', meta: { layout: 'account' }, component: () => import('@/views/account/ResetPasswordView.vue') },
  { path: '/account/manage-profile', name: 'ManageProfile', meta: { layout: 'application', requiredPolicy: 'AbpAccount.AccountManagement' }, component: () => import('@/views/account/ManageProfileView.vue') },
  // Identity (ApplicationLayout)
  { path: '/identity/users', name: 'Users', meta: { layout: 'application', requiredPolicy: 'AbpIdentity.Users', title: '用户管理', icon: User }, component: () => import('@/views/identity/UsersView.vue') },
  { path: '/identity/roles', name: 'Roles', meta: { layout: 'application', requiredPolicy: 'AbpIdentity.Roles', title: '角色管理', icon: Avatar }, component: () => import('@/views/identity/RolesView.vue') },
  // Tenant (ApplicationLayout)
  { path: '/tenant-management/tenants', name: 'Tenants', meta: { layout: 'application', requiredPolicy: 'AbpTenantManagement.Tenants', title: '租户管理', icon: OfficeBuilding }, component: () => import('@/views/tenant/TenantsView.vue') },
  // Settings (ApplicationLayout)
  { path: '/setting-management', name: 'Settings', meta: { layout: 'application', requiredPolicy: 'AbpAccount.SettingManagement', title: '设置管理', icon: Setting }, component: () => import('@/views/settings/SettingsView.vue') },
  // Docs — 独立页面，无菜单、无需权限
  { path: '/docs/resource-permissions', name: 'ResourcePermissionDoc', meta: { layout: 'empty', title: '资源权限说明', public: true }, component: () => import('@/views/docs/ResourcePermissionDoc.vue') },
  { path: '/docs/resource-key', name: 'ResourceKeyDoc', meta: { layout: 'empty', title: '资源密钥说明', public: true }, component: () => import('@/views/docs/ResourceKeyDoc.vue') },
  { path: '/docs/tenant-management', name: 'TenantManagementDoc', meta: { layout: 'empty', title: '多租户管理说明', public: true }, component: () => import('@/views/docs/TenantManagementDoc.vue') },
  // Error pages
  { path: '/error/403', name: 'Error403', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 403 } },
  { path: '/error/404', name: 'Error404', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 404 } },
  { path: '/error/500', name: 'Error500', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 500 } },
  // Catch-all — 原地显示 404，不改变地址栏
  { path: '/:pathMatch(.*)*', name: 'NotFound', meta: { layout: 'empty' }, component: () => import('@/components/AbpErrorPage.vue'), props: { code: 404 } },
]

const routerMode: 'hash' | 'history' = (import.meta.env.VITE_ROUTER_MODE as 'hash' | 'history') || 'history'

const router = createRouter({
  history: routerMode === 'hash'
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
})

registerAuthGuard(router)
registerPermissionGuard(router)

// 动态页面标题
router.afterEach((to) => {
  document.title = ((to.meta.title as string) || 'ABP Vue') + ' | ABP'
})

export default router
