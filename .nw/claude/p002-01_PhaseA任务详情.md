# p002-01 — Phase A 任务详情（垂直切片）

> 隶属：[p002_vue端开发任务](./p002_vue端开发任务.md)

## 修订记录

| 时间 | 修订内容 |
|------|---------|
| 2026-06-30 19:50:00 | 首次创建 |

## A1 [P0] 项目脚手架（0.5d）

### 输入
无——这是第一个任务。

### 产出文件
```
vue/
├── package.json                     # 17 依赖按 p001-01 阶段清单安装
├── vite.config.ts                   # Vite 6 + Vue 插件 + Element Plus 按需导入 + Sass additionalData + Tailwind
├── tsconfig.json / tsconfig.node.json
├── tailwind.config.ts               # 断点 576/768/992/1200
├── index.html
├── src/
│   ├── main.ts                      # createApp().mount() 空壳
│   ├── App.vue                      # <RouterView/> 占位
│   ├── styles/
│   │   ├── variables.scss           # Element Plus 主题变量覆盖
│   │   ├── index.scss               # 全局样式入口
│   │   └── transitions.scss         # 页面过渡动画
│   ├── router/index.ts              # 空路由树（仅 `/` 占位）
│   └── env.d.ts                     # 全局类型声明
```

### 实施步骤
1. `npm create vue@latest` 初始化项目（选 TypeScript + Router + Pinia）
2. 安装 Element Plus + unplugin-vue-components + unplugin-auto-import + Sass + Tailwind CSS + postcss + autoprefixer
3. 配置 `vite.config.ts`：Element Plus 按需导入 + Sass `additionalData` 注入 `variables.scss`
5. 配置 `tailwind.config.ts`：自定义断点 + 禁用 preflight（与 Element Plus 冲突）
6. 创建 `styles/` 三件套
7. 创建 `router/index.ts`（createRouter + createWebHistory，仅 `/` 占位）
8. 验证：`npm run dev` 启动 + `npm run build` 零报错

### 验收
- [ ] `npm run dev` 正常启动，浏览器可访问
- [ ] `npm run build` 无 error 无 warning
- [ ] Element Plus 组件可在模板中使用（写一个 `<el-button>` 测试）
- [ ] Tailwind 类名生效（写一个 `class="mt-4"` 测试）
- [ ] Sass 变量注入生效（在组件中引用 `variables.scss` 变量）

---

## A2 [P0] API 层 + HTTP + 类型定义（1d）

### 输入
- 后端已运行（IdentityServer + API，ABP 标准部署）
- A1 脚手架可运行

### 产出文件

**ABP CLI 生成**（`abp generate-proxy`）：`src/types/`（全部 DTO）+ `src/api/`（全部代理，含 index.ts）

**手工编写**：`src/api/http.ts`（Axios + 5 拦截器）+ `src/config/env.ts`（环境变量）

### 后端启动（独立 dotnet 项目，与 Vue 项目解耦）

```bash
dotnet run --project "<path>/TodoApp.HttpApi.Host"
```
启动后确认 `https://localhost:44356/api/abp/application-configuration` 返回 200。

### 实施步骤
1. 确认后端运行中（见上方命令），`abp generate-proxy` 可连接
2. 在后端项目目录下执行：
   ```bash
   abp generate-proxy -t js -wd "<path>/TodoApp.HttpApi.Host" -u "https://localhost:44356" -o "<path>/vue/src/api"
   ```
   生成的类型与 API 代理文件覆盖 `src/types/` 和 `src/api/`
3. 创建 `config/env.ts`（从 `import.meta.env` 读取环境变量）
4. 创建 `api/http.ts`：Axios 实例 + 5 拦截器（请求 4：Auth/__tenant/Accept-Language/X-Timezone；响应 1：错误解析+401 登出）

### 验收
- [ ] `abp generate-proxy` 执行成功，类型与 API 文件生成完整
- [ ] `httpClient.get()` 可发起请求（浏览器 Network 面板可见）
- [ ] 5 拦截器全部注册且执行顺序正确
- [ ] 401 响应触发登出流程（此时仅验证拦截器注册，登出逻辑在 A4 完善）

### 注意事项
- 拦截器读取 store 时注意循环依赖：用 `useXxxStore()` 的懒加载方式，不在模块顶层 import
- `abp generate-proxy` 生成的文件勿手工编辑，后续后端更新时重新生成覆盖
- `api/http.ts` 是唯一手工维护的 HTTP 文件，ABP CLI 生成的代理文件依赖它导出的 `httpClient`

---

## A3 [P0] Pinia 状态层（0.5d）

### 输入
- A2 API 层就绪（拦截器可读取 store 中的 token/租户/语言）

### 产出文件
```
vue/src/stores/
├── app-config.ts                    # useAppConfigStore — /application-configuration 缓存
├── auth.ts                          # useAuthStore — user + token + 持久化
├── session.ts                       # useSessionStore — 语言 + 租户 + 持久化
└── index.ts                         # 统一导出
```

