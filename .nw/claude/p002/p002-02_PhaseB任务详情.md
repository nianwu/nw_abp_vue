# p002-02 — Phase B 任务详情（水平扩展）

> 隶属：[p002_vue端开发任务](./p002_vue端开发任务.md)　|　任务总表见主文件

## 修订记录

| 时间 | 修订内容 |
|------|---------|
| 2026-06-30 19:50:00 | 首次创建 |

---

## B1 [P1] 角色管理（1d）

### 输入
- A7 端到端验证通过（DataTable + Modal + DynamicForm 模式已定型）
- API 代理 `identity-roles.ts` 已在 A2 就绪

### 产出文件
```
vue/src/views/identity/
├── RolesView.vue                    # 角色列表页
└── components/
    └── RoleCreateEditModal.vue       # 角色创建/编辑模态框
```
> 同时更新 `router/index.ts`：添加 `/identity/roles` 路由（`requiredPolicy: 'AbpIdentity.Roles'`）。

### 实施步骤
1. **RolesView**（0.4d）：
   - 复制 UsersView 结构，替换 API 为 `identityRolesApi`
   - 列定义：name（角色名） / isDefault（默认角色徽章） / isPublic（公开徽章） / isStatic（静态角色不可删除徽章）
   - 行操作：编辑 / 删除（静态角色禁用删除按钮）/ 权限入口 → `openPermissionModal({ providerName: 'R', providerKey: role.name })`
2. **RoleCreateEditModal**（0.4d）：
   - 字段：name（text，必填）/ isDefault（switch）/ isPublic（switch）
   - 复用 `AbpModal` + `AbpDynamicForm` 零改动
3. **端到端验证**（0.2d）：角色 CRUD 全链路 + 权限按钮可弹出模态框

### 验收
- [ ] 列表/新建/编辑/删除 CRUD 全链路正常
- [ ] 静态角色显示徽章且删除按钮禁用
- [ ] 默认角色显示徽章
- [ ] 权限入口按钮可用且弹出权限模态框

### 注意事项
- 此任务是 B 系列第一个，验证 A7 的模式复用性——严格只改 columns/fields/api，不碰组件

---

## B2 [P1] 个人资料页 + 剩余认证页面（1d）

### 输入
- A7 LoginView 已完成
- API 代理 `account.ts` 已在 A2 就绪

### 产出文件
```
vue/src/views/auth/
├── RegisterView.vue                 # 注册页
├── ForgotPasswordView.vue           # 忘记密码页
├── ResetPasswordView.vue            # 重置密码页
└── ManageProfileView.vue            # 个人资料管理页
```
> 同时更新 `router/index.ts`：添加 `/account/*` 子路由。

### 实施步骤
1. **RegisterView**（0.2d）：用户名/邮箱/密码/确认密码 → `accountApi.register()` → 成功后跳转登录
2. **ForgotPasswordView**（0.2d）：邮箱输入 → `accountApi.forgotPassword()` → 发送成功提示
3. **ResetPasswordView**（0.2d）：从 URL 获取 userId + resetToken → 新密码/确认密码 → `accountApi.resetPassword()`
4. **ManageProfileView**（0.3d）：`AbpDynamicForm` 渲染个人信息（userName/name/surname/email/phoneNumber）+ 修改密码面板（currentPassword/newPassword/confirmPassword）
5. **端到端验证**（0.1d）：注册→登录→个人资料→修改密码 全链路

### 验收
- [ ] 注册→登录 流程可走通
- [ ] 忘记密码→重置密码 流程可走通
- [ ] 个人资料编辑+修改密码 功能正常

### 注意事项
- 注册/忘记密码/重置密码不要求登录状态，路由守卫需放行
- 修改密码成功后的 token 处理需与 A4 OIDC 静默刷新联动

---

## B3 [P2] 租户管理（1d）

### 输入
- A7 模式定型
- API 代理 `tenant.ts` 已在 A2 就绪

