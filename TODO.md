# TODO

## 已实现功能

### 认证模块
- [x] 登录 / 注册 / 忘记密码 / 重置密码
- [x] OAuth 2.0 + OpenID Connect（remote 模式，基于 `oidc-client-ts`）
- [x] 静默 Token 刷新、Session 监控
- [x] 个人资料管理

### 身份管理
- [x] 用户 CRUD（列表、创建、编辑、删除、搜索、分页）
- [x] 角色 CRUD（含权限分配）
- [x] 权限弹窗（树形勾选，支持编辑/非编辑权限）

### 多租户
- [x] 租户 CRUD（列表、创建、编辑、删除）
- [x] 默认/非默认连接字符串配置
- [x] 租户功能开关管理

### 设置管理
- [x] 时区设置
- [x] 密码复杂度策略
- [x] 注册/登录行为配置
- [x] 账户锁定策略
- [x] 双因素认证设置

### 功能管理
- [x] 功能开关弹窗（多层级分组，支持编辑/非编辑功能）

### 基础设施
- [x] ABP Dynamic Form（动态表单渲染，支持多种字段类型）
- [x] ABP Data Table（增强表格，排序/分页/搜索/批量操作）
- [x] ABP Toast / ABP Modal / ABP Confirm Dialog
- [x] 权限指令 `v-permission`（细粒度 UI 显示控制）
- [x] 权限组合式函数 `usePermission`
- [x] 路由守卫（认证 + 权限检查）
- [x] 中文本地化（zh-Hans）
- [x] 错误页面（403 / 404 / 500）
- [x] 加载进度条（NProgress）

## 后续规划

| 规划项 | 说明 |
|--------|------|
| **登录模块插件化** | 将 OIDC 认证逻辑抽离为独立插件，支持 `createApp().use(oidcPlugin, config)` 式声明，运行时切换认证方式 |
| **数据提供层可插拔** | 抽象统一数据接口，remote / standalone 作为可选项引入，便于扩展 mock-provider、graphql-provider 等 |
| **ABP 逻辑插件包化** | 将 ABP 耦合逻辑收敛为 `@nw/abp-vue` 可选插件包，非 ABP 项目可完全不引入 |
| **DDD 模式抽象** | 以 Domain / Application / Infrastructure / Presentation 四层重构，核心逻辑与 UI 框架解耦 |
| **i18n 可选项** | 国际化为可选插件，不引入时默认中文运行，按需加载语言包 |
| **主题切换** | 亮色/暗色主题切换，基于 Element Plus CSS 变量 + Tailwind 暗色模式，用户偏好持久化 |
