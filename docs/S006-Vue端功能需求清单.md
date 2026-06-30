# Vue 端功能需求清单

> **目的**：综合所有参考源，产出一份可直接用于 Vue 前端开发的完整功能需求清单。每个功能模块明确列出 API 端点、数据字段、Vue 实现策略。
>
> **参考文件**：
> - `S003-ABP功能三维度分类分析.md` — ABP 功能分类与扩展机制
> - `S004-Angular端功能需求清单.md` — 从 Angular demo 梳理的需求基线
> - `S005-Swagger-API分析与Vue端映射.md` — 后端 API 清单与映射分析
> - `swagger.json` — 后端 API 契约（`https://localhost:44356/swagger/v1/swagger.json`）
> - S001、S002 — ABP Angular 包功能参考

---

## 一、认证模块

### 1.0 OAuth2/OIDC 基础设施 — 优先使用开源项目

| 项 | 选择 |
|----|------|
| **推荐库** | `oidc-client-ts`（npm: `oidc-client-ts`）— OIDC 标准客户端，支持授权码 + PKCE |
| **备选** | `@autheur/vue3-oidc` — 对 `oidc-client-ts` 的 Vue 3 封装 |
| **功能覆盖** | Token 获取/刷新/存储、静默刷新、Session 监控、自动附加 `Authorization: Bearer` Header |

> 对接后端 OpenIddict 认证服务器，采用标准 OIDC 协议（授权码 + PKCE），由通用 OIDC 客户端库处理 Token 生命周期。

### 1.1 登录页面

| 项 | 内容 |
|----|------|
| **API** | `POST /api/account/login` |
| **路由** | `/account/login` |
| **功能** | 用户名 + 密码登录；租户切换器；"记住我"；自注册/忘记密码入口 |

| 字段 | 含义 |
|------|------|
| `userNameOrEmailAddress` | 用户名或邮箱 |
| `password` | 密码 |
| `rememberMe` | 是否记住登录（布尔） |
| `tenantName` | 租户名称（可选，多租户场景） |

### 1.2 注册页面

| 项 | 内容 |
|----|------|
| **API** | `POST /api/account/register` |
| **路由** | `/account/register` |

| 字段 | 含义 |
|------|------|
| `userName` | 用户名（唯一） |
| `emailAddress` | 邮箱地址 |
| `password` | 密码 |

### 1.3 忘记密码

| 项 | 内容 |
|----|------|
| **API** | `POST /api/account/send-password-reset-code` |
| **路由** | `/account/forgot-password` |

| 字段 | 含义 |
|------|------|
| `email` | 接收重置验证码的邮箱 |

### 1.4 重置密码

| 项 | 内容 |
|----|------|
| **API** | `POST /api/account/reset-password`、`POST /api/account/verify-password-reset-token` |
| **路由** | `/account/reset-password` |

| 字段 | 含义 |
|------|------|
| `token` | 邮箱收到的重置 Token |
| `newPassword` | 新密码 |

### 1.5 个人资料管理

| 项 | 内容 |
|----|------|
| **API** | `GET/PUT /api/account/my-profile`、`POST /api/account/my-profile/change-password` |
| **路由** | `/account/manage-profile` |

| 字段 | 含义 |
|------|------|
| `userName` | 用户名（只读） |
| `email` | 邮箱 |
| `name` | 姓名 |
| `surname` | 姓氏 |
| `phoneNumber` | 电话号码 |
| `currentPassword` | 当前密码（修改密码时） |
| `newPassword` | 新密码（修改密码时） |

---

## 二、用户管理

### 2.1 用户列表页

| 项 | 内容 |
|----|------|
| **API** | `GET /api/identity/users`（分页/排序/过滤） |
| **路由** | `/identity/users`，权限 `AbpIdentity.Users` |

#### 列表字段

| 字段 | 含义 |
|------|------|
| `id` | 用户 GUID |
| `userName` | 用户名（唯一） |
| `email` | 邮箱地址 |
| `name` | 姓名 |
| `surname` | 姓氏 |
| `phoneNumber` | 电话号码 |
| `emailConfirmed` | 邮箱是否已确认（布尔） |
| `isActive` | 是否启用（布尔） |
| `creationTime` | 创建时间 |

#### 功能
- 分页/排序/关键词搜索
- 工具栏：`+ 新建用户` 按钮
- 行操作：编辑、删除、权限管理
- 预留列表列扩展点（允许其他模块动态注册额外列）

### 2.2 创建/编辑用户（模态框）