### 产出文件
```
vue/src/views/tenant/
├── TenantsView.vue                  # 租户列表页
└── components/
    ├── TenantCreateEditModal.vue     # 租户创建/编辑模态框（创建含密码，编辑无密码）
    └── ConnectionStringPanel.vue     # 连接字符串管理面板
```
> 同时更新 `router/index.ts`：添加 `/tenant-management/tenants` 路由（`requiredPolicy: 'AbpTenantManagement.Tenants'`）。

### 实施步骤
1. **TenantsView**（0.3d）：
   - 列定义：name / adminEmail / editionName / isActive（启用/禁用 switch 内联切换）
   - 行操作：编辑 / 连接字符串 / 删除 / 功能入口 → `openFeatureModal({ providerName: 'T', providerKey: tenantId })`
2. **TenantCreateEditModal**（0.3d）：
   - 创建模式：name / adminEmailAddress / adminPassword（必填）/ isActive
   - 编辑模式：name / isActive（无密码字段）
3. **ConnectionStringPanel**（0.2d）：独立组件，在各连接字符串名称下提供 editable textarea，复用 AbpModal
4. **端到端验证**（0.2d）：租户 CRUD + 连接字符串 + 功能入口

### 验收
- [ ] 列表/新建（含密码）/编辑（无密码字段）/删除 CRUD 完整
- [ ] 连接字符串面板读写正常
- [ ] 启用/禁用 switch 即时生效
- [ ] 功能入口按钮可用且弹出功能模态框

---

## B4 [P2] 权限管理 — 对象式 API（1.5d）

### 输入
- A7 模式定型（但权限管理不使用标准 CRUD 模板）
- API 代理 `permission.ts` 已在 A2 就绪

### 产出文件
```
vue/src/utils/
└── permission-modal.ts              # openPermissionModal({ providerName, providerKey }) → { open, close, onSaved }
vue/src/components/
└── PermissionModal.vue              # 权限树模态框内部组件（不被外部直接使用）
```

### 实施步骤
1. **PermissionModal 组件**（0.6d）：
   - 权限树：`el-tree` 按组（group）标签页（el-tabs）分组
   - 父子级联选择 + indeterminate 半选态
   - 授权来源徽章：Role / User / Tenant 颜色区分
   - 变更摘要区域："授予 X 项 / 撤销 Y 项" 实时计算
2. **资源权限子面板**（0.4d）：
   - 列表视图：已授权的资源权限项
   - 添加视图：资源类型选择 + 具体资源搜索 + 权限级别
   - 编辑视图：修改权限级别 / 移除
3. **openPermissionModal 对外合约**（0.3d）：
   - 调用 `getPermissionGrants({ providerName, providerKey })` 获取当前授权
   - 调用 `updatePermissionGrants()` 保存
   - 返回 `{ open(), close(), onSaved(() => {}) }` —— 不暴露内部状态
4. **端到端验证**（0.2d）

### 验收
- [ ] 权限树按组标签页分组显示
- [ ] 父子级联选择正确（选父自动选子，取消子→父变半选）
- [ ] 授权来源徽章颜色区分（Role/User/Tenant）
- [ ] 变更摘要"授予 X 项/撤销 Y 项"准确
- [ ] 资源权限：列表/添加/编辑三视图正常

### 注意事项
- 对象式 API 的关键：`openPermissionModal()` 返回的 `{ open, close, onSaved }` 封装全部内部状态，宿主页面完全不持有 visible/loading/dirty 等状态

---

## B5 [P2] 功能管理 — 对象式 API（1d）

### 输入
- A7 模式定型
- API 代理 `feature.ts` 已在 A2 就绪
- B4 PermissionModal 的对象式 API 模式可参考

### 产出文件
```
vue/src/utils/
└── feature-modal.ts                 # openFeatureModal({ providerName, providerKey }) → { open, close, onSaved }
vue/src/components/
└── FeatureModal.vue                 # 功能模态框内部组件
```

