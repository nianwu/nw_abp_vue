# ABP Angular 预设包功能参考

> 基于 ABP Framework 10.4.1 / Angular 21.2 / LeptonX Lite 5.4.1
> 为 Vue 前端开发提供 ABP 预设功能的完整对照参考

---

## 一、包总览

共 **13 个包**，分为四层：

```
@volo/ngx-lepton-x.lite          ← LPX 核心 UI 组件
@volo/ngx-lepton-x.core          ← LPX 基础设施（导航栏/面包屑/图标/响应式）
@volo/abp.ng.lepton-x.core       ← ABP ↔ LPX 桥接层
     ↓
ng.theme.lepton-x (5.4.1)        ← ABP 主题封装
ng.theme.shared (10.4.1)         ← Bootstrap/ng-bootstrap/FontAwesome 集成
ng.components (10.4.1)           ← 通用 UI 组件库（7 子模块）
     ↓
ng.account (10.4.1)              ← 账户页面（登录/注册/密码/个人资料）
ng.identity (10.4.1)             ← 用户/角色管理
ng.tenant-management (10.4.1)    ← 多租户管理
ng.setting-management (10.4.1)   ← 设置管理
ng.feature-management (10.4.1)   ← 功能开关管理
ng.permission-management (10.4.1)← 权限管理模态框
ng.account.core (10.4.1)         ← 账户模块的 Proxy/DTO 基类
     ↓
ng.oauth (10.4.1)                ← OAuth2/OIDC 认证流程
ng.core (10.4.1)                 ← 核心基础设施（DI/路由/本地化/权限/HTTP）
```

| # | 包 | 版本 | 作用 |
|---|-----|------|------|
| 1 | `@abp/ng.core` | 10.4.1 | 核心：认证、路由、本地化、权限、HTTP、状态管理 |
| 2 | `@abp/ng.oauth` | 10.4.1 | OAuth2/OIDC 授权码+密码流程、Token 管理 |
| 3 | `@abp/ng.account.core` | 10.4.1 | 账户模块 Proxy 服务、DTO、枚举 |
| 4 | `@abp/ng.account` | 10.4.1 | 登录/注册/忘记密码/重置密码/个人资料页面 |
| 5 | `@abp/ng.identity` | 10.4.1 | 用户 CRUD、角色 CRUD、权限分配 |
| 6 | `@abp/ng.tenant-management` | 10.4.1 | 多租户 CRUD、功能管理入口 |
| 7 | `@abp/ng.setting-management` | 10.4.1 | 设置标签页系统、邮件设置 |
| 8 | `@abp/ng.feature-management` | 10.4.1 | 功能开关管理模态框 |
| 9 | `@abp/ng.permission-management` | 10.4.1 | 权限管理模态框（标准/资源两种模式） |
| 10 | `@abp/ng.components` | 10.4.1 | 通用 UI：表格/表单/模态框/树/图表/页面布局 |
| 11 | `@abp/ng.theme.shared` | 10.4.1 | Bootstrap 5 + ng-bootstrap + FontAwesome + ngx-datatable |
| 12 | `@abp/ng.theme.lepton-x` | 5.4.1 | LeptonX Lite 主题（侧边菜单/账户布局/空布局） |
| 13 | `@abp/ng.schematics` | 10.4.1 | CLI 代码生成（devDependency） |

---

## 二、基础架构层

### 2.1 @abp/ng.core — 核心基础设施

#### 服务（33 个）

| 服务 | 职责 |
|------|------|
| `AuthService` | 认证核心：登录、登出、Token 获取、`isAuthenticated` |
| `ConfigStateService` | 应用配置中心存储（认证/设置/功能/本地化/多租户） |
| `SessionStateService` | 当前语言和租户状态 |
| `EnvironmentService` | 环境配置（API URL、OAuth 配置、issuer） |
| `RoutesService` | 动态导航菜单树，权限过滤，分组 |
| `RestService` | HTTP API 客户端：URL 解析、Header 附加、错误处理 |
| `PermissionService` | 权限策略检查 |
| `LocalizationService` | 获取本地化文本，管理语言资源，语言变更 Observable |
| `ListService` | 分页/排序/过滤列表数据获取（含 debounce） |
| `MultiTenancyService` | 租户切换（按名称/ID），域名租户检测 |
| `SubscriptionService` | RxJS 订阅生命周期管理 |
| `ContentProjectionService` | 动态组件/模板注入到 ViewContainerRef |
| `DomInsertionService` | 动态注入 script/style 元素到 DOM |
| `LazyLoadService` | 延迟加载脚本和样式（含重试） |
| `TrackByService` | Angular `trackBy` 函数工厂 |
| `InternetConnectionService` | 网络在线/离线信号 |
| `LocalStorageListenerService` | 跨标签页 localStorage 变更监听 |
| `HttpWaitService` | HTTP 请求加载状态追踪 |
| `RouterWaitService` | 路由导航加载状态追踪 |
| `HttpErrorReporterService` | HTTP 错误收集和暴露 |
| `AuthErrorFilterService` | 认证错误过滤器注册和执行 |
| `HtmlEncodingService` | HTML 编解码 |
| `ExternalHttpClient` | 绕过 Angular 拦截器的替代 HttpClient |
| `AbpLocalStorageService` | SSR 安全的 localStorage 封装 |
| `AbpCookieStorageService` | SSR 安全的 Cookie 存储 |
| `AbpWindowService` | Window/Document/Navigator 访问封装 |
| `TimezoneService` | 时区检测和覆盖 |
| `TimeService` | 基于 Luxon 的日期/时间格式化，时区转换 |
| `AbpTitleStrategy` | 页面标题本地化 |
| `AbpTenantService` | 租户查询 API 调用 |
| `AbpApiDefinitionService` | API 描述模型获取 |
| `AbpApplicationConfigurationService` | 获取 `/api/abp/application-configuration` |
| `AbpApplicationLocalizationService` | 获取本地化数据 |
| `UILocalizationService` | 加载 UI 本地化 JSON 文件 |

