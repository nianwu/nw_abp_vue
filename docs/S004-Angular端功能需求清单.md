# 需求列表

> 以 `demo/`（ABP Angular 默认模板）为参考，Vue 前端需实现的全部必要性功能。
> 详细功能分析参见 `ABP功能三维度分类分析.md`。

| 序号 | 功能模块 | 说明 | 对应 ABP 包 |
|------|----------|------|-------------|
| 1 | 登录/注册/密码 | OAuth2/OIDC 认证流程 | `@abp/ng.account` + `@abp/ng.oauth` |
| 2 | 用户管理 | 用户 CRUD、角色分配 | `@abp/ng.identity` |
| 3 | 角色管理 | 角色 CRUD、权限分配 | `@abp/ng.identity` |
| 4 | 租户管理 | 多租户 CRUD、功能开关 | `@abp/ng.tenant-management` |
| 5 | 权限管理 | 权限模态框（标准 + 资源模式） | `@abp/ng.permission-management` |
| 6 | 功能开关 | 功能管理模态框（3 种值类型） | `@abp/ng.feature-management` |
| 7 | 设置管理 | 标签页式设置面板（邮件等） | `@abp/ng.setting-management` |
