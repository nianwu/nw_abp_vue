# Swagger API 分析与 Vue 端实现映射

> 来源：`abp_demo` 后端 Swagger（`https://localhost:44356/swagger/v1/swagger.json`）
> 共 40 个 API 路径（55 个 HTTP 操作），分属 15 个 Tag

## 分析结论：需实现 38 个端点（8 个模块），5 个为基础设施由框架层自动处理

---

## 一、账户认证（Account / Login / Profile）— 12 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| POST | `/api/account/login` | Login | 登录 |
| GET | `/api/account/logout` | Login | 登出 |
| POST | `/api/account/check-password` | Login | 密码校验 |
| POST | `/api/account/register` | Account | 注册 |
| POST | `/api/account/reset-password` | Account | 重置密码 |
| POST | `/api/account/send-password-reset-code` | Account | 发送密码重置码 |
| POST | `/api/account/verify-password-reset-token` | Account | 验证重置 Token |
| POST | `/api/account/dynamic-claims/refresh` | DynamicClaims | 刷新动态声明 |
| GET | `/api/account/my-profile` | Profile | 获取个人资料 |
| PUT | `/api/account/my-profile` | Profile | 更新个人资料 |
| POST | `/api/account/my-profile/change-password` | Profile | 修改密码 |

---

## 二、用户管理（User / UserLookup）— 11 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| GET | `/api/identity/users` | User | 用户分页列表 |
| POST | `/api/identity/users` | User | 创建用户 |
| GET | `/api/identity/users/{id}` | User | 获取用户详情 |
| PUT | `/api/identity/users/{id}` | User | 更新用户 |
| DELETE | `/api/identity/users/{id}` | User | 删除用户 |
| GET | `/api/identity/users/{id}/roles` | User | 获取用户角色 |
| PUT | `/api/identity/users/{id}/roles` | User | 分配用户角色 |
| GET | `/api/identity/users/assignable-roles` | User | 可分配角色列表 |
| GET | `/api/identity/users/by-email/{email}` | User | 按邮箱查找 |
| GET | `/api/identity/users/by-username/{userName}` | User | 按用户名查找 |
| GET | `/api/identity/users/lookup/search` | UserLookup | 用户搜索（关联选择用） |

---

## 三、角色管理（Role）— 5 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| GET | `/api/identity/roles` | Role | 角色分页列表 |
| POST | `/api/identity/roles` | Role | 创建角色 |
| GET | `/api/identity/roles/{id}` | Role | 获取角色详情 |
| PUT | `/api/identity/roles/{id}` | Role | 更新角色 |
| DELETE | `/api/identity/roles/{id}` | Role | 删除角色 |
| GET | `/api/identity/roles/all` | Role | 全部角色（不分页） |

---

## 四、租户管理（Tenant）— 7 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| GET | `/api/multi-tenancy/tenants` | Tenant | 租户分页列表 |
| POST | `/api/multi-tenancy/tenants` | Tenant | 创建租户 |
| GET | `/api/multi-tenancy/tenants/{id}` | Tenant | 获取租户详情 |
| PUT | `/api/multi-tenancy/tenants/{id}` | Tenant | 更新租户 |
| DELETE | `/api/multi-tenancy/tenants/{id}` | Tenant | 删除租户 |
| GET | `/api/multi-tenancy/tenants/{id}/default-connection-string` | Tenant | 获取默认连接字符串 |
| PUT | `/api/multi-tenancy/tenants/{id}/default-connection-string` | Tenant | 更新默认连接字符串 |

---

## 五、权限管理（Permissions）— 8 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| GET | `/api/permission-management/permissions` | Permissions | 获取权限列表 |
| PUT | `/api/permission-management/permissions` | Permissions | 更新权限 |
| GET | `/api/permission-management/permissions/by-group` | Permissions | 按组获取权限 |
| GET | `/api/permission-management/permissions/resource` | Permissions | 获取资源权限 |
| PUT | `/api/permission-management/permissions/resource` | Permissions | 更新资源权限 |
| DELETE | `/api/permission-management/permissions/resource` | Permissions | 删除资源权限 |
| GET | `/api/permission-management/permissions/resource-definitions` | Permissions | 获取资源定义 |
| GET | `/api/permission-management/permissions/search-resource-provider-keys` | Permissions | 搜索 Provider Key |

---

## 六、功能管理（Features）— 4 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| GET | `/api/feature-management/features` | Features | 获取功能开关 |
| PUT | `/api/feature-management/features` | Features | 更新功能开关 |
| DELETE | `/api/feature-management/features` | Features | 删除功能设置 |