#### 守卫（Standalone Functions 推荐使用）

| 守卫函数 | 用途 |
|----------|------|
| `authGuard` | 未登录 → 跳转登录页 |
| `asyncAuthGuard` | 异步认证检查 |
| `permissionGuard` | 检查路由 `requiredPolicy` 数据 |

#### HTTP 拦截器

| 拦截器 | 用途 |
|--------|------|
| `ApiInterceptor` | 附加 `Authorization`、`Accept-Language`、`X-Requested-With`、`X-TenantId`、`X-Culture` |
| `timezoneInterceptor` | 附加 `X-Timezone` |
| `transferStateInterceptor` | SSR 传输状态处理 |

#### 管道（12 个）

| 管道选择器 | 用途 |
|------------|------|
| `abpLocalization` | 同步本地化（支持插值） |
| `abpAsyncLocalization` | 异步本地化，返回 `Observable<string>` |
| `abpSort` | 数组排序 |
| `abpSafeHtml` | 信任 HTML，绕过 Angular 消毒 |
| `shortDateTime` | 短日期+时间格式化 |
| `shortTime` | 短时间格式化 |
| `shortDate` | 短日期格式化 |
| `toInjector` | 从值创建 Injector |
| `abpUtcToLocal` | UTC → 本地时间转换 |
| `htmlEncode` | HTML 编码 |
| `abpRouteCultureUrl` | 给路径添加语言段前缀 |

#### 指令（10 个）

| 指令选择器 | 用途 |
|------------|------|
| `[autofocus]` | 自动聚焦（可选延迟） |
| `[input.debounce]` | 输入事件去抖 |
| `[abpFor]` | 增强版 `*ngFor`（排序/过滤/空模板） |
| `[abpInit]` | 元素初始化时触发 |
| `[abpPermission]` | 基于权限显示/隐藏元素 |
| `[abpReplaceableTemplate]` | 运行时组件替换 |
| `[click.stop]` | 阻止点击事件冒泡 |
| `[abpShowPassword]` | 切换密码字段可见性 |
| `[abpCapsLock]` | 发出大写锁定状态变化 |

#### 组件（4 个）

| 组件选择器 | 用途 |
|------------|------|
| `abp-dynamic-layout` | 根据路由数据中的 `eLayoutType` 渲染对应布局 |
| `abp-replaceable-route-container` | 路由级可替换组件容器 |
| `abp-router-outlet` | 简单路由出口封装 |

#### Provider 函数

| Provider | 用途 |
|----------|------|
| `provideAbpCore(...features)` | 主 Provider（替代 `CoreModule.forRoot`） |
| `provideAbpCoreChild(options?)` | 子模块 Provider |
| `withOptions(options)` | 核心配置 Feature |
| `withTitleStrategy(strategy)` | 自定义标题策略 Feature |
| `withCompareFuncFactory(factory)` | 自定义排序比较函数 Feature |

#### DTO 基类（20+）

`EntityDto<TKey>`、`PagedResultDto<T>`、`ListResultDto<T>`、`ExtensibleObject`、`CreationAuditedEntityDto`、`AuditedEntityDto`、`FullAuditedEntityDto` 及其 Extensible 变体

#### 自定义验证器

`AbpValidators` — `creditCard`、`emailAddress`、`minAge`、`range`、`required`、`stringLength`、`url`、`username`、`uniqueCharacter`

#### 枚举和常量

| 项目 | 值 |
|------|-----|
| `eLayoutType` | `account`、`application`、`empty` |
| `eThemeSharedComponents` | 主题可替换组件枚举 |
| `TenantUserSharingStrategy` | 租户用户共享策略 |

#### Locale 子入口 (`@abp/ng.core/locale`)

`registerLocale()`、`registerLocaleForEsBuild()`、`safeRegisterLocale()`、`storeLocaleData()`

#### Testing 子入口 (`@abp/ng.core/testing`)

`CoreTestingModule`（含 `withConfig()`）、`MockPermissionService`、`MockRestService`、`LocalizationPipe`(mock)