| 项 | 内容 |
|----|------|
| **API** | `POST /api/identity/users`、`GET/PUT /api/identity/users/{id}` |
| **辅助 API** | `GET /api/identity/users/assignable-roles`（获取可分配角色列表） |

#### 表单字段

| 字段 | 含义 | 创建 | 编辑 |
|------|------|------|------|
| `userName` | 用户名（唯一） | ✅ | ✅ |
| `name` | 姓名 | ✅ | ✅ |
| `surname` | 姓氏 | ✅ | ✅ |
| `email` | 邮箱 | ✅ | ✅ |
| `phoneNumber` | 电话 | ✅ | ✅ |
| `password` | 密码 | ✅ | ❌ |
| `isActive` | 启用状态 | ✅ | ✅ |
| `lockoutEnabled` | 锁定策略启用 | ✅ | ✅ |
| `roleNames` | 已分配角色（标签页切换） | ❌ | ✅ |

> 预留表单字段扩展点（允许其他模块动态注册额外字段）。

### 2.3 删除用户

| API | `DELETE /api/identity/users/{id}` |

### 2.4 角色分配（编辑用户标签页）

| API | `GET/PUT /api/identity/users/{id}/roles` |

| 字段 | 含义 |
|------|------|
| `roleNames` | 分配给该用户的角色名称列表 |

### 2.5 用户查找

> 用于其他模块的关联选择控件（如分配 Owner）。

| API | 用途 |
|-----|------|
| `GET /api/identity/users/lookup/search` | 模糊搜索用户 |
| `GET /api/identity/users/by-email/{email}` | 按邮箱精确查找 |
| `GET /api/identity/users/by-username/{userName}` | 按用户名精确查找 |

---

## 三、角色管理

### 3.1 角色列表页

| 项 | 内容 |
|----|------|
| **API** | `GET /api/identity/roles`（分页）|
| **路由** | `/identity/roles`，权限 `AbpIdentity.Roles` |

#### 列表字段

| 字段 | 含义 |
|------|------|
| `id` | 角色 GUID |
| `name` | 角色名称（唯一） |
| `isDefault` | 是否新用户默认分配（布尔） |
| `isPublic` | 是否所有用户可见（布尔） |
| `isStatic` | 是否系统静态角色（布尔，不可删除） |

#### 功能
- 分页/排序/搜索
- 工具栏：`+ 新建角色`
- 行操作：编辑、删除、权限管理
- 辅助接口 `GET /api/identity/roles/all` 返回不分页全部角色（下拉选择用）

### 3.2 创建/编辑角色（模态框）

| API | `POST /api/identity/roles`、`GET/PUT /api/identity/roles/{id}` |

| 字段 | 含义 |
|------|------|
| `name` | 角色名称（唯一） |
| `isDefault` | 新用户注册时自动分配 |
| `isPublic` | 公开给其他用户使用 |

### 3.3 删除角色

| API | `DELETE /api/identity/roles/{id}` |

---

## 四、租户管理

### 4.1 租户列表页

| 项 | 内容 |
|----|------|
| **API** | `GET /api/multi-tenancy/tenants`（分页）|
| **路由** | `/tenant-management/tenants`，权限 `AbpTenantManagement.Tenants` |

#### 列表字段

| 字段 | 含义 |
|------|------|
| `id` | 租户 GUID |
| `name` | 租户名称（唯一） |
| `adminEmailAddress` | 管理员邮箱 |
| `creationTime` | 创建时间 |

#### 功能
- 分页/搜索
- 工具栏：`+ 新建租户`
- 行操作：编辑、删除、功能管理

### 4.2 创建/编辑租户（模态框）

| API | `POST /api/multi-tenancy/tenants`、`GET/PUT /api/multi-tenancy/tenants/{id}` |

| 字段 | 含义 | 创建 | 编辑 |
|------|------|------|------|
| `name` | 租户名称（唯一） | ✅ | ✅ |
| `adminEmailAddress` | 管理员邮箱 | ✅ | ✅ |
| `adminPassword` | 管理员初始密码 | ✅ | ❌ |

### 4.3 删除租户

| API | `DELETE /api/multi-tenancy/tenants/{id}` |

### 4.4 连接字符串管理

| API | `GET/PUT /api/multi-tenancy/tenants/{id}/default-connection-string` |

| 字段 | 含义 |
|------|------|
| `defaultConnectionString` | 该租户专用数据库连接字符串 |

---

## 五、权限管理（模态框）

