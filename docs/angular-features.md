# Angular 项目功能全览

## 总览

基于 **Angular 21.2 + ABP Framework 10.4.1**，LeptonX 主题（侧边菜单布局），OAuth 2.0 授权码 + PKCE 认证。仅 **7 个 TypeScript 源文件**（standalone components），其余功能全部由 `@abp/ng.*` 包提供。

---

## 一、认证 & 授权

| 功能 | 实现 |
|---|---|
| OAuth 2.0 / OIDC 登录 | `@abp/ng.oauth` + `angular-oauth2-oidc`，授权码 + PKCE |
| 路由守卫 | `authGuard` — 未登录自动跳转登录页 |
| 权限守卫 | `permissionGuard` — 无权限禁止进入 |
| 客户端凭证 | `clientId: TodoApp_App`，`scope: offline_access TodoApp` |
| 登录入口 | 首页点击 Login 按钮 → `AuthService.navigateToLogin()` |

---

## 二、ABP 预置模块页面（懒加载）

| 路由路径 | 来源包 | 页面 |
|---|---|---|
| `/account` | `@abp/ng.account` | 登录、注册、忘记密码、重置密码、邮箱确认、个人资料 |
| `/identity` | `@abp/ng.identity` | 用户 CRUD、角色 CRUD、权限分配 |
| `/tenant-management` | `@abp/ng.tenant-management` | 多租户 CRUD |
| `/setting-management` | `@abp/ng.setting-management` | 分组设置（邮件、本地化、安全等） |

> `@abp/ng.feature-management` 和 `@abp/ng.permission-management` 无独立路由，内嵌在 Identity 和 Tenant 页面中使用。

---

## 三、主题 & 布局

| 功能 | 实现 |
|---|---|
| 主题 | LeptonX 商业主题 `@abp/ng.theme.lepton-x` |
| 布局 | 侧边菜单（Side Menu）+ 动态内容区 |
| 共享 UI | Bootstrap 5、FontAwesome 图标、ngx-datatable 表格、ng-bootstrap 模态框/Toast |
| 暗色模式 | Home 页 SCSS 通过 `:host-context(.lpx-theme-dark)` 适配 |
| 自定义 Footer | `FooterComponent` 替换了 LeptonX 默认页脚 |
| Loader Bar | `AppComponent` 包含 `<abp-loader-bar />` |

---

## 四、基础设施

| 功能 | 实现 |
|---|---|
| 环境配置 | `environment.ts` — API 地址 `https://localhost:44356`，生产环境支持 `remoteEnv` |
| 本地化 | `abpLocalization` pipe，ESBuild locale 注册 |
| HTTP 拦截器 | 自动附加 Bearer Token，处理 ABP 标准响应格式 |
| 路由服务 | `RoutesService` — 动态注册菜单、面包屑 |
| CLI 工具 | `abp generate-proxy -t ng` 生成 TypeScript 代理 |
| 测试 | Vitest + jsdom |

---

## 五、自定义页面

| 页面 | 路由 | 内容 |
|---|---|---|
| **首页** | `/` | 欢迎区 + 未登录时显示 Login 按钮 + ABP 入门链接 + 社区/支持/博客推广 + ABP 书籍广告 + 社交媒体链接 |
| **页脚** | 全局 | "Lepton Theme by Volosoft" 版权 + About/Privacy/Contact 占位链接 |

---

## 六、文件结构

```
src/app/
  app.component.ts          ← <abp-loader-bar /> + <abp-dynamic-layout />
  app.routes.ts             ← 5 条懒加载路由 + 2 个 guard
  app.config.ts             ← 14 个 provider
  route.provider.ts         ← 1 个菜单项（首页）
  home/
    home.component.ts
    home.component.html
    home.component.scss
  footer/
    footer.component.ts
    footer.config.ts
```

---

## 七、@abp/* 包清单（11 个）

| 包 | 版本 | 作用 |
|---|---|---|
| `@abp/ng.core` | ~10.4.1 | 核心：Auth、Route、Localization、Guard、HTTP |
| `@abp/ng.oauth` | ~10.4.1 | OAuth2/OIDC 流程 |
| `@abp/ng.account` | ~10.4.1 | 账户页面 |
| `@abp/ng.identity` | ~10.4.1 | 用户/角色管理页面 |
| `@abp/ng.tenant-management` | ~10.4.1 | 租户管理页面 |
| `@abp/ng.setting-management` | ~10.4.1 | 设置管理页面 |
| `@abp/ng.feature-management` | ~10.4.1 | 功能开关管理 |
| `@abp/ng.components` | ~10.4.1 | 可复用组件（表格、表单、树形控件） |
| `@abp/ng.theme.shared` | ~10.4.1 | Bootstrap 5 + ng-bootstrap + FontAwesome |
| `@abp/ng.theme.lepton-x` | ~5.4.1 | LeptonX 商业主题 |
| `@abp/ng.schematics` | ~10.4.1 | CLI 代码生成（devDependency） |

---

## 八、路由配置详情

```typescript
// app.routes.ts
export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./home/home.component') },
  { path: 'account', loadChildren: () => import('@abp/ng.account').then(c => c.createRoutes()) },
  { path: 'identity', loadChildren: () => import('@abp/ng.identity').then(c => c.createRoutes()) },
  { path: 'tenant-management', loadChildren: () => import('@abp/ng.tenant-management').then(c => c.createRoutes()) },
  { path: 'setting-management', loadChildren: () => import('@abp/ng.setting-management').then(c => c.createRoutes()) },
];
```

## 九、OAuth & API 配置

```typescript
// environment.ts
const oAuthConfig = {
  issuer: 'https://localhost:44356/',
  redirectUri: baseUrl,           // http://localhost:4200
  clientId: 'TodoApp_App',
  responseType: 'code',
  scope: 'offline_access TodoApp',
  requireHttps: true,
};

const apis = {
  default: { url: 'https://localhost:44356', rootNamespace: 'TodoApp' },
  AbpAccountPublic: { url: 'https://localhost:44356/', rootNamespace: 'AbpAccountPublic' },
};
```
