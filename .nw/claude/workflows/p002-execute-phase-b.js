export const meta = {
  name: 'p002-execute-phase-b',
  description: 'Execute Phase B tasks (B1-B7) in full parallel after Phase A gate G1-G4 passes',
  phases: [
    { title: 'B Verifications', detail: 'Verify A7 gate G1-G4 before launch' },
    { title: 'B1 Role Mgmt', detail: 'Role CRUD + permission entry' },
    { title: 'B2 Profile+Auth', detail: 'Register/Forgot/Reset/ManageProfile' },
    { title: 'B3 Tenant Mgmt', detail: 'Tenant CRUD + connection strings + feature entry' },
    { title: 'B4 Permission Modal', detail: 'Permission tree + cascade + change summary' },
    { title: 'B5 Feature Modal', detail: 'Feature toggle/text/select + cascade' },
    { title: 'B6 Settings', detail: 'Email settings + timezone settings' },
    { title: 'B7 Integration', detail: 'Error pages + offline + title + audit + S006 check' },
  ],
}

// ============================================================
// Pre-flight: Verify Phase A gate conditions
// ============================================================
phase('B Verifications')

log('Phase B pre-flight: checking Phase A gate G1-G4...')
log('These should be verified by A7 agent. If A7 confirms all gates pass, proceed.')
log('Gate G1: OIDC login flow')
log('Gate G2: User CRUD full chain')
log('Gate G3: UI pattern reusable (B1 only needs config changes)')
log('Gate G4: 5 interceptors + 401 logout')

// ============================================================
// Phase B tasks: all parallel
// ============================================================

const B1_PROMPT = "Execute the **B1 Role Management** task from the p002 development plan.\n" +
  "\n" +
  "## Context\n" +
  "Phase A is complete. The following patterns are verified and reusable:\n" +
  "- AbpDataTable (columns config → full-featured table)\n" +
  "- AbpModal + AbpDynamicForm (fields config → validated form modal)\n" +
  "- API proxy pattern (pure functions in api/identity-roles.ts — already exists from A2)\n" +
  "\n" +
  "## What To Do\n" +
  "1. Read existing vue/src/views/identity/UsersView.vue and UserCreateEditModal.vue as templates\n" +
  "2. Create vue/src/views/identity/RolesView.vue:\n" +
  "   - Copy UsersView structure, replace API with identityRolesApi\n" +
  "   - Columns: name (RoleName), isDefault (badge), isPublic (badge), isStatic (badge, non-deletable)\n" +
  "   - Row actions: Edit, Delete (disabled if isStatic), Permission button → openPermissionModal({ providerName: 'R', providerKey: role.name })\n" +
  "3. Create vue/src/views/identity/components/RoleCreateEditModal.vue:\n" +
  "   - Fields: name (text, required), isDefault (switch), isPublic (switch)\n" +
  "   - Reuse AbpModal + AbpDynamicForm with ZERO component changes\n" +
  "4. Update vue/src/router/index.ts: add /identity/roles route with meta.requiredPolicy 'AbpIdentity.Roles'\n" +
  "5. Run npx vue-tsc -b to verify types\n" +
  "\n" +
  "## Acceptance\n" +
  "- CRUD full chain works\n" +
  "- Static roles show badge and cannot be deleted\n" +
  "- Default roles show badge\n" +
  "- Permission entry button opens permission modal\n" +
  "\n" +
  "Return JSON: { taskId: 'B1', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"

const B2_PROMPT = "Execute the **B2 Profile + Auth Pages** task.\n" +
  "\n" +
  "## Context\n" +
  "LoginView already exists from A7. Need to complete remaining auth pages.\n" +
  "\n" +
  "## What To Do\n" +
  "1. Create vue/src/views/auth/RegisterView.vue:\n" +
  "   - Fields: userName, email, password, confirmPassword\n" +
  "   - Validations: password match, email format, required fields\n" +
  "   - Submit: accountApi.register() → success toast → redirect to login\n" +
  "   - Layout: AccountLayout (set route meta.layout = 'account')\n" +
  "2. Create vue/src/views/auth/ForgotPasswordView.vue:\n" +
  "   - Field: email → accountApi.forgotPassword() → success message\n" +
  "3. Create vue/src/views/auth/ResetPasswordView.vue:\n" +
  "   - Get userId + resetToken from URL query params\n" +
  "   - Fields: newPassword, confirmPassword → accountApi.resetPassword()\n" +
  "4. Create vue/src/views/auth/ManageProfileView.vue:\n" +
  "   - AbpDynamicForm with fields: userName, name, surname, email, phoneNumber\n" +
  "   - Password change section: currentPassword, newPassword, confirmPassword\n" +
  "   - Submit: accountApi.updateProfile() + accountApi.changePassword()\n" +
  "5. Update vue/src/router/index.ts: add /account/register, /account/forgot-password, /account/reset-password, /account/manage-profile routes\n" +
  "6. Run npx vue-tsc -b\n" +
  "\n" +
  "## Acceptance\n" +
  "- Register → Login flow works\n" +
  "- Forgot → Reset password flow works\n" +
  "- Profile edit + password change works\n" +
  "\n" +
  "Return JSON: { taskId: 'B2', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"