> 无独立路由。嵌入用户/角色管理页，以模态框形式打开。

### 5.1 标准权限管理

| API | 用途 |
|-----|------|
| `GET /api/permission-management/permissions` | 获取某 Provider（User/Role）的全部权限 |
| `GET /api/permission-management/permissions/by-group` | 按分组获取权限 |
| `PUT /api/permission-management/permissions` | 更新权限分配（仅发送变更项） |

#### 数据结构

| 字段 | 含义 |
|------|------|
| `groups` | 权限组列表（如 `AbpIdentity`、`AbpTenantManagement`） |
| `permissions[].name` | 权限名称（策略标识） |
| `permissions[].displayName` | 权限显示名称 |
| `permissions[].isGranted` | 是否已授予（布尔） |
| `permissions[].parentName` | 父权限名称（级联依赖） |
| `permissions[].allowedProviders` | 授权来源列表 |

#### 功能
- 按分组标签页展示
- 全选当前组 / 全选所有组
- 父子权限级联选择（选子 → 自动选父；取消父 → 自动取消子）
- 显示授权来源徽章（`role`、`user` 等）
- 仅提交变更的权限（非全量覆盖）

### 5.2 资源权限管理

| API | 用途 |
|-----|------|
| `GET /api/permission-management/permissions/resource` | 获取资源权限列表 |
| `PUT /api/permission-management/permissions/resource` | 添加/更新资源权限 |
| `DELETE /api/permission-management/permissions/resource` | 删除资源权限 |
| `GET /api/permission-management/permissions/resource-definitions` | 获取可用资源定义 |
| `GET /api/permission-management/permissions/search-resource-provider-keys` | 搜索 Provider Key |

#### 三种视图
1. **List** — 查看所有资源权限授予
2. **Add** — 选择 Provider Key（含搜索自动补全）+ 选择权限
3. **Edit** — 修改已有资源权限

---

## 六、功能管理（模态框）

> 无独立路由。嵌入租户管理或设置页，以模态框形式打开。

| API | 用途 |
|-----|------|
| `GET /api/feature-management/features` | 获取某 Provider 的功能开关状态 |
| `PUT /api/feature-management/features` | 更新功能开关 |
| `DELETE /api/feature-management/features` | 重置为默认值 |

#### 数据结构

| 字段 | 含义 |
|------|------|
| `groups` | 功能组列表 |
| `features[].name` | 功能名称 |
| `features[].displayName` | 功能显示名称 |
| `features[].value` | 当前值 |
| `features[].valueType` | 值类型：`Toggle` / `FreeText` / `Selection` |
| `features[].parentName` | 父功能名称（级联） |
| `features[].providerName` | 设置来源 Provider 名称 |

#### 三种值类型 UI

| 值类型 | Vue 渲染 |
|--------|----------|
| `Toggle` | `<input type="checkbox">` / Switch 开关 |
| `FreeText` | `<input type="text">` / `<input type="number">`（含 `numeric` 验证器时自动切数字输入） |
| `Selection` | `<select>` 下拉选择，预定义选项列表 |

#### 级联逻辑
- 子功能缩进显示（`depth × 20px`）
- 取消父功能 → 自动取消所有子功能
- 显示标注 `(providerName)` 标识非默认来源的功能

---

## 七、设置管理

### 7.1 设置管理页面

| 路由 | `/setting-management`，权限 `AbpAccount.SettingManagement` |
|------|------|

- 标签页式面板（使用 Tab / Tabs 组件）
- 动态渲染已注册的设置标签页
- 支持可见性过滤（仅显示有权限/有设置项的标签页）

### 7.2 邮件设置

| API | 用途 |
|-----|------|
| `GET/POST /api/setting-management/emailing` | 获取/更新邮件设置 |
| `POST /api/setting-management/emailing/send-test-email` | 发送测试邮件 |

| 字段 | 含义 |
|------|------|
| `smtpHost` | SMTP 服务器地址 |
| `smtpPort` | SMTP 端口号 |
| `smtpUserName` | SMTP 用户名 |
| `smtpPassword` | SMTP 密码 |
| `smtpDomain` | SMTP 域名 |
| `smtpEnableSsl` | 启用 SSL（布尔） |
| `smtpUseDefaultCredentials` | 使用默认凭据（布尔） |
| `defaultFromAddress` | 默认发件人邮箱 |
| `defaultFromDisplayName` | 默认发件人显示名称 |

#### 测试邮件