### 实施步骤
1. **app-config store**：启动时 fetch `/api/abp/application-configuration`，缓存 `auth/currentUser/localization/setting` 等字段
2. **auth store**：`user` / `token` / `refreshToken` / `isAuthenticated` getter，接入 `pinia-plugin-persistedstate`（`localStorage`）
3. **session store**：`language` / `tenantId` / `timezone`，全部持久化
4. 在 `main.ts` 中引导：`app.use(createPinia().use(piniaPluginPersistedstate))`

### 验收
- [ ] 启动时自动请求 `/application-configuration` 并存入 app-config store
- [ ] auth store 持久化到 localStorage，刷新页面不丢失
- [ ] session store 语言/租户变更即持久化

### 注意事项
- 三个 store 无互相依赖，可并行编写
- 持久化用 `localStorage` 键名加 `abp_` 前缀避免冲突

---

## A4 [P0] i18n + 权限 + OIDC 认证（1d）

### 输入
- A3 三个 store 就绪

### 产出文件
```
vue/src/
├── plugins/
│   ├── i18n.ts                      # vue-i18n 实例 + ABP 远程加载
│   └── oidc.ts                      # oidc-client-ts UserManager 配置
├── composables/
│   ├── useAuth.ts                   # login / logout / getToken / refreshToken
│   ├── usePermission.ts             # hasPermission / permissionGuard composable
│   ├── useLocalization.ts           # useI18n 包装（语言切换 + 远程加载）
│   └── useTenant.ts                 # 租户切换 composable
├── directives/
│   └── v-permission.ts              # DOM 级权限控制指令
├── router/guards/
│   ├── auth.ts                      # 认证守卫 — 未登录跳 IdentityServer
│   └── permission.ts                # 权限守卫 — 无权限跳 403
```

### 实施步骤
1. **i18n 插件**：创建 vue-i18n 实例，注册 `t` 函数；远程加载 `/api/abp/application-localization?cultureName=xx`
2. **OIDC 插件**：`UserManager` 配置（PKCE 流程 + `response_type: 'code'` + 静默刷新 + Remember Me），暴露 userManager 实例
3. **useAuth**：`login()` 触发 OIDC 跳转 / `logout()` 清 token 并跳转 / `getToken()` 返回当前 access token / 静默刷新
4. **usePermission**：`hasPermission(policy)` 从 app-config store 的 `auth.grantedPolicies` 校验
5. **v-permission**：`mounted` 时检查权限，无权限则 `el.parentNode.removeChild(el)`
6. **认证守卫**：`beforeEach` 中检查 `useAuthStore().isAuthenticated`，未认证跳转 OIDC
7. **权限守卫**：匹配路由 `meta.requiredPolicy`，不满足跳 `/error/403`

### 验收
- [ ] i18n 资源从后端加载并正常显示（`{{ $t('key') }}` 输出正确文案）
- [ ] 切换语言后页面即时更新
- [ ] `v-permission` 指令可正确移除 DOM 元素
- [ ] 无权限路由被守卫拦截
- [ ] OIDC 登录跳转至 IdentityServer 并正确回调

### 注意事项
- OIDC 回调 URL 须在 IdentityServer 中注册
- 静默刷新用 `iframe` 模式，失败时降级为重新登录

---

## A5 [P0] UI 组件定型（2d）

### 输入
- A4 i18n/OIDC/权限基础设施就绪

### 产出文件（9 组件）
```
vue/src/components/
├── AbpDataTable.vue                 # el-table 封装：分页/排序/搜索/行操作/空状态/骨架/列可见性/响应式
├── AbpModal.vue                     # el-dialog 封装：多尺寸/脏检查/提交loading/错误映射/全屏
├── AbpDynamicForm.vue               # 配置驱动表单：首批 8 字段类型（text/number/email/password/switch/select/date/textarea）
├── AbpToast.ts                      # ElMessage 封装（info/success/warning/error）
├── AbpLoaderBar.vue                 # nprogress 封装（httpClient 拦截器联动）
├── AbpBreadcrumb.vue                # 基于 route.matched 自动生成
├── AbpEmptyState.vue                # 三态空状态（无数据/搜索无结果/无选项）
├── AbpErrorPage.vue                 # 403/404/500 错误展示页
└── AbpConfirmDialog.ts              # ElMessageBox.confirm 封装
```

### 实施步骤（按依赖顺序）
1. **AbpToast / AbpConfirmDialog / AbpEmptyState**（0.25d）— 无依赖，纯 ElMessage 封装
2. **AbpModal**（0.5d）— el-dialog + VeeValidate `useIsFormDirty` + `useIsSubmitting`
3. **AbpDynamicForm**（0.5d）— 8 字段类型配置驱动渲染 + Zod schema 自动生成
4. **AbpDataTable**（0.5d）— el-table + el-pagination + 搜索 + 列可见性 + 骨架屏 + 行操作插槽
5. **AbpBreadcrumb / AbpLoaderBar / AbpErrorPage**（0.25d）— 独立组件，顺序无关

