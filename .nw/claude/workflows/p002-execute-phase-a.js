export const meta = {
  name: 'p002-execute-phase-a',
  description: 'Execute Phase A tasks (A1-A7) per p002 plan — fix scaffold then sequential pipeline',
  phases: [
    { title: 'Fix A1', detail: 'Fix Tailwind v3 compat + npm install + build verify' },
    { title: 'A2 API+Types', detail: 'swagger.json DTO extraction + 5 interceptors + 7 API proxies' },
    { title: 'A3 Pinia', detail: '3 stores + persistence' },
    { title: 'A4 i18n+OIDC', detail: 'vue-i18n + oidc-client-ts + permission guards' },
    { title: 'A5 UI Components', detail: 'DataTable/Modal/DynamicForm and 6 more' },
    { title: 'A6 Layouts', detail: '3 layouts + 5 partials' },
    { title: 'A7 Login+Users', detail: 'LoginView + UsersView + end-to-end verification' },
  ],
}

// ============================================================
// Phase A1: Fix scaffold build issues and verify
// ============================================================
phase('Fix A1')

const a1Result = await agent(
  "You are executing the **A1 Project Scaffold Fix** from the p002 development plan.\n" +
  "\n" +
  "## Current State\n" +
  "The vue/ directory has all source files created but the previous build failed due to:\n" +
  "1. Tailwind CSS v4 breaking changes — package.json has been updated to tailwindcss ^3.4.0\n" +
  "2. vite.config.ts __dirname issue — fixed with fileURLToPath from node:url\n" +
  "3. tsconfig.node.json missing composite — now set to true\n" +
  "4. @types/node added to devDependencies\n" +
  "\n" +
  "## What You Need To Do\n" +
  "\n" +
  "### Step 1: Check package.json\n" +
  "Read vue/package.json and verify:\n" +
  "- tailwindcss version is ^3.4.0 (NOT ^4.x)\n" +
  "- @types/node is in devDependencies\n" +
  "\n" +
  "### Step 2: Run npm install\n" +
  "In the vue/ directory, run: npm install\n" +
  "Try PowerShell: Set-Location D:/proj/nw_abp_vue/vue; npm install\n" +
  "\n" +
  "### Step 3: Verify TypeScript\n" +
  "Run: npx vue-tsc -b\n" +
  "Fix any type errors found.\n" +
  "\n" +
  "### Step 4: Verify Build\n" +
  "Run: npx vite build\n" +
  "Fix any build errors found.\n" +
  "\n" +
  "### Step 5: Check dist/\n" +
  "Confirm dist/ directory has build output.\n" +
  "\n" +
  "Return a JSON object with: { ok: boolean, typeCheck: string, build: string, errors: string[] }",
  { schema: { type: 'object', properties: { ok: { type: 'boolean' }, typeCheck: { type: 'string' }, build: { type: 'string' }, errors: { type: 'array', items: { type: 'string' } } }, required: ['ok'] }, label: 'A1-scaffold-fix', effort: 'low' }
)

log('A1 scaffold result: ' + JSON.stringify(a1Result))

if (!a1Result || !a1Result.ok) {
  log('FAIL: A1 scaffold fix did not pass. Cannot continue Phase A.')
  return { phase: 'A1', ok: false, detail: a1Result }
}

log('PASS: A1 scaffold verified! Proceeding to A2-A7 pipeline.')

// ============================================================
// Phase A2-A7: Sequential pipeline
// ============================================================