| 字段 | 含义 |
|------|------|
| `targetEmail` | 收件人邮箱 |
| `subject` | 邮件主题 |
| `body` | 邮件正文（可选） |

### 7.3 时区设置

| API | 用途 |
|-----|------|
| `GET/POST /api/setting-management/timezone` | 获取/更新时区 |
| `GET /api/setting-management/timezone/timezones` | 获取可用时区列表 |

| 字段 | 含义 |
|------|------|
| `timezone` | 当前选择的时区（如 `Asia/Shanghai`） |
| `timezones[]` | 可用时区项列表 |

---

## 八、框架基础设施

### 8.1 应用初始化

| API | `GET /api/abp/application-configuration` |
|-----|------|

启动时最先调用，返回数据注入 Pinia store：

| 返回数据 | 用途 |
|----------|------|
| `localization.currentCulture` | 当前语言标识 |
| `auth.policies` | 当前用户权限策略列表 |
| `currentUser` | 用户 ID、用户名 |
| `currentTenant` | 租户 ID、名称 |
| `setting` | 全局设置值 |
| `timing.timeZone` | 时区信息 |
| `features.values` | 功能开关状态 |

### 8.2 本地化

| API | `GET /api/abp/application-localization?cultureName={lang}` |
|-----|------|

语言切换时按需加载词条，注入 `vue-i18n`。回退链：当前资源 → baseResources 递归查找。

### 8.3 多租户解析

| API | 用途 |
|-----|------|
| `GET /api/abp/multi-tenancy/tenants/by-name/{name}` | 域名/子域名租户解析 |
| `GET /api/abp/multi-tenancy/tenants/by-id/{id}` | 按 ID 验证租户 |

HTTP 拦截器自动注入 `__tenant: <tenantId>` Header。

### 8.4 HTTP 拦截器链

| 拦截器 | Header |
|--------|--------|
| 认证 | `Authorization: Bearer <token>` |
| 租户 | `__tenant: <tenantId>` |
| 语言 | `Accept-Language: <culture>` |
| 时区 | `X-Timezone: <timezone>` |

### 8.5 权限控制

| 方式 | 实现 |
|------|------|
| 路由守卫 | Vue Router `beforeEach`：检查 `meta.requiredPolicy` |
| 指令 | `v-permission="'PolicyName'"` |
| 函数 | `usePermission().check('PolicyName')` |

### 8.6 布局系统

| 布局 | 路由 meta 配置 | 用途 |
|------|---------------|------|
| 侧边菜单 | `layout: 'application'` | 管理后台主布局 |
| 账户布局 | `layout: 'account'` | 登录/注册等认证页 |
| 空布局 | `layout: 'empty'` | 纯路由出口 |

### 8.7 通用 UI 组件需求

| 组件 | 功能要求 |
|------|---------|
| 分页表格 | 分页/排序/搜索/列定义/行操作按钮/批量选择/无限滚动 |
| 模态框 | 脏检查/加载态/确认对话框/尺寸控制 |
| 动态表单 | 基于配置数组的表单生成器，≥18 种字段类型 |
| Toast | `info`/`success`/`warn`/`error` 四级别 |
| 面包屑 | 路由匹配 + 自定义项 |
| 加载条 | 顶部进度条（NProgress 或类似） |

---

## 九、汇总 & 优先级

| 优先级 | 模块 | 页面/组件数 | API 端点数 | 依赖 |
|--------|------|-----------|-----------|------|
| **P0** | 框架基础设施 | 拦截器/守卫/布局 | 5 | — |
| **P0** | OAuth2/OIDC（`oidc-client-ts`） | Token 管理 | 3 | 基础设施 |
| **P0** | 登录/注册/密码 | 5 页面 | 8 | OAuth |
| **P1** | 用户管理 | 列表 + 模态框 + 角色分配 | 11 | 基础设施 |
| **P1** | 角色管理 | 列表 + 模态框 | 6 | 基础设施 |
| **P2** | 租户管理 | 列表 + 模态框 + 连接字符串 | 7 | 基础设施 |
| **P2** | 权限管理（模态框） | 标准 + 资源两种模态框 | 8 | 用户/角色管理 |
| **P2** | 功能管理（模态框） | 功能开关模态框 | 3 | 租户/设置管理 |
| **P3** | 设置管理 | 标签页 + 邮件 + 时区 | 6 | 基础设施 |

> 建议实现顺序：基础设施 → OAuth 认证 → 用户+角色管理 → 租户管理 → 权限+功能管理 → 设置管理。

---

## 十、产品级补充需求