---

### 2.2 @abp/ng.oauth — OAuth2/OIDC 认证

#### 服务

| 服务 | 职责 |
|------|------|
| `AbpOAuthService` | 主 OAuth 服务：登录、登出、Token 刷新、`loginUsingGrant` |
| `OAuthErrorFilterService` | OAuth 特定错误事件处理 |
| `RememberMeService` | "记住我" 状态持久化，从 JWT 提取 |
| `OAuthConfigurationHandler` | 监听环境变化，配置 `OAuthService` |

#### Token 存储策略（3 种）

| 策略 | 适用场景 |
|------|----------|
| `BrowserTokenStorageService` | 浏览器端：Cookie + localStorage |
| `ServerTokenStorageService` | SSR：从请求 Cookie 读取 |
| `MemoryTokenStorageService` | SharedWorker 内存存储（避免 Cookie/localStorage 访问） |

#### 认证流程

| 流程 | `isInternalAuth` | 说明 |
|------|------------------|------|
| `AuthCodeFlowStrategy` | `false` | OIDC 授权码 + PKCE，处理重定向、静默刷新 |
| `AuthPasswordFlowStrategy` | `true` | 资源所有者密码凭证，定时器刷新 Token |

#### 守卫

| 守卫 | 用途 |
|------|------|
| `abpOAuthGuard` | 未认证 → OAuth 登录跳转 |
| `asyncAbpOAuthGuard` | 异步变体 |

#### 拦截器

| 拦截器 | 用途 |
|--------|------|
| `OAuthApiInterceptor` | 附加 `Bearer` Token + 租户 Header |

#### Provider

| Provider | 用途 |
|----------|------|
| `provideAbpOAuth()` | OAuth 模块 Provider |

#### 工具函数

| 函数 | 用途 |
|------|------|
| `pipeToLogin` | 将 Observable 链重定向到登录 |
| `isTokenExpired(expireDate)` | 检查 Token 是否过期 |
| `clearOAuthStorage(injector)` | 清除所有 OAuth 存储 |
| `checkAccessToken` | 验证当前 Access Token，必要时重定向 |

---

## 三、业务模块层

### 3.1 @abp/ng.account.core — 账户 Proxy/DTO

#### Proxy 服务

| 服务 | API 方法 |
|------|----------|
| `AccountService` | `register(RegisterDto)` → `IdentityUserDto`、`sendPasswordResetCode(SendPasswordResetCodeDto)`、`resetPassword(ResetPasswordDto)` |
| `AccountService$1` (登录) | `checkPasswordByLogin(UserLoginInfo)` → `AbpLoginResult`、`loginByLogin(UserLoginInfo)` → `AbpLoginResult`、`logout()` |
| `ProfileService` | `get()` → `ProfileDto`、`update(UpdateProfileDto)` → `ProfileDto`、`changePassword(ChangePasswordInput)` |

#### 枚举

| 枚举 | 值 |
|------|-----|
| `LoginResultType` | `Success(1)`, `InvalidUserNameOrPassword(2)`, `NotAllowed(3)`, `LockedOut(4)`, `RequiresTwoFactor(5)` |

---

### 3.2 @abp/ng.account — 账户页面

#### 路由

| 路径 | 页面 |
|------|------|
| `/account/login` | 登录 |
| `/account/register` | 注册 |
| `/account/forgot-password` | 忘记密码 |
| `/account/reset-password` | 重置密码 |
| `/account/manage-profile` | 个人资料管理 |

#### 组件（8 个）

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-login` | `LoginComponent` | 用户名/密码登录表单 + 自注册链接 |
| `abp-register` | `RegisterComponent` | 注册表单 |
| `abp-forgot-password` | `ForgotPasswordComponent` | 邮箱输入，发送重置码 |
| `abp-reset-password` | `ResetPasswordComponent` | Token 验证 + 新密码设置 |
| `abp-manage-profile` | `ManageProfileComponent` | "修改密码" + "个人设置" 标签页 |
| `abp-change-password-form` | `ChangePasswordComponent` | 当前密码/新密码/确认密码 |
| `abp-personal-settings-form` | `PersonalSettingsComponent` | 编辑用户名/邮箱/姓名/电话 |
| `abp-personal-settings-half-row` | `PersonalSettingsHalfRowComponent` | PersonalSettings 的半宽布局辅助 |

#### 可替换组件键

`eAccountComponents` — `Login`、`Register`、`ForgotPassword`、`ResetPassword`、`ManageProfile`、`TenantBox`、`AuthWrapper`、`ChangePassword`、`PersonalSettings`

---

### 3.3 @abp/ng.identity — 用户/角色管理

#### 路由

| 路径 | 权限策略 | 页面 |
|------|----------|------|
| `/identity/roles` | `AbpIdentity.Roles` | 角色管理 |
| `/identity/users` | `AbpIdentity.Users` | 用户管理 |

#### 组件

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-roles` | `RolesComponent` | 角色分页列表 + 创建/编辑模态框 + 删除确认 + 权限管理入口 |
| `abp-users` | `UsersComponent` | 用户分页列表 + 创建/编辑模态框（含角色分配标签页）+ 删除确认 + 权限管理入口 |