---

## 七、设置管理（EmailSettings / TimeZoneSettings）— 6 个端点 — ✅ 需实现

| 方法 | 路径 | Tag | 说明 |
|------|------|-----|------|
| GET | `/api/setting-management/emailing` | EmailSettings | 获取邮件设置 |
| POST | `/api/setting-management/emailing` | EmailSettings | 更新邮件设置 |
| POST | `/api/setting-management/emailing/send-test-email` | EmailSettings | 发送测试邮件 |
| GET | `/api/setting-management/timezone` | TimeZoneSettings | 获取时区设置 |
| POST | `/api/setting-management/timezone` | TimeZoneSettings | 更新时区设置 |
| GET | `/api/setting-management/timezone/timezones` | TimeZoneSettings | 获取时区列表 |

---

## 八、基础设施（5 个端点）— ❌ 无独立页面，框架层自动处理

> 以下端点由 Vue 框架层（应用初始化/HTTP 拦截器/路由守卫）自动调用，不需要单独的 UI 页面。

### 8.1 `GET /api/abp/application-configuration`

**功能**：返回运行时应用配置的聚合 JSON，是前端启动时必须的第一个 API 调用。返回内容包括：

- 当前用户信息（ID、用户名）
- 当前租户信息（ID、名称）
- 已授予的权限策略列表
- 支持的语言列表与当前语言
- 设置值（对当前用户生效）
- 时区与时钟信息
- 密码复杂度策略、锁定策略
- 功能开关状态（如 `LanguageManagement.Enable` 等）

**Vue 端策略**：应用初始化时最先调用，结果缓存到 Pinia store，驱动路由守卫、权限指令、语言切换、租户上下文。

### 8.2 `GET /api/abp/application-localization`

**功能**：返回服务端所有本地化文本的键值对 JSON。必填参数 `cultureName`（如 `en`、`zh-Hans`），可选 `onlyDynamics=true` 仅返回动态资源。返回结构为 `{ "resources": { "ResourceName": { "texts": {...}, "baseResources": [...] } } }`，含继承回退链。

**Vue 端策略**：根据当前语言按需调用，结果注入 `vue-i18n`。与 `application-configuration` 分离后可独立刷新语言包。

### 8.3 `GET /api/abp/api-definition`

**功能**：返回服务端所有 HTTP API 的完整元数据——路由、方法签名、DTO 结构。供代理生成工具（如 `abp generate-proxy -t ng`）消费，从后端 API 定义自动生成类型安全的客户端代理代码。

**Vue 端策略**：不需要调用。Vue 端手动编写 API 客户端，不使用 ABP 的自动代理生成。

### 8.4 `GET /api/abp/multi-tenancy/tenants/by-name/{name}`

**功能**：按租户名称查找租户。返回 `FindTenantResultDto`（`success` / `tenantId` / `name` / `isActive`）。核心用途是**域名/子域名租户解析**——从 URL 子域名提取租户名后调用此接口验证租户存在性。匿名可访问（登录前就需要确定租户上下文）。

**Vue 端策略**：在路由守卫中实现域名租户解析逻辑时调用。

### 8.5 `GET /api/abp/multi-tenancy/tenants/by-id/{id}`

**功能**：按租户 GUID ID 查找租户。返回结构与上者相同。用于通过租户 ID 直接解析租户信息。

**Vue 端策略**：按需调用（如租户切换后验证新租户 ID 的有效性）。

---

## 汇总

| 模块 | 端点数 | 状态 | 对应需求条目 |
|------|--------|------|-------------|
| 账户认证 (Login/Account/Profile) | 11 | ✅ 需实现 | 登录/注册/密码 |
| 用户管理 (User/Lookup) | 11 | ✅ 需实现 | 用户管理 |
| 角色管理 (Role) | 6 | ✅ 需实现 | 角色管理 |
| 租户管理 (Tenant) | 7 | ✅ 需实现 | 租户管理 |
| 权限管理 (Permissions) | 8 | ✅ 需实现 | 权限管理 |
| 功能管理 (Features) | 3 | ✅ 需实现 | 功能开关 |
| 设置管理 (Email/Timezone) | 6 | ✅ 需实现 | 设置管理 |
| 基础设施 | 5 | ❌ 框架层 | — |
| **合计** | **57** | **52 页面 / 5 框架** | — |

> 注：用户查找（UserLookup 4 个端点）和全部角色（all）为选择器/下拉控件提供数据，由对应管理页面内联调用。
