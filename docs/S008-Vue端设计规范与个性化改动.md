# S008 — Vue 端设计规范与个性化改动

## 目的

梳理 Vue 端开发过程中形成的设计规范与个性化改动，作为后续功能开发的风格参照。涵盖组件封装、交互约定、术语说明等所有与 ABP 默认模板存在差异或新增的设计决策。

## 参考文件

- `vue/src/components/AbpDataTable.vue`
- `vue/src/components/DateTimeCell.vue`
- `vue/src/utils/date-format.ts`
- `vue/src/components/AbpDynamicForm.vue`
- `vue/src/components/AbpModal.vue`
- `vue/src/components/AbpEmptyState.vue`
- `vue/src/components/AbpErrorPage.vue`
- `vue/src/components/AbpLoaderBar.vue`
- `vue/src/components/AbpBreadcrumb.vue`
- `vue/src/components/PermissionModal.vue`
- `vue/src/components/FeatureModal.vue`
- `vue/src/components/AboutProject.vue`
- `vue/src/utils/permission-modal.ts`
- `vue/src/utils/feature-modal.ts`
- `vue/src/views/docs/ResourcePermissionDoc.vue`
- `vue/src/views/docs/ResourceKeyDoc.vue`
- `vue/src/views/identity/UsersView.vue`
- `vue/src/views/identity/RolesView.vue`
- `vue/src/views/tenant/TenantsView.vue`
- `vue/src/views/settings/SettingsView.vue`
- `vue/src/router/index.ts`
- `vue/src/router/guards/auth.ts`
- `vue/src/router/guards/permission.ts`
- `vue/src/directives/v-permission.ts`
- `vue/src/types/abp.ts`
- `vue/src/config/env.ts`

---

## 一、表格列设置

`AbpDataTable` 是项目统一的列表页封装组件。

### 1.1 列可见性控制

- 通过工具栏右侧的齿轮图标按钮触发 `el-popover`，内含 `el-checkbox-group` 列出所有列。
- 每一列可勾选显示/隐藏，操作列（actions 插槽）**不可隐藏**——仅在手動调整过列宽后才在列设置面板中显示其当前宽度。

### 1.2 日期列渲染模式切换

- 标记了 `dateRender: true` 的列，在列设置面板中额外出现 `el-radio-group`，提供三种渲染模式切换：
  - **完整日期** — `2026/7/1 14:30:00`
  - **相对时间** — `3 小时前`（超过 3 天自动回退完整日期）
  - **完整+相对** — `2026/7/1 14:30:00 (3 小时前)`
- 每列的渲染模式独立存储，持久化到 `localStorage`（key: `abp:date-render:<storageKey>:<prop>`）。

### 1.3 列宽拖拽持久化

- Element Plus 原生列宽拖拽（`resizable`）的变更通过 `@header-dragend` 事件捕获。
- 列宽以 `px` 值持久化到 `localStorage`（key: `abp:col-width:<storageKey>:<prop>`）。
- 操作列的列宽同样持久化（key: `__actions__`）。
- 每列可单独重置列宽（删除按钮），也可一键"重置所有列宽"。

### 1.4 移动端列隐藏

- 列配置中的 `hideOnMobile: true` 会在 `max-width: 767px` 时通过 CSS `display: none` 隐藏该列。
- 通常用于时间列等次要信息。

### 1.5 分页大小持久化

- 通过 `storageKey` prop 将每页条数持久化到 `localStorage`（key: `abp:page-size:<storageKey>`）。
- 页面刷新后恢复用户上次选择的分页大小。

### 1.6 空状态与加载态

- 加载中（首次）显示 `el-skeleton` 骨架屏。
- 无数据时显示 `AbpEmptyState` 组件，区分"暂无数据"和"未找到匹配结果"两种场景。

---

## 二、时间字段渲染

### 2.1 DateTimeCell 组件