### 验收
- [ ] DataTable：分页/排序/搜索三项均可正常使用
- [ ] DataTable：空数据（显示引导按钮）/搜索无结果（文案提示）两种空状态正确区分
- [ ] DataTable：768px 以下出现横向滚动
- [ ] Modal：关闭前脏检查弹窗提示
- [ ] Modal：提交时按钮 loading + 禁用
- [ ] Modal：服务端 RemoteServiceErrorResponse 映射到对应字段下方
- [ ] DynamicForm：首批 8 种字段类型均正确渲染和提交
- [ ] Toast 四个级别可正常弹出

### 注意事项
- DynamicForm 字段配置类型定义写在 `types/`，确保扩展新字段类型时零侵入
- DataTable 的行操作通过具名插槽暴露，各页面自行填入按钮

---

## A6 [P0] 布局系统（1d）

### 输入
- A5 全部组件就绪

### 产出文件
```
vue/src/layouts/
├── ApplicationLayout.vue            # 标准后台布局
├── AccountLayout.vue                # 居中认证框布局
├── EmptyLayout.vue                  # 无导航纯内容布局（错误页用）
└── partials/
    ├── SideMenu.vue                 # 侧边菜单（从路由+权限动态生成）
    ├── TopBar.vue                   # 顶栏（logo + 移动端汉堡 + 右侧操作区）
    ├── UserMenu.vue                 # 用户下拉（头像+退出登录）
    ├── LangSwitch.vue               # 语言切换下拉
    └── TenantBox.vue                # 租户切换器
```
> 同时更新 `src/App.vue`：根据 `route.meta.layout` 动态选择布局。

### 实施步骤
1. **partials/** 先实现（0.25d）：UserMenu / LangSwitch / TenantBox 独立组件
2. **SideMenu**（0.25d）：从 `router.getRoutes()` 提取有 `name` 的路由 → 按路径前缀分组 → 根据权限过滤 → `el-menu` 渲染
3. **TopBar**（0.15d）：logo + 移动端汉堡按钮 + `<UserMenu/>` + `<LangSwitch/>` + `<TenantBox/>`
4. **ApplicationLayout**（0.15d）：`<SideMenu/>` + `<TopBar/>` + `<AbpBreadcrumb/>` + `<router-view/>`
5. **AccountLayout + EmptyLayout**（0.1d）：简单布局，无导航
6. **App.vue 路由布局选择**（0.1d）：`<component :is="layoutComponent"><router-view/></component>`

### 验收
- [ ] ApplicationLayout：侧边菜单基于路由 meta 动态生成
- [ ] 菜单项根据权限过滤（无权限条目不显示）
- [ ] 768px 以下侧边菜单变为抽屉模式（el-drawer）
- [ ] AccountLayout：居中展示认证框，无导航元素
- [ ] 面包屑自动生成且最后一级不可点击

---

## A7 [P0] 登录页 + 用户管理（1.5d）

### 输入
- A6 布局系统就绪
- A5 全部 UI 组件就绪
- A4 OIDC/i18n/权限就绪
- A2 API 代理就绪

### 产出文件
```
vue/src/views/
├── auth/
│   └── LoginView.vue                # 登录页（用户名/密码/记住我/租户切换/密码可见性/Caps Lock/登录失败原因）
└── identity/
    ├── UsersView.vue                # 用户列表页（分页+搜索+新建/编辑/删除）
    └── components/
        └── UserCreateEditModal.vue  # 用户创建/编辑模态框（动态表单 + 角色分配 el-tabs）
```
> 同时更新 `router/index.ts`：添加 auth + identity 路由。

### 实施步骤
1. **LoginView**（0.5d）：
   - 表单：username / password（带可见性切换 + Caps Lock 检测）/ rememberMe / tenantName 切换器
   - 提交：`useAuth().login(username, password)` → 成功跳转 → 失败区分原因（网络/凭据/租户不存在）
   - 状态：登录中 loading / 失败 toast
2. **UsersView**（0.5d）：
   - `AbpDataTable` 配置：用户名/邮箱/手机号/角色/创建时间 列
   - 行操作：编辑 / 删除（AbpConfirmDialog）/ 权限管理入口（预留）
3. **UserCreateEditModal**（0.5d）：
   - `AbpModal` + `AbpDynamicForm` 组合
   - 字段：userName / name / surname / email / phoneNumber / password（仅创建）/ isActive
   - 角色分配 tab：`el-transfer` 组件分配角色
   - 全链路：新建→列表刷新→编辑→保存→删除

### 验收（= Phase A → Phase B 门禁 G1-G4）
- [ ] **G1**：清除 localStorage → 访问 `/identity/users` → 自动跳转 IdentityServer 登录 → 回调后回到用户列表
- [ ] **G2**：新建用户→列表中出现→点击编辑→修改字段→保存后刷新列表→删除→列表中消失
- [ ] **G3**：确认角色管理（B1）只需改 columns/fields/api 三个配置即可工作
- [ ] **G4**：Network 面板确认四头注入（Authorization / __tenant / Accept-Language / X-Timezone）+ 401 触发登出

### 注意事项
- 此任务是整个架构的端到端验证，A1-A6 的所有问题都会在此暴露
- G3 验证：在 UsersView 上将 API 换为 `identityRolesApi`、字段换为 `name/isDefault/isPublic`，确认页面正常工作——如需修改组件则门禁不通过