#### 代理服务

| 服务 | 方法 |
|------|------|
| `IdentityRoleService` | `create`、`delete`、`get`、`getAllList`、`getList`、`update` |
| `IdentityUserService` | `create`、`delete`、`findByEmail`、`findByUsername`、`get`、`getAssignableRoles`、`getList`、`getRoles`、`update`、`updateRoles` |
| `IdentityUserLookupService` | `findById`、`findByUserName`、`getCount`、`search` |

#### 可扩展性注入令牌（6 个）

| 令牌 | 用途 |
|------|------|
| `IDENTITY_ENTITY_ACTION_CONTRIBUTORS` | 行级操作按钮（如自定义"导出"按钮） |
| `IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS` | 工具栏操作按钮 |
| `IDENTITY_ENTITY_PROP_CONTRIBUTORS` | 表格列扩展（如添加"部门"列） |
| `IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS` | 创建表单字段扩展 |
| `IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS` | 编辑表单字段扩展 |

#### 可替换组件键

`eIdentityComponents.Roles` = `"Identity.RolesComponent"`
`eIdentityComponents.Users` = `"Identity.UsersComponent"`

---

### 3.4 @abp/ng.tenant-management — 多租户管理

#### 路由

| 路径 | 权限策略 | 页面 |
|------|----------|------|
| `/tenant-management/tenants` | `AbpTenantManagement.Tenants` | 租户管理 |

#### 组件

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-tenants` | `TenantsComponent` | 租户分页列表 + 创建（名称/管理员邮箱/管理员密码）+ 编辑 + 删除 + 功能管理入口 |

#### 代理服务

| 服务 | 方法 |
|------|------|
| `TenantService` | `create`、`delete`、`deleteDefaultConnectionString`、`get`、`getDefaultConnectionString`、`getList`、`update`、`updateDefaultConnectionString` |

#### 可扩展性注入令牌（5 个）

| 令牌 | 用途 |
|------|------|
| `TENANT_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS` | 行级操作按钮 |
| `TENANT_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS` | 工具栏操作按钮 |
| `TENANT_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS` | 表格列扩展 |
| `TENANT_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS` | 创建表单字段扩展 |
| `TENANT_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS` | 编辑表单字段扩展 |

---

### 3.5 @abp/ng.setting-management — 设置管理

#### 路由

| 路径 | 权限策略 | 页面 |
|------|----------|------|
| `/setting-management` | `AbpAccount.SettingManagement` | 设置管理 |

#### 组件

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-setting-management` | `SettingManagementComponent` | 标签页式设置面板，动态渲染注册的标签页组件 |

#### 已注册设置标签页

| 标签页 | 组件 | 权限策略 |
|--------|------|----------|
| 邮件设置 (`Emailing`) | `EmailSettingGroupComponent` | `SettingManagement.Emailing` |
| 功能管理 (`FeatureManagement`) | `FeatureManagementTabComponent` | `FeatureManagement.ManageHostFeatures` |

#### 邮件设置功能

- SMTP 配置：host、port、username、password、domain、enableSsl、useDefaultCredentials
- 发件人地址/显示名称
- 发送测试邮件（收件人/主题/正文）

#### 核心服务

| 服务 | 职责 |
|------|------|
| `SettingTabsService` | 管理设置标签页注册（继承 `AbstractNavTreeService`），支持 `visible$` 过滤 |
| `EmailSettingsService` | `get`、`sendTestEmail`、`update` |
| `TimeZoneSettingsService` | `get`、`getTimezones`、`update` |

#### 可见性控制

- `SETTING_MANAGEMENT_FEATURES` — 功能开关 `SettingManagement.Enable` 控制
- `SETTING_MANAGEMENT_HAS_SETTING` — 至少一个可见标签页时显示

---

### 3.6 @abp/ng.feature-management — 功能开关管理

> 无独立路由，以**模态框**形式嵌入设置管理或租户管理页面