- 封装为独立组件 `DateTimeCell.vue`，接收原始日期值（字符串/数字/Date）和渲染模式。
- null/undefined → 显示 `-`。
- 无效日期 → 返回原始字符串。
- `relative` 模式下鼠标悬停显示完整日期（`el-tooltip`）。

### 2.2 date-format.ts 工具模块

- 基于 `date-fns` + `zhCN` locale。
- 三种模式常量化：`DATE_RENDER_MODES` 数组，包含 `value` / `label` / `example` 字段，供 UI 渲染选项使用。
- 超过 3 天的日期在 `relative` 和 `combined` 模式下自动回退为完整日期格式。

### 2.3 构建时间显示

- `AboutProject.vue` 中构建时间使用 `DateTimeCell` 以 `combined` 模式渲染。
- 构建时间通过 `VITE_BUILD_TIME` 环境变量注入，CI 构建时自动更新。

---

## 三、表单分栏

### 3.1 AbpDynamicForm 组件

| 字段类型 | Element Plus 组件 | 说明 |
|---------|------------------|------|
| `text` | `el-input` | 普通文本 |
| `number` | `el-input-number` | 数字输入（带步进控件） |
| `email` | `el-input type="email"` | 自动邮箱校验 |
| `password` | `el-input type="password"` | 带显示/隐藏切换 |
| `switch` | `el-switch` | 布尔值开关 |
| `select` | `el-select` | 下拉选项 |
| `date` | `el-date-picker` | 日期选择（`YYYY-MM-DD` 格式） |
| `textarea` | `el-input type="textarea"` | 多行文本（默认 3 行） |

### 3.2 分栏规则

- 默认单列布局。
- 设置 `cols` prop（当前仅支持 2）后，在 1920px+ 视口自动切换为 `grid grid-cols-2` 双列布局。
- 分栏为 1920px 固定断点（Tailwind `min-[1920px]:grid-cols-2`），未采用自适应断点。
- 当前项目中，用户新建/编辑表单为简单字段数（≤7 个），尚未需要启用双列分栏。该能力已内置于 `AbpDynamicForm`，按需开启。

### 3.3 校验规则自动生成

- 根据字段配置自动生成 `FormRules`：
  - `required: true` → 必填校验
  - `type: 'email'` → 邮箱格式校验
- API 响应中的字段级错误（`fieldErrors`）通过 `parseAbpError()` 解析后传入 `fieldErrors` prop 展示。

---

## 四、表格操作列 Link 样式

### 4.1 统一风格

所有表格页的操作列按钮均使用 Element Plus `link` 样式 + `size="small"`，搭配对应图标：

```html
<el-button size="small" link type="primary" :icon="Edit">编辑</el-button>
<el-button size="small" link type="danger" :icon="Delete">删除</el-button>
<el-button size="small" link type="warning" :icon="Lock">权限</el-button>
<el-button size="small" link type="success" :icon="Connection">连接字符串</el-button>
<el-button size="small" link type="warning" :icon="Setting">功能</el-button>
```

### 4.2 操作列布局

- `AbpDataTable` 操作列使用 CSS `display: flex; flex-wrap: nowrap; gap: 4px; justify-content: center`。
- 与默认 Element Plus 表格的独立按钮不同，link 样式 + flex 布局使操作列更紧凑。

### 4.3 约定

- 编辑 → `type="primary"` + `Edit` 图标
- 删除 → `type="danger"` + `Delete` 图标
- 权限/功能类 → `type="warning"` + `Lock` / `Setting` 图标

---

## 五、非大众词汇说明页

针对 ABP 框架中"资源权限"、"资源密钥"等专业概念，建立了独立的说明文档页面。

### 5.1 页面路由

| 路由 | 标题 | 布局 | 权限 |
|------|------|------|------|
| `/docs/resource-permissions` | 资源权限说明 | EmptyLayout | 公开（无需登录） |
| `/docs/resource-key` | 资源密钥说明 | EmptyLayout | 公开（无需登录） |