const B3_PROMPT = "Execute the **B3 Tenant Management** task.\n" +
  "\n" +
  "## Context\n" +
  "Patterns from A7 UsersView + UserCreateEditModal are the template. API: api/tenant.ts (7 endpoints, already created in A2).\n" +
  "\n" +
  "## What To Do\n" +
  "1. Create vue/src/views/tenant/TenantsView.vue:\n" +
  "   - AbpDataTable columns: name, adminEmail, editionName, isActive (el-switch inline toggle)\n" +
  "   - Row actions: Edit, Connection Strings, Delete, Feature button → openFeatureModal({ providerName: 'T', providerKey: tenantId })\n" +
  "2. Create vue/src/views/tenant/components/TenantCreateEditModal.vue:\n" +
  "   - Create mode: name, adminEmailAddress, adminPassword (required), isActive\n" +
  "   - Edit mode: name, isActive (NO password field)\n" +
  "   - AbpModal + AbpDynamicForm\n" +
  "3. Create vue/src/views/tenant/components/ConnectionStringPanel.vue:\n" +
  "   - Separate modal showing connection string name-value pairs as editable textareas\n" +
  "   - Save: tenantApi.setConnectionString()\n" +
  "4. Update router: add /tenant-management/tenants route (requiredPolicy: 'AbpTenantManagement.Tenants')\n" +
  "5. Run npx vue-tsc -b\n" +
  "\n" +
  "## Acceptance\n" +
  "- CRUD: create (with password), edit (without password), delete\n" +
  "- Connection string panel read/write\n" +
  "- isActive toggle works\n" +
  "- Feature entry button opens feature modal\n" +
  "\n" +
  "Return JSON: { taskId: 'B3', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"

const B4_PROMPT = "Execute the **B4 Permission Management (Object API)** task.\n" +
  "\n" +
  "## Context\n" +
  "Permission management uses an object-style API pattern: openPermissionModal({ providerName, providerKey }) returns { open(), close(), onSaved(cb) }.\n" +
  "The modal encapsulates ALL internal state — host pages never hold visible/loading/dirty state.\n" +
  "\n" +
  "## What To Do\n" +
  "1. Create Vue component at vue/src/components/PermissionModal.vue (internal, not directly imported by pages):\n" +
  "   - el-tabs by permission groups\n" +
  "   - Each tab: el-tree with checkboxes for permission grant/deny\n" +
  "   - Parent-child cascade: check parent → all children checked; uncheck all children → parent becomes indeterminate; uncheck parent → all children unchecked\n" +
  "   - Grant source badges: Role (blue), User (green), Tenant (orange) — color-coded\n" +
  "   - Change summary area at bottom: 'Grant X items / Revoke Y items' live counter\n" +
  "   - Resource permissions sub-panel:\n" +
  "     * List view: granted resource permissions table\n" +
  "     * Add view: resource type selector + resource search + permission level\n" +
  "     * Edit view: modify permission level or remove\n" +
  "2. Create vue/src/utils/permission-modal.ts:\n" +
  "   - export function openPermissionModal({ providerName, providerKey })\n" +
  "   - Returns { open(): void, close(): void, onSaved(callback): void }\n" +
  "   - Uses createApp + mount to render PermissionModal imperatively\n" +
  "   - On open: fetch getPermissionGrants({ providerName, providerKey })\n" +
  "   - On save: call updatePermissionGrants()\n" +
  "   - On close: unmount + cleanup\n" +
  "3. Update B1 RolesView to wire the permission entry button:\n" +
  "   - Click handler: const modal = openPermissionModal({ providerName: 'R', providerKey: role.name })\n" +
  "   - modal.onSaved(() => { /* refresh list if needed */ })\n" +
  "   - modal.open()\n" +
  "4. Also wire permission entry in A7 UsersView (placeholder was left):\n" +
  "   - openPermissionModal({ providerName: 'U', providerKey: user.id })\n" +
  "5. Run npx vue-tsc -b\n" +
  "\n" +
  "## Acceptance\n" +
  "- Permission tree grouped by tabs\n" +
  "- Parent-child cascade correct\n" +
  "- Grant source badges color-coded\n" +
  "- Change summary accurate\n" +
  "- Resource permissions: list/add/edit views work\n" +
  "\n" +
  "Return JSON: { taskId: 'B4', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"