#### 组件

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-feature-management` | `FeatureManagementComponent` | 功能开关模态框，按组展示功能，支持 3 种值类型 |
| `abp-feature-management-tab` | `FeatureManagementTabComponent` | 设置页中的包装组件，点击打开功能模态框 |

#### 功能值类型（3 种渲染）

| 类型 | UI 渲染 | 说明 |
|------|---------|------|
| `ToggleStringValueType` | 复选框（Switch） | 布尔值开关 |
| `FreeTextStringValueType` | 文本/数字输入 | 自由文本（含 `numeric` 验证器自动切换为 number input） |
| `SelectionStringValueType` | 下拉选择 | 预定义选项列表 |

#### 级联逻辑

- 父子功能层级依赖（`parentName` 字段）
- 子功能缩进显示（`depth * 20px`）
- 父功能取消时自动取消所有子功能
- 不同 Provider 设置的功能显示 `(providerName)` 标注

#### 代理服务

| 服务 | 方法 |
|------|------|
| `FeaturesService` | `get(providerName, providerKey)`、`update(providerName, providerKey, features)`、`delete(providerName, providerKey)` |

#### 指令

| 选择器 | 用途 |
|--------|------|
| `input[abpFeatureManagementFreeText]` | 根据验证器类型自动设置 input type (`number`/`text`) |

---

### 3.7 @abp/ng.permission-management — 权限管理

> 无独立路由，以**模态框**形式嵌入身份管理用户/角色页面

#### 组件（6 个）

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-permission-management` | `PermissionManagementComponent` | 标准权限模态框，按组展示权限列表，含"全选"和级联选择 |
| `abp-resource-permission-management` | `ResourcePermissionManagementComponent` | 基于资源的权限管理（较新变体），支持 list/add/edit 三种视图 |
| `abp-provider-key-search` | `ProviderKeySearchComponent` | Provider 键搜索/自动补全 |
| `abp-permission-checkbox-list` | `PermissionCheckboxListComponent` | 权限项复选框列表 |
| `abp-resource-permission-list` | `ResourcePermissionListComponent` | 资源权限列表视图 |
| `abp-resource-permission-form` | `ResourcePermissionFormComponent` | 资源权限添加/编辑表单 |

#### 标准权限管理功能

- 按权限组标签页展示
- "全选当前标签页" / "全选所有标签页"
- 父子权限级联选择
- 授权来源徽章（`hideBadges` 控制）
- 仅发送变更的权限（优化网络请求）

#### 资源权限管理模式（3 种视图）

| 模式 | 说明 |
|------|------|
| `eResourcePermissionViewModes.List` | 查看所有资源权限授予 |
| `eResourcePermissionViewModes.Add` | 添加新资源权限（选择 Provider + 权限） |
| `eResourcePermissionViewModes.Edit` | 编辑现有资源权限 |

#### 代理服务

| 服务 | 方法 |
|------|------|
| `PermissionsService` | `get`、`getByGroup`、`update`、`getResource`、`getResourceDefinitions`、`getResourceByProvider`、`getResourceProviderKeyLookupServices`、`searchResourceProviderKey`、`updateResource`、`deleteResource` |

---

## 四、UI 组件层

### 4.1 @abp/ng.components — 通用 UI 组件库

> 7 个子模块入口：主入口、`/chart.js`、`/dynamic-form`、`/extensible`、`/lookup`、`/page`、`/tree`

