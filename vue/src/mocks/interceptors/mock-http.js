import { mockGetUsers, mockGetUser, mockCreateUser, mockUpdateUser, mockDeleteUser, mockGetUserRoles, mockGetRoles, mockGetAllRoles, mockGetRole, mockCreateRole, mockUpdateRole, mockDeleteRole, } from '@/mocks/data/identity';
import { mockGetTenants, mockGetTenant, mockCreateTenant, mockUpdateTenant, mockDeleteTenant, mockGetDefaultConnectionString, mockUpdateDefaultConnectionString, mockDeleteDefaultConnectionString, } from '@/mocks/data/tenant';
import { mockGetPermissions } from '@/mocks/data/permission';
import { mockGetFeatures } from '@/mocks/data/feature';
import { mockEmailSettings, mockTimezone, mockTimezones } from '@/mocks/data/settings';
import { mockLocalization } from '@/mocks/data/localization';
import { mockAppConfig } from '@/mocks/data/app-config';
/**
 * 模拟网络延时 — [0.1, 0.5) 秒之间的随机值
 */
function simulateDelay() {
    return new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 400))
}

/**
 * 注册 Mock 响应拦截器。
 * 对匹配 /api/ 前缀的请求，根据 method + URL 返回模拟数据。
 * 未匹配的请求放行走真实网络。
 */