const B5_PROMPT = "Execute the **B5 Feature Management (Object API)** task.\n" +
  "\n" +
  "## Context\n" +
  "Same object API pattern as B4: openFeatureModal({ providerName, providerKey }) returns { open(), close(), onSaved(cb) }.\n" +
  "Feature values have 3 types: Toggle (boolean switch), FreeText (string input), Selection (dropdown with options from feature definition).\n" +
  "\n" +
  "## What To Do\n" +
  "1. Create Vue component at vue/src/components/FeatureModal.vue:\n" +
  "   - el-tabs by feature groups\n" +
  "   - Each tab: el-tree with 3 value type renderers:\n" +
  "     * Toggle → el-switch in the tree node\n" +
  "     * FreeText → el-input in the tree node\n" +
  "     * Selection → el-select with options from feature definition\n" +
  "   - Parent-child cascade: disable parent → all children auto-disabled\n" +
  "   - Change summary area: list of changed features with old/new values\n" +
  "2. Create vue/src/utils/feature-modal.ts:\n" +
  "   - export function openFeatureModal({ providerName, providerKey })\n" +
  "   - Returns { open(), close(), onSaved(cb) }\n" +
  "   - Same imperative mount pattern as permission-modal.ts\n" +
  "   - On open: fetch getFeatureGrants({ providerName, providerKey })\n" +
  "   - On save: call updateFeatureGrants()\n" +
  "3. Wire into B3 TenantsView feature entry button:\n" +
  "   - openFeatureModal({ providerName: 'T', providerKey: tenantId })\n" +
  "4. Run npx vue-tsc -b\n" +
  "\n" +
  "## Acceptance\n" +
  "- Toggle/FreeText/Selection render correctly\n" +
  "- Disable parent → all children disabled\n" +
  "- Change summary accurate\n" +
  "\n" +
  "Return JSON: { taskId: 'B5', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"

const B6_PROMPT = "Execute the **B6 Settings Management** task.\n" +
  "\n" +
  "## Context\n" +
  "Settings page uses el-tabs for sub-sections. API: api/settings.ts (6 endpoints, already created in A2).\n" +
  "\n" +
  "## What To Do\n" +
  "1. Create vue/src/views/settings/SettingsView.vue:\n" +
  "   - el-tabs container with Email and Timezone tabs\n" +
  "2. Create vue/src/views/settings/components/EmailSettingsTab.vue:\n" +
  "   - AbpDynamicForm fields: smtpHost, smtpPort, smtpUserName, smtpPassword, smtpDomain, smtpEnableSsl, smtpUseDefaultCredentials, defaultFromAddress, defaultFromDisplayName\n" +
  "   - 'Send Test Email' button → settingsApi.sendTestEmail() → success/failure toast\n" +
  "   - Save button → settingsApi.updateEmailSettings()\n" +
  "3. Create vue/src/views/settings/components/TimezoneSettingsTab.vue:\n" +
  "   - el-select with timezone list (fetch from appConfig or hardcode common zones)\n" +
  "   - On save: settingsApi.updateTimezone() + update sessionStore.timezone + update X-Timezone header\n" +
  "4. Update router: add /setting-management route (requiredPolicy: 'AbpAccount.SettingManagement')\n" +
  "5. Run npx vue-tsc -b\n" +
  "\n" +
  "## Acceptance\n" +
  "- Email SMTP form save persists\n" +
  "- Send test email works\n" +
  "- Timezone selector saves and X-Timezone header updates\n" +
  "\n" +
  "Return JSON: { taskId: 'B6', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, notes: string }"