#### 4.1.1 主入口 — 基础 UI 组件（20 个组件）

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-button` | `ButtonComponent` | 按钮：加载态、图标、属性绑定、内容投影 |
| `abp-modal` | `ModalComponent` | 模态框：脏检查、加载态、页眉/正文/页脚/提交投影 |
| `abp-confirmation` | `ConfirmationComponent` | 全局确认对话框（info/success/warning/error） |
| `abp-toast` | `ToastComponent` | 单条 Toast 通知 |
| `abp-toast-container` | `ToastContainerComponent` | Toast 容器区域 |
| `abp-breadcrumb` | `BreadcrumbComponent` | 路由器驱动的面包屑 |
| `abp-breadcrumb-items` | `BreadcrumbItemsComponent` | 手动面包屑项 |
| `abp-loader-bar` | `LoaderBarComponent` | 顶部加载进度条 |
| `abp-loading` | `LoadingComponent` | 旋转加载指示器 |
| `abp-card` | `CardComponent` | Bootstrap 卡片封装 |
| `abp-card-body` | `CardBodyComponent` | 卡片正文 |
| `abp-card-header` | `CardHeaderComponent` | 卡片头部 |
| `abp-card-footer` | `CardFooterComponent` | 卡片底部 |
| `abp-form-input` | `FormInputComponent` | 封装表单输入（标签+输入框） |
| `abp-checkbox` | `FormCheckboxComponent` | 封装表单复选框 |
| `abp-spinner` | `SpinnerComponent` | 基本加载旋转器 |
| `abp-http-error-wrapper` | `HttpErrorWrapperComponent` | 全屏错误页（401/403/404/500） |
| `abp-internet-status` | `InternetConnectionStatusComponent` | 在线/离线指示器 |
| `abp-page-alert-container` | `PageAlertContainerComponent` | 页面级警报容器 |

**内容投影指令（ThemeShared 提供）**

| 选择器 | 用途 |
|--------|------|
| `abp-card-title` / `[abpCardTitle]` | 卡片标题样式 |
| `abp-card-subtitle` / `[abpCardSubtitle]` | 卡片副标题样式 |
| `abp-card-img-top` / `[abpCardImgTop]` | 卡片顶部图片 |
| `[abpClose]` | 关闭模态框 |
| `[abpEllipsis]` | 文本溢出省略号 |
| `[abpLoading]` | 条件加载覆盖层 |
| `[abpVisible]` | 条件 DOM 可见性 |
| `[abpDisabled]` | 条件禁用控件 |
| `ngx-datatable[default]` | 默认 ngx-datatable 样式 |
| `ngx-datatable[list]` | 将 ngx-datatable 连接到 `ListService` |

**服务**

| 服务 | 职责 |
|------|------|
| `ConfirmationService` | `info()`、`success()`、`warn()`、`error()` 确认对话框 |
| `ToasterService` | `info()`、`success()`、`warn()`、`error()` Toast 通知 |
| `NavItemsService` | 导航栏项注册 |
| `UserMenuService` | 用户菜单项管理 |
| `PageAlertService` | 页面级警报 |
| `ModalRefService` | 模态框引用注册/关闭 |
| `ErrorHandler` | 路由和 HTTP 错误监听 |
| `StatusCodeErrorHandlerService` | 401/403/404/500 状态码处理 |
| `DocumentDirHandlerService` | 语言方向（LTR/RTL）处理 |
| `DateTimeAdapter` / `DateAdapter` / `TimeAdapter` | ng-bootstrap 日期/时间适配器 |
| `DatepickerI18nAdapter` / `TimepickerI18nAdapter` | 日期/时间选择器国际化 |

**动画（20 个预设）**

`bounceIn`, `collapse`, `collapseX`, `collapseY`, `fadeIn`, `fadeOut`, `fadeInDown`, `fadeInUp`, `fadeInLeft`, `fadeInRight`, `slideFromBottom`, `toastInOut`, `dialogAnimation` 等

**常量**

`DEFAULT_VALIDATION_BLUEPRINTS`、`DEFAULT_ERROR_MESSAGES`、`DEFAULT_CONFIRMATION_ICONS`、`HTTP_ERROR_STATUS`、`HTTP_ERROR_DETAIL`

**注入令牌**

`CONFIRMATION_ICONS`、`HTTP_ERROR_CONFIG`、`CUSTOM_ERROR_HANDLERS`、`NGX_DATATABLE_MESSAGES`、`SUPPRESS_UNSAVED_CHANGES_WARNING`、`LOGO_URL_TOKEN`、`LOGO_APP_NAME_TOKEN`

#### 4.1.2 `/dynamic-form` — 动态表单

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-dynamic-form` | `DynamicFormComponent` | 基于配置数组的完整动态表单生成器 |
| `abp-dynamic-form-field` | `DynamicFormFieldComponent` | 单字段渲染（支持 20+ 字段类型） |
| `abp-dynamic-form-field-host` | `DynamicFieldHostComponent` | 自定义 CVA 组件宿主 |
| `abp-dynamic-form-group` | `DynamicFormGroupComponent` | 嵌套表单组 |
| `abp-dynamic-form-array` | `DynamicFormArrayComponent` | 可重复表单数组（添加/删除项） |

核心类型 `FormFieldConfig` 支持：18 种字段类型、条件显示规则、验证器、网格布局、远程数据源、子字段

#### 4.1.3 `/extensible` — 可扩展表格/表单

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-extensible-table` | `ExtensibleTableComponent` | ngx-datatable 封装：操作列、多选、无限滚动、行详情 |
| `abp-extensible-form` | `ExtensibleFormComponent` | 基于 FormProp 配置的自动表单生成 |
| `abp-extensible-form-prop` | `ExtensibleFormPropComponent` | 单个可扩展表单属性渲染器 |
| `abp-extensible-date-time-picker` | `ExtensibleDateTimePickerComponent` | 表单属性日期时间选择器 |
| `abp-extensible-form-multi-select` | `ExtensibleFormMultiselectComponent` | 多选表单控件 |
| `abp-grid-actions` | `GridActionsComponent` | 行操作按钮（编辑/删除） |
| `abp-page-toolbar` | `PageToolbarComponent` | 页面工具栏操作（创建/导入等） |

核心服务 `ExtensionsService` 管理 5 大可扩展系统：
1. `entityActions` — 表格行级操作
2. `toolbarActions` — 页面工具栏操作
3. `entityProps` — 表格列定义
4. `createFormProps` — 创建表单字段
5. `editFormProps` — 编辑表单字段

#### 4.1.4 `/lookup` — 查找搜索

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-lookup-search` | `LookupSearchComponent` | 异步查找搜索：去抖输入、下拉列表、自定义模板 |

#### 4.1.5 `/page` — 页面布局

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-page` | `PageComponent` | 基础页面布局：标题 + 面包屑 + 工具栏 + 内容投影 |
| `abp-page-title-container` | `PageTitleContainerComponent` | 页面标题投影 |
| `abp-page-breadcrumb-container` | `PageBreadcrumbContainerComponent` | 页面面包屑投影 |
| `abp-page-toolbar-container` | `PageToolbarContainerComponent` | 页面工具栏投影 |

指令 `[abpPagePart]` — 页面部分条件渲染

#### 4.1.6 `/tree` — 树形控件

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-tree` | `TreeComponent` | 基于 ng-zorro-antd/tree：可拖拽、可勾选、右键菜单、自定义节点模板 |