### 5.2 入口

- `PermissionModal` 的资源权限 Tab 标题旁和"资源密钥" label 旁均放置 `QuestionFilled` 帮助图标。
- 点击图标在新标签页打开对应说明页（`window.open`）。
- 说明页内容以 `max-width: 960px` 居中排版，使用 `el-table`、`el-steps`、`el-alert` 等 Element Plus 组件呈现结构化文档。

### 5.3 交互约定

- 概念性帮助内容 → 独立说明页（新标签页打开）
- 操作性简短说明 → `el-tooltip` 悬浮提示（如"已通过配置角色获取该权限"）

---

## 六、弹窗组件体系

### 6.1 AbpModal — 通用弹窗封装

基于 `el-dialog` 封装，提供：

- **尺寸预设**：`sm`(420px) / `md`(600px) / `lg`(800px) / `xl`(1000px) / `fullscreen`
- **移动端自适应**：`<768px` 时自动全屏显示（监听 `resize`）
- **未保存提醒**：`dirty` prop 为 true 时，关闭弹窗前弹出确认对话框
- **统一样式**：取消/保存按钮布局固定，loading 态按钮禁用

### 6.2 PermissionModal / FeatureModal — 命令式 API

- 通过 `openPermissionModal()` / `openFeatureModal()` 创建组件实例，挂载到 `document.body`。
- 返回 `{ open(), close(), onSaved(cb) }` 命令式接口。
- 宿主页面无需在模板中声明弹窗组件，减少模板代码。
- 弹窗关闭后自动销毁实例并移除 DOM 节点。

### 6.3 Tab 内嵌表单

- `UserCreateEditModal` 使用 `el-tabs` 将基本信息表单和角色分配分为两个 Tab。
- 基本信息 Tab 内嵌 `AbpDynamicForm`，角色分配 Tab 使用 `el-tree` 多选。

---

## 七、空状态与错误页面

### 7.1 AbpEmptyState

| type | 描述 | 备注 |
|------|------|------|
| `empty` | 暂无数据 | 可显示创建按钮（`createLabel` + `@create`） |
| `no-results` | 未找到匹配结果 | 搜索无结果时使用 |
| `no-options` | 暂无可用选项 | 下拉列表等场景 |

### 7.2 AbpErrorPage

- 支持 403 / 404 / 500 三种错误码。
- 根据错误码显示不同标题、描述和操作按钮：
  - 403 → 返回上一页
  - 404 → 返回首页
  - 500 → 返回首页
- 可显示来源 URL（`?from=` query 参数），样式为等宽字体。

---

## 八、全局加载进度条

`AbpLoaderBar.vue` 封装 `nprogress`，通过 HTTP 拦截器自动联动：
- 请求开始时调用 `startLoader()`（pending 计数器 +1）
- 请求完成时调用 `stopLoader()`（pending 计数器 -1，归零时隐藏）
- NProgress 颜色使用 CSS 变量 `--el-color-primary`

---

## 九、权限控制体系

### 9.1 三层权限控制

| 层级 | 方式 | 说明 |
|------|------|------|
| 路由级 | `meta.requiredPolicy` + permission guard | 无权限直接跳转 403 |
| DOM 级 | `v-permission="'PolicyName'"` | 无权限移除 DOM 元素 |
| 逻辑级 | `usePermission().hasPermission()` | 组合式 API 中编程判断 |

### 9.2 认证守卫

- 非公开路由访问时检查 `authStore.isAuthenticated`。
- 未认证 → 跳转 `/oidc-callback?redirect=<原始URL>`。
- 公开路由判定：`/oidc-callback`、`/error/*`、`/account/*`、`meta.public === true`。

---

## 十、Provider 双模式架构

### 10.1 模式切换

通过 `VITE_PROVIDER_MODE` 环境变量切换：