const B7_PROMPT = "Execute the **B7 Integration Finalization** task.\n" +
  "\n" +
  "## Context\n" +
  "All B1-B6 functional tasks are complete. This task handles cross-cutting concerns, error pages, and final verification.\n" +
  "\n" +
  "## What To Do\n" +
  "1. Wire error page routes in vue/src/router/index.ts:\n" +
  "   - /error/403 → AbpErrorPage (props: { code: 403 }, meta.layout: 'empty')\n" +
  "   - /error/404 → AbpErrorPage (props: { code: 404 }, meta.layout: 'empty')\n" +
  "   - /error/500 → AbpErrorPage (props: { code: 500 }, meta.layout: 'empty')\n" +
  "   - /:pathMatch(.*)* → redirect to /error/404\n" +
  "2. Create vue/src/composables/useOffline.ts:\n" +
  "   - Monitor navigator.onLine + axios interceptor timeout\n" +
  "   - Show toast on offline/timeout\n" +
  "3. Dynamic <title> in router afterEach:\n" +
  "   - document.title = (route.meta.title || 'ABP Vue') + ' | ABP'\n" +
  "4. Add audit fields to all DataTable column definitions:\n" +
  "   - creationTime, lastModificationTime columns where applicable\n" +
  "5. Responsive verification:\n" +
  "   - Check all pages at 768px: table horizontal scroll, modal fullscreen, menu drawer, form vertical stack\n" +
  "6. S006 requirements verification:\n" +
  "   - Read docs/S006-Vue端功能需求清单.md\n" +
  "   - Verify every listed page is accessible and functional\n" +
  "7. Build verification:\n" +
  "   - Run npx vue-tsc -b (must pass with zero errors)\n" +
  "   - Run npx vite build (must pass with zero errors, zero warnings)\n" +
  "8. License audit:\n" +
  "   - Check all 17 dependencies in package.json are MIT or Apache 2.0 only\n" +
  "\n" +
  "## Acceptance (G5-G8 Gate)\n" +
  "- G5: All S006 pages accessible and functional\n" +
  "- G6: All 57 swagger.json endpoints have matching API functions\n" +
  "- G7: npm run build zero errors zero warnings\n" +
  "- G8: All 17 deps MIT/Apache 2.0\n" +
  "\n" +
  "Return JSON: { taskId: 'B7', ok: boolean, filesCreated: string[], typeCheckPassed: boolean, buildPassed: boolean, notes: string }"

// ============================================================
// Execute all Phase B tasks in parallel
// ============================================================

const B_TASKS = [
  { prompt: B1_PROMPT, label: 'B1-Role-Management', phaseTitle: 'B1 Role Mgmt' },
  { prompt: B2_PROMPT, label: 'B2-Profile-Auth', phaseTitle: 'B2 Profile+Auth' },
  { prompt: B3_PROMPT, label: 'B3-Tenant-Management', phaseTitle: 'B3 Tenant Mgmt' },
  { prompt: B4_PROMPT, label: 'B4-Permission-Modal', phaseTitle: 'B4 Permission Modal' },
  { prompt: B5_PROMPT, label: 'B5-Feature-Modal', phaseTitle: 'B5 Feature Modal' },
  { prompt: B6_PROMPT, label: 'B6-Settings', phaseTitle: 'B6 Settings' },
  { prompt: B7_PROMPT, label: 'B7-Integration', phaseTitle: 'B7 Integration' },
]

log('Launching all 7 Phase B tasks in parallel...')

const bResults = await parallel(
  B_TASKS.map(function(t) {
    return function() {
      return agent(t.prompt, {
        schema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            ok: { type: 'boolean' },
            filesCreated: { type: 'array', items: { type: 'string' } },
            typeCheckPassed: { type: 'boolean' },
            buildPassed: { type: 'boolean' },
            notes: { type: 'string' },
          },
          required: ['taskId', 'ok'],
        },
        label: t.label,
        phase: t.phaseTitle,
      })
    }
  })
)

// Summarize results
var completed = bResults.filter(function(r) { return r && r.ok }).length
var failed = bResults.filter(function(r) { return !r || !r.ok })
var totalFiles = bResults.reduce(function(sum, r) { return sum + (r && r.filesCreated ? r.filesCreated.length : 0) }, 0)

log('Phase B complete: ' + completed + '/7 tasks passed, ' + failed.length + ' failed, ' + totalFiles + ' files created')

if (failed.length > 0) {
  var failIds = failed.map(function(r) { return r ? r.taskId : 'null' }).join(', ')
  log('FAIL: ' + failed.length + ' Phase B task(s) failed: ' + failIds)
}

return {
  phase: 'B',
  ok: failed.length === 0,
  completed: completed,
  failed: failed.length,
  totalFiles: totalFiles,
  results: bResults,
}