### 实施步骤
1. **FeatureModal 组件**（0.6d）：
   - 功能树：`el-tree` 按组标签页分组
   - 三种值类型渲染：
     - Toggle → `el-switch`
     - FreeText → `el-input`
     - Selection → `el-select`（从功能定义中读取选项列表）
   - 父子级联：取消父功能 → 全部子功能自动取消
   - 变更摘要
2. **openFeatureModal 对外合约**（0.2d）：同 B4 模式，`open({ providerName, providerKey }) → { open, close, onSaved }`
3. **端到端验证**（0.2d）

### 验收
- [ ] Toggle / FreeText / Selection 三种值类型各渲染正确
- [ ] 父子级联：取消父功能 → 全部子功能自动取消
- [ ] 变更摘要准确

---

## B6 [P3] 设置管理（1d）

### 输入
- A7 模式定型
- API 代理 `settings.ts` 已在 A2 就绪

### 产出文件
```
vue/src/views/settings/
├── SettingsView.vue                 # 标签页容器
├── components/
│   ├── EmailSettingsTab.vue         # SMTP 表单 + 测试邮件
│   └── TimezoneSettingsTab.vue      # 时区选择器
```

### 实施步骤
1. **SettingsView**（0.15d）：`el-tabs` 容器，切换 Email / Timezone 标签页
2. **EmailSettingsTab**（0.4d）：
   - 表单字段：smtpHost / smtpPort / smtpUserName / smtpPassword / smtpDomain / smtpEnableSsl / smtpUseDefaultCredentials / defaultFromAddress / defaultFromDisplayName
   - 测试邮件按钮 → `sendTestEmail()` → 成功/失败反馈
   - 保存 → `updateEmailSettings()`
3. **TimezoneSettingsTab**（0.25d）：
   - 时区选择器（el-select + 从后端获取时区列表）
   - 保存后联动更新 `X-Timezone` 请求头
4. **端到端验证**（0.2d）

### 验收
- [ ] SMTP 表单保存后数据持久化
- [ ] 发送测试邮件功能正常
- [ ] 时区选择器保存后 `X-Timezone` 头更新

---

## B7 [P3] 集成收尾（1d）

### 输入
- B1-B6 全部完成

### 产出文件（修改为主）
```
vue/src/
├── router/index.ts                  # 追加错误页路由 + catch-all 重定向
├── App.vue                          # <title> 动态设置
├── composables/useOffline.ts        # 离线/超时检测
├── components/AbpErrorPage.vue      # 已在 A5 创建，此时验证
└── [各 views]                       # 审计字段补充
```

### 实施步骤
1. **错误页路由**（0.1d）：`/error/403` / `/error/404` / `/error/500` → `AbpErrorPage`，catch-all `/:pathMatch(.*)*` → 重定向 404
2. **离线/超时提示**（0.15d）：`useOffline` composable 监听 `navigator.onLine` + Axios 超时，Toast 提示
3. **`<title>` 动态设置**（0.1d）：`afterEach` 中 `document.title = route.meta.title ?? 'App'`
4. **审计字段**（0.15d）：在全部表格和详情中添加 `creationTime` / `lastModificationTime` / `creatorId` 列（复用 DataTable 列定义）
5. **响应式最终验证**（0.2d）：逐页面 768px 切换验证——表格横向滚动 / 模态框全屏 / 菜单抽屉 / 表单垂直堆叠
6. **S006 需求对照验证**（0.2d）：逐条对照 `docs/S006-Vue端功能需求清单.md`，确认全部页面可访问且功能正常
7. **构建验证**（0.1d）：`npm run build` 零 error 零 warning / `npm run lint` 零 error

### 验收（= Phase B 完成门禁 G5-G8）
- [ ] **G5**：S006 需求清单全部页面可访问且功能正常
- [ ] **G6**：swagger.json 全部 57 端点有对应 API 函数且类型匹配
- [ ] **G7**：`npm run build` 零 error 零 warning
- [ ] **G8**：17 个依赖全 MIT/Apache 2.0

### 注意事项
- 此任务执行前须 B1-B6 全部完成，但 B2-B6 可并行执行
- S006 对照验证时，若有遗漏功能需回溯到对应任务修复