> 从产品经理视角对 S006 进行头脑风暴，补充全局 UX、跨模块交互、异常与边界场景等遗漏项。

### 10.1 全局用户体验

#### 空状态

| 场景 | 行为 |
|------|------|
| 列表无数据 | 显示插图和文案（如"暂无用户，点击创建第一个用户"），附带创建按钮 |
| 搜索无结果 | 区分"初始空"与"搜索空"：后者显示"未找到匹配结果，请调整搜索条件" |
| 下拉/选择器无选项 | 显示"暂无可选项" + 管理入口链接（如"去创建角色"） |

#### 加载状态

| 场景 | 行为 |
|------|------|
| 全页面加载 | 顶部加载进度条（NProgress 风格） |
| 列表首次加载 | Skeleton 占位（表格骨架屏） |
| 列表刷新/翻页 | 表格 Loading 覆盖层，不闪烁 |
| 模态框提交 | 按钮 Loading + 禁用重复点击 |
| 行操作（删除） | 按钮 Loading + 确认对话框 |

#### 网络异常

| 场景 | 行为 |
|------|------|
| 请求超时 | Toast 提示"请求超时，请重试"，关键操作显示重试按钮 |
| 后端不可达 | 全局离线指示器，检测网络连通性并显示提示 |
| 401 未授权 | 自动跳转登录页，保留当前 URL 以便登录后跳回 |
| 403 无权限 | 显示 403 提示页，含返回首页入口 |
| 404 未找到 | 显示 404 页面 |
| 500 服务器错误 | 显示 500 错误页，含错误摘要（来自 ABP `RemoteServiceErrorResponse`） |

#### 响应式与无障碍

| 项 | 要求 |
|----|------|
| 表格 | 移动端可横向滚动，或切换为卡片布局 |
| 模态框 | 小屏全屏显示，大屏居中弹窗 |
| Tab 键顺序 | 表单内字段按逻辑顺序切换 |
| ARIA 标签 | 按钮、图标按钮提供 `aria-label` |
| 焦点管理 | 模态框打开时焦点移入，关闭时焦点回到触发元素 |

### 10.2 认证模块补充

#### Token 管理

| 场景 | 行为 |
|------|------|
| Token 已过期 | 弹出确认对话框"登录已过期，请重新登录"，用户确认后跳转登录页（沿用多标签页同步的遮罩逻辑，不强制跳转打断当前操作） |
| 多标签页同步 | 一个标签页登出 → 其他标签页检测到 localStorage 变更 → 显示"会话已过期"遮罩，用户点击确认后跳转登录页 |
| 记住我 | 勾选后 Token 持久化到 localStorage，否则仅存 sessionStorage |

#### 登录交互

| 场景 | 行为 |
|------|------|
| 密码可见性 | 密码框右侧眼睛图标切换明文/密文 |
| Caps Lock 检测 | 密码框焦点时若 Caps Lock 开启，显示提示 |
| 登录失败 | 区分显示错误：用户名/密码错误、账户已锁定、账户未激活 |
| 租户切换 | 登录页租户框：输入租户名 → 调用 `by-name` 验证 → 通过则显示租户名称，不通过则提示 |

### 10.3 列表页通用补充

#### 表格操作

| 功能 | 说明 |
|------|------|
| 批量选择 | 表头复选框全选/取消，选中项计数显示，批量删除/启用/禁用 |
| 列排序 | 点击列头切换升序/降序/取消，多列排序通过 Shift+点击 |
| 列显示控制 | 齿轮按钮打开列选择面板，勾选显示/隐藏列，配置持久化到 localStorage |
| 快速筛选 | 表头下方行内筛选（文本/选择/日期范围） |
| 导出 | 工具栏导出按钮：导出当前筛选结果为 CSV |
| 手动刷新 | 工具栏刷新按钮，重新请求列表数据 |
| 每页条数 | 分页器提供 10/20/50/100 选项 |

#### 行操作

| 场景 | 行为 |
|------|------|
| 删除确认 | "确认删除 [名称]？此操作不可恢复" |
| 静态/系统实体 | 显示徽章标识，隐藏删除按钮 |
| 行详情 | 点击行展开详情面板（显示完整字段 + 审计信息） |

### 10.4 表单/模态框通用补充

#### 表单交互