export function registerMockInterceptor(httpClient) {
    const id = httpClient.interceptors.request.use((config) => {
        const { method, url = '' } = config;
        if (!url.startsWith('/api/'))
            return config;
        const mockResult = matchMock(method?.toUpperCase() || 'GET', url, config.params, config.data);
        if (mockResult !== undefined) {
            config.adapter = function () {
                return simulateDelay().then(() => ({
                    data: mockResult,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                }));
            };
        }
        return config;
    });
    return id;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchMock(method, url, params, data) {
    const urlWithoutQuery = url.split('?')[0];
    // ========================
    // Application Configuration / Localization
    // 正常路径由 main.ts 分流，此处作为 fallback 兜底
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/abp/application-localization') {
        return mockLocalization;
    }
    if (method === 'GET' && urlWithoutQuery === '/api/abp/application-configuration') {
        return mockAppConfig;
    }
    // ========================
    // Identity Users
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/identity/users') {
        return mockGetUsers({
            filter: params?.filter,
            sorting: params?.sorting,
            skipCount: params?.skipCount || params?.SkipCount,
            maxResultCount: params?.maxResultCount || params?.MaxResultCount,
        });
    }
    if (method === 'POST' && urlWithoutQuery === '/api/identity/users') {
        const userData = typeof data === 'string' ? JSON.parse(data) : data;
        return mockCreateUser(userData);
    }
    const userMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/([^/]+)$/);
    if (userMatch) {
        const id = userMatch[1];
        if (method === 'GET')
            return mockGetUser(id);
        if (method === 'PUT') {
            const updateData = typeof data === 'string' ? JSON.parse(data) : data;
            return mockUpdateUser(id, updateData);
        }
        if (method === 'DELETE') {
            mockDeleteUser(id);
            return {};
        }
    }
    const userRolesMatch = urlWithoutQuery.match(/^\/api\/identity\/users\/([^/]+)\/roles$/);
    if (userRolesMatch) {
        if (method === 'GET')
            return mockGetUserRoles(userRolesMatch[1]);
        if (method === 'PUT')
            return {};
    }
    // ========================
    // Identity Roles
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/identity/roles/all') {
        return mockGetAllRoles();
    }
    if (method === 'GET' && urlWithoutQuery === '/api/identity/roles') {
        return mockGetRoles({
            filter: params?.filter,
            skipCount: params?.skipCount || params?.SkipCount,
            maxResultCount: params?.maxResultCount || params?.MaxResultCount,
        });
    }
    if (method === 'POST' && urlWithoutQuery === '/api/identity/roles') {
        const roleData = typeof data === 'string' ? JSON.parse(data) : data;
        return mockCreateRole(roleData);
    }
    const roleMatch = urlWithoutQuery.match(/^\/api\/identity\/roles\/([^/]+)$/);
    if (roleMatch) {
        const id = roleMatch[1];
        if (method === 'GET')
            return mockGetRole(id);
        if (method === 'PUT') {
            const updateData = typeof data === 'string' ? JSON.parse(data) : data;
            return mockUpdateRole(id, updateData);
        }
        if (method === 'DELETE') {
            mockDeleteRole(id);
            return {};
        }
    }
    // ========================
    // Tenant Management
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/multi-tenancy/tenants') {
        return mockGetTenants({
            filter: params?.filter,
            skipCount: params?.skipCount || params?.SkipCount,
            maxResultCount: params?.maxResultCount || params?.MaxResultCount,
        });
    }
    if (method === 'POST' && urlWithoutQuery === '/api/multi-tenancy/tenants') {
        const tenantData = typeof data === 'string' ? JSON.parse(data) : data;
        return mockCreateTenant(tenantData);
    }
    const tenantMatch = urlWithoutQuery.match(/^\/api\/multi-tenancy\/tenants\/([^/]+)$/);
    if (tenantMatch) {
        const id = tenantMatch[1];
        if (method === 'GET')
            return mockGetTenant(id);
        if (method === 'PUT') {
            const updateData = typeof data === 'string' ? JSON.parse(data) : data;
            return mockUpdateTenant(id, updateData);
        }
        if (method === 'DELETE') {
            mockDeleteTenant(id);
            return {};
        }
    }
    const connStrMatch = urlWithoutQuery.match(/^\/api\/multi-tenancy\/tenants\/([^/]+)\/default-connection-string$/);
    if (connStrMatch) {
        const id = connStrMatch[1];
        if (method === 'GET')
            return mockGetDefaultConnectionString(id);
        if (method === 'PUT') {
            mockUpdateDefaultConnectionString(id, params?.defaultConnectionString || '');
            return {};
        }
        if (method === 'DELETE') {
            mockDeleteDefaultConnectionString(id);
            return {};
        }
    }
    // ========================
    // Permission Management
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/permission-management/permissions') {
        return mockGetPermissions();
    }
    if (method === 'PUT' && urlWithoutQuery === '/api/permission-management/permissions') {
        return {};
    }
    // 资源权限 — 返回空数据
    if (urlWithoutQuery.startsWith('/api/permission-management/permissions/')) {
        if (method === 'GET') return { permissions: [], providers: [], groups: [], keys: [] };
        if (method === 'PUT' || method === 'DELETE') return {};
    }
    // ========================
    // Feature Management
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/feature-management/features') {
        return mockGetFeatures();
    }
    if (method === 'PUT' && urlWithoutQuery === '/api/feature-management/features') {
        return {};
    }
    // ========================
    // Settings
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/setting-management/emailing') {
        return mockEmailSettings;
    }
    if (method === 'POST' && urlWithoutQuery === '/api/setting-management/emailing') {
        return {};
    }
    if (method === 'POST' && urlWithoutQuery === '/api/setting-management/emailing/send-test-email') {
        return {};
    }
    if (method === 'GET' && urlWithoutQuery === '/api/setting-management/timezone') {
        return mockTimezone;
    }
    if (method === 'POST' && urlWithoutQuery === '/api/setting-management/timezone') {
        return {};
    }
    if (method === 'GET' && urlWithoutQuery === '/api/setting-management/timezone/timezones') {
        return mockTimezones;
    }
    // ========================
    // Account
    // ========================
    if (method === 'GET' && urlWithoutQuery === '/api/account/my-profile') {
        return {
            userName: 'admin',
            email: 'admin@abp.io',
            name: 'Admin',
            surname: 'User',
            phoneNumber: '13800138000',
            hasPassword: true,
            isExternal: false,
            concurrencyStamp: 'cs-profile',
            extraProperties: {},
        };
    }
    return undefined;
}