const PHASE_A_TASKS = [
  {
    id: 'A2',
    name: 'API Layer + HTTP + Types',
    prompt: "Execute the **A2 API Layer + HTTP + Types** task.\n" +
      "\n" +
      "## Source\n" +
      "Use ABP CLI `abp generate-proxy` to auto-generate all TypeScript types and API proxy files from the running backend.\n" +
      "\n" +
      "## What To Do\n" +
      "1. Ensure the ABP backend is running (IdentityServer + API endpoints accessible)\n" +
      "2. Run `abp generate-proxy` to auto-generate types and API proxy files into vue/src/types/ and vue/src/api/\n" +
      "   - This produces ALL DTO types matching the backend exactly\n" +
      "   - This produces ALL API proxy functions for every endpoint\n" +
      "3. Create vue/src/config/env.ts — API_BASE_URL, OAUTH_AUTHORITY, OAUTH_CLIENT_ID from import.meta.env\n" +
      "4. Create vue/src/api/http.ts — the ONLY hand-written HTTP file:\n" +
      "   - Axios instance with baseURL from config\n" +
      "   - Request interceptor 1: Authorization Bearer token (from auth store, lazy-loaded)\n" +
      "   - Request interceptor 2: __tenant header (from session store, lazy-loaded)\n" +
      "   - Request interceptor 3: Accept-Language header (from session store, lazy-loaded)\n" +
      "   - Request interceptor 4: X-Timezone header (from Intl or session store)\n" +
      "   - Response interceptor: RemoteServiceErrorResponse parsing, 401 triggers logout\n" +
      "   - Export httpClient for generated proxy files to use\n" +
      "\n" +
      "## Important Rules\n" +
      "- ABP CLI generated files MUST NOT be hand-edited — they will be regenerated on backend changes\n" +
      "- http.ts is the ONLY manually maintained HTTP file\n" +
      "- http.ts uses lazy store access to avoid circular deps: call useAuthStore() inside interceptor, not at module top\n" +
      "- If abp generate-proxy is not available, check ABP CLI installation: `dotnet tool install -g Volo.Abp.Cli`\n" +
      "\n" +
      "After creating files, run: npx vue-tsc -b\n" +
      "Return JSON: { ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"
  },
  {
    id: 'A3',
    name: 'Pinia State Layer',
    prompt: "Execute the **A3 Pinia State Layer** task.\n" +
      "\n" +
      "## Files to Create\n" +
      "1. vue/src/stores/app-config.ts — useAppConfigStore:\n" +
      "   - State: config (ApplicationConfiguration | null), loading, error\n" +
      "   - Action: fetchAppConfig() calls GET /api/abp/application-configuration via httpClient\n" +
      "   - Called once at app boot\n" +
      "2. vue/src/stores/auth.ts — useAuthStore:\n" +
      "   - State: user, accessToken, refreshToken\n" +
      "   - Getter: isAuthenticated (checks token exists)\n" +
      "   - Persist: pinia-plugin-persistedstate → localStorage with 'abp_auth' key\n" +
      "3. vue/src/stores/session.ts — useSessionStore:\n" +
      "   - State: language (default 'zh-Hans'), tenantId (null), timezone (Intl timezone)\n" +
      "   - Persist: all fields to localStorage with 'abp_session' key\n" +
      "4. vue/src/stores/index.ts — re-export all stores\n" +
      "5. Update vue/src/main.ts if needed to ensure pinia-plugin-persistedstate is registered\n" +
      "\n" +
      "## Rules\n" +
      "- Use defineStore with composition API style (setup function)\n" +
      "- Persistedstate config: { storage: localStorage, key: 'abp_xxx' }\n" +
      "- After creating, run: npx vue-tsc -b\n" +
      "Return JSON: { ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"
  },
  {
    id: 'A4',
    name: 'i18n + Permission + OIDC',
    prompt: "Execute the **A4 i18n + Permission + OIDC** task.\n" +
      "\n" +
      "## Files to Create\n" +
      "1. vue/src/plugins/i18n.ts — vue-i18n instance:\n" +
      "   - Create i18n with createI18n({ legacy: false, locale: 'zh-Hans', fallbackLocale: 'en' })\n" +
      "   - Export function loadLocaleMessages(lang) that fetches from /api/abp/application-localization?cultureName=lang\n" +
      "2. vue/src/plugins/oidc.ts — oidc-client-ts UserManager:\n" +
      "   - PKCE flow (response_type: 'code')\n" +
      "   - silent_redirect_uri for silent refresh\n" +
      "   - Config from env.ts (authority, client_id, redirect_uri, post_logout_redirect_uri)\n" +
      "3. vue/src/composables/useAuth.ts:\n" +
      "   - login() → userManager.signinRedirect()\n" +
      "   - logout() → userManager.signoutRedirect()\n" +
      "   - getToken() → userManager.getUser().then(u => u?.access_token)\n" +
      "   - handleCallback() → userManager.signinRedirectCallback() — call on OIDC redirect page\n" +
      "4. vue/src/composables/usePermission.ts — hasPermission(policy) checks appConfigStore.auth.grantedPolicies\n" +
      "5. vue/src/composables/useLocalization.ts — wraps useI18n() + language switching\n" +
      "6. vue/src/composables/useTenant.ts — tenant switching composable\n" +
      "7. vue/src/directives/v-permission.ts:\n" +
      "   - mounted(el, binding) — if !hasPermission(binding.value) then el.parentNode.removeChild(el)\n" +
      "8. vue/src/router/guards/auth.ts:\n" +
      "   - beforeEach: if route requires auth && !isAuthenticated → trigger OIDC login\n" +
      "9. vue/src/router/guards/permission.ts:\n" +
      "   - beforeEach: if route.meta.requiredPolicy && !hasPermission(policy) → redirect /error/403\n" +
      "10. Update vue/src/router/index.ts to register both guards\n" +
      "\n" +
      "## Rules\n" +
      "- OIDC callback page at /oidc-callback calls handleCallback() then redirects to original URL\n" +
      "- Silent refresh uses iframe, fallback to full redirect on failure\n" +
      "- v-permission: save a reference to parent before removal for cleanup\n" +
      "- After creating all files, run: npx vue-tsc -b\n" +
      "Return JSON: { ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"
  },
  {
    id: 'A5',
    name: 'UI Components',
    prompt: "Execute the **A5 UI Components** task. Create 9 reusable components.\n" +
      "\n" +
      "## Components to Create (in order of dependency)\n" +
      "\n" +
      "### 1. vue/src/components/AbpToast.ts\n" +
      "Export functions: showSuccess(msg), showError(msg), showWarning(msg), showInfo(msg).\n" +
      "Wraps ElMessage with consistent duration and offset.\n" +
      "\n" +
      "### 2. vue/src/components/AbpConfirmDialog.ts\n" +
      "Export: showConfirm(options: { title, message, type? }) → Promise<boolean>.\n" +
      "Wraps ElMessageBox.confirm with consistent button text.\n" +
      "\n" +
      "### 3. vue/src/components/AbpEmptyState.vue\n" +
      "Three states: 'empty' (no data — shows create button), 'no-results' (search returned nothing — text only), 'no-options' (dropdown empty — text only).\n" +
      "Props: type ('empty'|'no-results'|'no-options'), createLabel, onCreate callback.\n" +
      "\n" +
      "### 4. vue/src/components/AbpModal.vue\n" +
      "Wraps el-dialog. Props: visible, title, size ('sm'|'md'|'lg'|'xl'|'fullscreen'), loading, confirmLabel, cancelLabel.\n" +
      "Emits: update:visible, confirm, cancel.\n" +
      "Features: before-close dirty check (use VeeValidate useIsFormDirty if formContext provided), submit button loading+disabled, server error mapping to fields (RemoteServiceErrorResponse).\n" +
      "Fullscreen mode at ≤768px via media query.\n" +
      "\n" +
      "### 5. vue/src/components/AbpDynamicForm.vue\n" +
      "Props: fields (array of field config objects), modelValue (form data object), schema (Zod schema).\n" +
      "8 field types supported:\n" +
      "- text → el-input\n" +
      "- number → el-input-number\n" +
      "- email → el-input type=email\n" +
      "- password → el-input type=password with show-password toggle\n" +
      "- switch → el-switch\n" +
      "- select → el-select (with options array from field config)\n" +
      "- date → el-date-picker\n" +
      "- textarea → el-input type=textarea\n" +
      "Uses VeeValidate useField/useForm for validation. Each field has: name, type, label, required, placeholder, options (for select).\n" +
      "\n" +
      "### 6. vue/src/components/AbpDataTable.vue\n" +
      "Wraps el-table + el-pagination. Props: columns, api (function for fetching data), searchPlaceholder.\n" +
      "Features:\n" +
      "- Server-side pagination (page/skipCount params)\n" +
      "- Server-side sorting (sortBy/sortOrder)\n" +
      "- Search input with debounce (300ms)\n" +
      "- Column visibility toggle (el-popover with el-checkbox list)\n" +
      "- Skeleton loading state (el-skeleton)\n" +
      "- Empty state integration (AbpEmptyState)\n" +
      "- Row actions slot (named 'actions')\n" +
      "- Responsive: horizontal scroll at ≤768px\n" +
      "- Emits: row-click, selection-change\n" +
      "\n" +
      "### 7. vue/src/components/AbpBreadcrumb.vue\n" +
      "Auto-generates from route.matched. Last item not clickable. Uses el-breadcrumb.\n" +
      "\n" +
      "### 8. vue/src/components/AbpLoaderBar.vue\n" +
      "Wraps nprogress. Provides start()/done() functions. Configure with blue #409eff color.\n" +
      "\n" +
      "### 9. vue/src/components/AbpErrorPage.vue\n" +
      "Props: code (403|404|500). Shows icon + title + description + action button based on code.\n" +
      "403: 'No Permission' / 404: 'Page Not Found' / 500: 'Server Error'.\n" +
      "\n" +
      "## Rules\n" +
      "- All components use <script setup lang=\"ts\">\n" +
      "- AbpDynamicForm uses VeeValidate + Zod; create a toTypedSchema wrapper\n" +
      "- AbpDataTable must handle empty, loading, and error states\n" +
      "- After creating all components, run: npx vue-tsc -b\n" +
      "Return JSON: { ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"
  },
  {
    id: 'A6',
    name: 'Layout System',
    prompt: "Execute the **A6 Layout System** task.\n" +
      "\n" +
      "## Partials to Create (vue/src/layouts/partials/)\n" +
      "\n" +
      "1. UserMenu.vue — User dropdown:\n" +
      "   - el-dropdown with avatar icon + username from authStore\n" +
      "   - Dropdown items: Manage Profile, Logout\n" +
      "   - Logout calls useAuth().logout()\n" +
      "\n" +
      "2. LangSwitch.vue — Language switcher:\n" +
      "   - el-dropdown with current language icon\n" +
      "   - Dropdown shows available languages from appConfigStore\n" +
      "   - On select: sessionStore.language = lang → i18n.locale = lang → reload localization\n" +
      "\n" +
      "3. TenantBox.vue — Tenant switcher:\n" +
      "   - Shows current tenant name\n" +
      "   - el-dropdown to switch tenants (from appConfigStore)\n" +
      "   - On select: sessionStore.tenantId = id\n" +
      "\n" +
      "4. SideMenu.vue — Side navigation:\n" +
      "   - Get routes from router.getRoutes()\n" +
      "   - Filter: routes with name and meta.requiredPolicy\n" +
      "   - Group by path prefix (e.g., /identity, /tenant-management, /setting-management)\n" +
      "   - Render with el-menu (vertical mode)\n" +
      "   - Each item checks permission via usePermission().hasPermission()\n" +
      "   - Active state from current route\n" +
      "   - Collapse support (props: collapsed)\n" +
      "   - At ≤768px: render as el-drawer triggered by hamburger button\n" +
      "\n" +
      "5. TopBar.vue — Top navigation bar:\n" +
      "   - el-header with flex layout\n" +
      "   - Left: logo/app name + hamburger button (emits toggle-sidebar)\n" +
      "   - Right: TenantBox + LangSwitch + UserMenu\n" +
      "   - Props: sidebarCollapsed, emit: toggle-sidebar\n" +
      "\n" +
      "## Layouts to Create\n" +
      "\n" +
      "6. ApplicationLayout.vue:\n" +
      "   - el-container: sidebar + header + main\n" +
      "   - SideMenu (left) + TopBar (top) + AbpBreadcrumb + <router-view> (main with el-main)\n" +
      "   - Sidebar collapse state managed here\n" +
      "   - Responsive: sidebar becomes drawer at ≤768px\n" +
      "\n" +
      "7. AccountLayout.vue:\n" +
      "   - Centered card layout (max-w-md, mx-auto, vertical center)\n" +
      "   - App logo at top, <router-view> in center, no navigation\n" +
      "   - Background: light gray\n" +
      "\n" +
      "8. EmptyLayout.vue:\n" +
      "   - Pure <router-view> with no chrome/navigation\n" +
      "   - Used for error pages\n" +
      "\n" +
      "## Update App.vue\n" +
      "Use dynamic <component :is=\"layout\"> based on route.meta.layout:\n" +
      "- 'application' (default) → ApplicationLayout\n" +
      "- 'account' → AccountLayout\n" +
      "- 'empty' → EmptyLayout\n" +
      "Add <AbpLoaderBar /> and <router-view /> with <transition>.\n" +
      "\n" +
      "## Rules\n" +
      "- Update router to set meta.layout on routes (add to A6, routes will be refined in A7)\n" +
      "- After creating all files, run: npx vue-tsc -b\n" +
      "Return JSON: { ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"
  },
  {
    id: 'A7',
    name: 'Login + User Management',
    prompt: "Execute the **A7 Login + User Management** task — the end-to-end verification slice.\n" +
      "\n" +
      "## Files to Create\n" +
      "\n" +
      "### 1. vue/src/views/auth/LoginView.vue\n" +
      "- Form fields: username (el-input), password (el-input with show-password toggle + Caps Lock detection), rememberMe (el-checkbox), tenantName (optional, el-input)\n" +
      "- Form validation: username required, password required\n" +
      "- Submit: calls useAuth().login() → on success redirect to returnUrl or '/'\n" +
      "- Error handling: distinguish network error, invalid credentials, tenant not found — show different toast messages\n" +
      "- Loading state: button disabled + loading spinner during submission\n" +
      "- AccountLayout wrapper (set route meta.layout = 'account')\n" +
      "- Links: Forgot Password → /account/forgot-password, Register → /account/register\n" +
      "\n" +
      "### 2. vue/src/views/identity/UsersView.vue\n" +
      "- Uses AbpDataTable with columns: userName, name, surname, email, phoneNumber, roles (comma-separated), creationTime, isActive\n" +
      "- Row actions slot: Edit button, Delete button (AbpConfirmDialog), permission entry button (placeholder for B4)\n" +
      "- New User button in toolbar → opens UserCreateEditModal\n" +
      "- Search placeholder: 'Search users...'\n" +
      "- API: identityUsersApi from A2\n" +
      "\n" +
      "### 3. vue/src/views/identity/components/UserCreateEditModal.vue\n" +
      "- Uses AbpModal + AbpDynamicForm\n" +
      "- Fields for create: userName, name, surname, email, phoneNumber, password, isActive\n" +
      "- Fields for edit: userName, name, surname, email, phoneNumber, isActive (no password)\n" +
      "- Role assignment tab (el-tabs): second tab with el-transfer for role assignment\n" +
      "- Props: visible, userId (null for create)\n" +
      "- Emits: saved, close\n" +
      "- On save: create or update via identityUsersApi\n" +
      "- Error: map RemoteServiceErrorResponse to form fields\n" +
      "\n" +
      "### 4. Update vue/src/router/index.ts\n" +
      "Add routes:\n" +
      "  - /account/login → LoginView (meta: { layout: 'account' })\n" +
      "  - /identity/users → UsersView (meta: { requiredPolicy: 'AbpIdentity.Users', layout: 'application' })\n" +
      "\n" +
      "## Acceptance Criteria (G1-G4 Gate)\n" +
      "After implementation, verify:\n" +
      "- G1: Clear localStorage → visit /identity/users → auto-redirect to IdentityServer login → after callback, return to users list\n" +
      "- G2: Create user → appears in list → edit → save → refresh → delete → disappears\n" +
      "- G3: Confirm B1 (Role Management) only needs columns/fields/api config changes, no component changes\n" +
      "- G4: Check browser Network panel — request headers include Authorization/__tenant/Accept-Language/X-Timezone, 401 triggers logout\n" +
      "\n" +
      "## Rules\n" +
      "- After creating all files, run: npx vue-tsc -b\n" +
      "Return JSON: { ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"
  },
]