工具类：`TreeNode<T>`、`TreeAdapter<T>`（构建/操作树数据）

#### 4.1.7 `/chart.js` — 图表

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-chart` | `ChartComponent` | Chart.js 封装：支持所有图表类型、点击事件、base64 导出 |

---

### 4.2 @abp/ng.theme.shared — 第三方库集成

此包主要是 `@abp/ng.components` 的再出口 + 第三库集成配置，核心职责：

| 集成 | 说明 |
|------|------|
| Bootstrap 5 | CSS 框架（通过 `bootstrap ^5`） |
| ng-bootstrap 20.x | Bootstrap 组件 Angular 封装（模态框/日期选择器/时间选择器） |
| FontAwesome 6 | 图标库 |
| ngx-datatable 22.x | 数据表格组件 |
| ngx-validate 0.2.x | 表单验证框架 |
| @popperjs/core 2.11.x | 弹出层定位 |

**Provider 函数**

| 函数 | 用途 |
|------|------|
| `provideAbpThemeShared(...features)` | 主题共享 Provider |
| `provideLogo(...features)` | Logo 配置 |
| `withHttpErrorConfig(config)` | HTTP 错误处理配置 Feature |
| `withValidationBluePrint(blueprints)` | 验证错误消息蓝图 Feature |
| `withValidationMapErrorsFn(fn)` | 自定义错误映射函数 Feature |
| `withValidateOnSubmit(boolean)` | 提交时验证控制 Feature |
| `withConfirmationIcon(options)` | 自定义确认图标 Feature |

---

### 4.3 @abp/ng.theme.lepton-x — LeptonX 主题

> 封装 `@volo/ngx-lepton-x.lite` + `@volo/abp.ng.lepton-x.core`，为 ABP 提供开箱即用的主题

#### 布局

| 选择器 | 布局 | 说明 |
|--------|------|------|
| `abp-application-layout` | `SideMenuApplicationLayoutComponent` | 侧边菜单布局：导航栏 + 工具栏 + 面包屑 + 页脚 + 用户菜单 + 语言选择 |
| `abp-layout-empty` | `EmptyLayoutComponent` | 空布局（仅路由出口） |
| `abp-account-layout` | `AccountLayoutComponent` | 账户页面布局：租户切换 + 认证包装器 |

#### 主题组件

| 选择器 | 组件 | 功能 |
|--------|------|------|
| `abp-nav-items` | `NavItemsComponent` | 工具栏导航项 |
| `abp-language-selection` | `LanguageSelectionComponent` | 语言切换下拉菜单 |
| `abp-user-profile` | `UserProfileComponent` | 用户资料下拉菜单 |
| `abp-navigate-to-login` | `NavigateToLoginComponent` | 登录按钮/链接 |
| `lpx-tenant-box` | `TenantBoxComponent` | 租户切换器（账户布局专用） |
| `lpx-auth-wrapper` | `AuthWrapperComponent` | 认证页面包装器（显示应用名称） |
| `abp-validation-error` | `ValidationErrorComponent` | 验证错误显示（覆盖 ngx-validate） |
| `abp-page-alert-container` | `PageAlertContainerComponent` | 页面警报容器 |

#### 可替换组件键（21 个）

`eThemeLeptonXComponents` 包含：`ApplicationLayout`、`AccountLayout`、`Footer`、`EmptyLayout`、`Logo`、`Routes`、`NavItems`、`CurrentUser`、`CurrentUserImage`、`Languages`、`Navbar`、`Sidebar`、`Login`、`Breadcrumb`、`MobileNavbar`、`MobileUserProfile`、`MobileLanguageSelection`、`PageAlertContainer`、`Toolbar`、`Settings`

#### 底层包结构

| 底层包 | 核心组件 | 功能 |
|--------|----------|------|
| `@volo/ngx-lepton-x.lite` | `SideMenuLayoutComponent`、`MobileNavbarComponent`、`ToolbarContainerComponent` | LPX Lite 核心布局外壳和移动端适配 |
| `@volo/ngx-lepton-x.core` | `NavbarComponent`、`BreadcrumbComponent`、`IconComponent`、`AvatarComponent`、`FooterComponent`、`BrandLogoComponent` | LPX 基础设施组件和服务（导航/面包屑/图标/头像/响应式） |
| `@volo/abp.ng.lepton-x.core` | `PageAlertContainerComponent`、`AbpNavbarService`、`AbpToolbarService` | ABP ↔ LPX 桥接层（将 ABP 路由/服务连接到 LPX 组件） |

#### 布局内容投影插槽（18 个）

LeptonX 侧边菜单布局提供了 18 个自定义 `ng-template` 插槽：

`[lpx-logo-panel]`、`[lpx-navbar-panel]`、`[lpx-breadcrumb-panel]`、`[lpx-footer-panel]`、`[lpx-content]`、`[lpx-settings-panel]`、`[lpx-language-selection]`、`[lpx-topbar-content]`、`[lpx-user-profile]`、`[lpx-navitem-panel]`、`[lpx-mobile-navbar-panel]`、`[lpx-mn-user-profile-panel]`、`[lpx-mn-language-selection]`、`[lpx-current-user-panel]`、`[lpx-current-user-image-panel]`、`[lpx-mobile-navbar-settings-panel]`、`[lpx-mobile-navbar-profile-panel]`、`[lpx-toolbar-panel]`、`[lpx-top-navbar-panel]`

---

## 五、可扩展性系统

### 5.1 ExtensionsService（@abp/ng.components/extensible）

支持的 5 大扩展点：

| 扩展类型 | 注入令牌模式 | 作用 |
|----------|-------------|------|
| Entity Actions | `*_ENTITY_ACTION_CONTRIBUTORS` | 表格每行操作按钮（如编辑/删除/自定义） |
| Toolbar Actions | `*_TOOLBAR_ACTION_CONTRIBUTORS` | 页面工具栏操作按钮（如新建/导入） |
| Entity Props | `*_ENTITY_PROP_CONTRIBUTORS` | 表格列定义（如添加"创建时间"列） |
| Create Form Props | `*_CREATE_FORM_PROP_CONTRIBUTORS` | 创建表单字段扩展 |
| Edit Form Props | `*_EDIT_FORM_PROP_CONTRIBUTORS` | 编辑表单字段扩展 |

### 5.2 ReplaceableComponentsService（@abp/ng.core）

允许在运行时用自定义组件替换任何 ABP 预设组件：

```typescript
replaceableComponents.add({
  key: 'Identity.UsersComponent',  // 要替换的组件键
  component: MyCustomUsersComponent, // 替换为自定义组件
});
```

每个业务模块都通过枚举暴露其可替换组件键（见各模块 `e*Components` 枚举）。

### 5.3 自定义验证器扩展

通过 `withValidationBluePrint()` 和 `withValidationMapErrorsFn()` 可全局扩展表单验证规则和错误消息。

---

## 六、功能统计总表

| 包 | 组件 | 服务 | 指令 | 管道 | Provider 函数 | 可替换组件键 | 可扩展令牌 |
|----|------|------|------|------|--------------|-------------|-----------|
| ng.core | 4 | 33 | 10 | 12 | 3 | — | — |
| ng.oauth | — | 5 (含 3 存储) | — | — | 1 | — | — |
| ng.account.core | — | 3 (Proxy) | — | — | — | — | — |
| ng.account | 8 | 1 | — | — | 2 | 9 | 2 |
| ng.identity | 2 | 3 (Proxy) | — | — | 2 | 2 | 6 |
| ng.tenant-management | 1 | 1 (Proxy) | — | — | 2 | 1 | 5 |
| ng.setting-management | 1 | 3 (含 2 Proxy) | — | — | 2 | 1 | — |
| ng.feature-management | 2 | 1 (Proxy) | 1 | — | 2 | 1 | — |
| ng.permission-management | 6 | 1 (Proxy) | — | — | — | 2 | — |
| ng.components | 20+13+️ | 15+ | 13 | — | 2 | — | 10+ |
| ng.theme.shared | — | — | — | — | 2 | — | — |
| ng.theme.lepton-x | 8 | 3 | — | — | 4 | 21 | — |
| @volo/ngx-lepton-x.lite | 5 | — | 20 (投影) | — | 2 | — | — |
| @volo/ngx-lepton-x.core | 8 | 13 | 4 | 3 | 3 | — | — |
| @volo/abp.ng.lepton-x.core | 1 | 3 | 1 | — | 1 | — | — |

> `+` 号表示该包有多个子模块（`ng.components` 含 7 个子入口，每个提供额外的组件/指令）

---

## 七、Vue 实现对应参考

每个 ABP Angular 预设包在 Vue 中可替代的方案：

| ABP 包 | 核心功能 | Vue 对应方案 |
|--------|----------|-------------|
| ng.core | 认证/路由/本地化/权限/HTTP/状态 | Pinia + Vue Router + vue-i18n + 自定义 composables |
| ng.oauth | OIDC 授权码流程 | `openid-client`（服务端 BFF）/ `oidc-client-ts`（SPA） |
| ng.account | 登录/注册/密码/个人资料页面 | 自定义 Vue 页面组件 |
| ng.identity | 用户/角色管理 | 自定义 CRUD 页面 + 表格组件 |
| ng.tenant-management | 租户管理 | 自定义 CRUD 页面 |
| ng.setting-management | 设置标签页系统 | 自定义标签页 + 表单组件 |
| ng.feature-management | 功能开关模态框 | 自定义模态框 + 表单组件 |
| ng.permission-management | 权限管理模态框 | 自定义模态框 + 树形复选框 |
| ng.components | 通用 UI 组件库 | Vuetify / PrimeVue / Naive UI / 自定义 |
| ng.theme.shared | 第三方库集成 | 对应 Vue 生态库 |
| ng.theme.lepton-x | 主题布局 | 自定义 Layout 组件 + 插槽 |