| 场景 | 行为 |
|------|------|
| 提交前验证 | 必填字段标红星，失焦时校验，提交时全量校验 |
| 服务端错误映射 | 后端返回 `RemoteServiceErrorResponse` → 字段级错误显示在对应输入框下方 |
| 唯一性校验 | 用户名/角色名/租户名失焦时调用 API 校验唯一性 |
| 未保存变更警告 | 修改表单后未保存就关闭模态框 → 弹出确认"有未保存的更改，是否放弃？" |

#### 表单字段联动

| 场景 | 行为 |
|------|------|
| 密码可见性切换 | 创建用户/租户时密码框附带眼睛图标 |
| 密码强度提示 | 根据后端策略显示密码要求（最小长度/大小写/特殊字符） |

### 10.5 用户管理补充

| 场景 | 行为 |
|------|------|
| 启用/禁用切换 | 列表行内 Switch 开关，即时调用 API |
| 锁定/解锁 | 用户详情或行操作中的"锁定"/"解锁"按钮 |
| 邮箱确认状态 | 列表显示已确认/未确认徽章，未确认时提供"重发确认邮件"操作 |
| 用户模拟登录 | 管理员可模拟登录为该用户（需 ABP 后端支持 Impersonation） |

### 10.6 角色管理补充

| 场景 | 行为 |
|------|------|
| 静态角色标记 | `isStatic=true` 的角色显示"系统"徽章，隐藏删除按钮 |
| 默认角色标记 | `isDefault=true` 的角色显示"默认"徽章 |

### 10.7 租户管理补充

| 场景 | 行为 |
|------|------|
| 启用/禁用 | 列表行内 Switch 切换 |
| 租户模拟登录 | 管理员可模拟登录为该租户管理员 |

### 10.8 权限管理补充

| 场景 | 行为 |
|------|------|
| 权限树可视化 | 父子权限以缩进树形展示，含展开/折叠 |
| 授权来源区分 | 通过角色获得的权限 vs 直接授予的权限，用不同徽章颜色区分 |
| 批量授权 | 权限组级别"全选" + 全局"全选所有"按钮 |
| 变更摘要 | 提交前显示"将授予 X 项权限，撤销 Y 项权限" |

### 10.9 设置管理补充

| 场景 | 行为 |
|------|------|
| 邮件测试结果 | 发送测试邮件后显示成功/失败 Toast + 错误详情 |
| 可见标签页过滤 | 无权限或无内容的标签页自动隐藏 |

### 10.10 全局导航与菜单

| 需求 | 说明 |
|------|------|
| 动态侧边菜单 | 从路由配置 `meta` 字段构建菜单树，按当前用户权限（`auth.grantedPolicies`）过滤，支持分组折叠 |
| 面包屑 | 根据当前路由自动生成，最后一级不可点击 |
| 用户菜单 | 头像 + 用户名下拉：个人资料、登出；可扩展自定义菜单项 |
| 语言切换 | 下拉显示语言本地名称（如"English""中文"），切换后立即生效 |
| 页面标题 | 根据当前路由 + 本地化自动设置 `<title>` |
| 租户指示器 | 当以租户上下文操作时，顶栏显示当前租户名称 |

### 10.11 审计与日志

| 需求 | 说明 |
|------|------|
| 实体审计信息 | 创建/编辑/删除记录时显示 `creationTime`、`creatorId`、`lastModificationTime` 等（ABP 标准审计字段） |
| 操作日志 | 关键操作（创建/删除/权限变更）记录到审计日志（后端已有 `AbpAuditLogging` 模块） |

### 10.12 表单验证规则汇总

| 规则 | 适用模块 |
|------|---------|
| 必填 | 所有表单关键字段 |
| 最小/最大长度 | userName、password、角色名、租户名 |
| 邮箱格式 | email 字段 |
| 密码复杂度 | 符合后端 `SettingManagement.Password` 策略 |
| 唯一性 | userName、roleName、tenantName |
| URL 格式 | SMTP Host |

### 10.13 补充汇总

| 类别 | 新增项数 | 影响模块 |
|------|---------|---------|
| 全局 UX | 15+ | 全部 |
| 认证模块 | 8 | 登录/Token |
| 列表通用 | 7 | 用户/角色/租户 |
| 表单通用 | 5 | 全部模态框 |
| 用户管理 | 4 | 用户 |
| 角色管理 | 2 | 角色 |
| 租户管理 | 2 | 租户 |
| 权限管理 | 4 | 权限模态框 |
| 设置管理 | 2 | 设置 |
| 导航/菜单 | 6 | 全局布局 |
| 审计/日志 | 2 | 全部 |
| 验证规则 | 6 | 全部表单 |