// Run A2-A7 in pipeline (sequential — each depends on previous)
const phaseResults = await pipeline(
  PHASE_A_TASKS,
  function(task, index) {
    log('Starting ' + task.id + ': ' + task.name + ' (' + (index + 1) + '/' + PHASE_A_TASKS.length + ')')
    return agent(
      task.prompt,
      {
        schema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            ok: { type: 'boolean' },
            filesCreated: { type: 'array', items: { type: 'string' } },
            typeCheckPassed: { type: 'boolean' },
            notes: { type: 'string' },
          },
          required: ['taskId', 'ok'],
        },
        label: task.id + '-' + task.name,
        phase: task.id + ' ' + task.name,
      }
    )
  }
)

// Check results
const failed = phaseResults.filter(function(r) { return !r || !r.ok })
if (failed.length > 0) {
  var ids = failed.map(function(r) { return r ? r.taskId : 'null' }).join(', ')
  log('FAIL: Phase A has ' + failed.length + ' failed task(s): ' + ids)
  return { phase: 'A', ok: false, results: phaseResults, failed: failed }
}

log('PASS: All ' + PHASE_A_TASKS.length + ' Phase A tasks completed! Gate G1-G4 should be verified by A7.')

return { phase: 'A', ok: true, results: phaseResults }