| 模式 | 值 | 行为 |
|------|------|------|
| Standalone | `standalone` | HTTP 拦截器模拟 API 响应 + localStorage 持久化 + 种子数据；跳过 OIDC 直接注入模拟 Token |
| Remote | `remote` | 直连 ABP 后端 API + IdentityServer；OAuth 2.0/OIDC 完整流程 |

### 10.2 Standalone 特性

- 所有 API 交互增加 100~500ms 随机延迟模拟真实网络。
- 种子数据位于 `stores/standalone/seeds/demo.ts`。
- 各实体 store（identity-store、tenant-store、permission-store、feature-store、settings-store）使用统一 `localStorage` 存储层。

---

## 十一、Layout 布局系统

### 11.1 三种布局

| 布局 | 路由 meta | 用途 |
|------|-----------|------|
| `ApplicationLayout` | `layout: 'application'` | 标准管理后台（侧边栏 + 顶栏 + 内容区） |
| `AccountLayout` | `layout: 'account'` | 登录/注册/忘记密码等账户页面 |
| `EmptyLayout` | `layout: 'empty'` | 独立页面（文档页、错误页） |

### 11.2 响应式

- 桌面端：折叠侧边栏（`--sidebar-collapsed-width: 64px` / `--sidebar-width: 260px`）。
- 移动端（<768px）：侧边栏改为 `el-drawer` 抽屉形式。

---

## 十二、CSS 变量体系

在 `index.scss` 的 `:root` 中定义布局尺寸变量，全局组件统一引用：

| 变量 | 值 | 用途 |
|------|------|------|
| `--sidebar-width` | 260px | 侧边栏展开宽度 |
| `--sidebar-collapsed-width` | 64px | 侧边栏折叠宽度 |
| `--topbar-height` | 48px | 顶栏高度 |
| `--breadcrumb-height` | 36px | 面包屑高度 |

---

## 十三、环境变量配置规范

所有配置通过 `.env` / `.env.example` 管理，以 `VITE_` 为前缀：

| 变量 | 用途 |
|------|------|
| `VITE_PROVIDER_MODE` | standalone / remote 模式切换 |
| `VITE_API_BASE_URL` | API 基址 |
| `VITE_OAUTH_AUTHORITY` | IdentityServer 地址 |
| `VITE_OAUTH_CLIENT_ID` | OIDC 客户端 ID |
| `VITE_APP_NAME` | 应用名称 |
| `VITE_APP_VERSION` | 应用版本号 |
| `VITE_BUILD_TIME` | 构建时间（CI 自动更新） |
| `VITE_ROUTER_MODE` | history / hash |

---

## 十四、其他约定

### 14.1 路由模式

- 默认 `history` 模式（HTML5 History API），生产部署需服务端配置 SPA fallback。
- 备选 `hash` 模式（`#` 号路径），无需服务端配置，适用于 GitHub Pages 等静态托管。

### 14.2 页面标题

路由 `afterEach` 钩子动态设置 `document.title`，格式：`<meta.title> | ABP`，默认 `ABP Vue | ABP`。

### 14.3 Provider Key 缩写

在 PermissionModal 中使用单字母缩写标识权限提供者类型：
- `R` → Role（角色）
- `U` → User（用户）
- `T` → Tenant（租户）

### 14.4 操作列宽度默认值

- 默认 `240px`
- 租户管理页（操作较多）使用 `300px`（通过 `actions-width` prop 覆盖）

### 14.5 排序箭头处理

Element Plus 表格排序箭头默认占据列宽，通过 CSS 将其设为 `position: absolute` 脱离文档流，使列头文字居中时不受箭头宽度影响。

### 14.6 类型文件标记

`types/abp.ts` 头部标记 `@generated`，注明来源为 swagger.json 提取，后端可用时应通过 `abp generate-proxy` 重新生成覆盖。
