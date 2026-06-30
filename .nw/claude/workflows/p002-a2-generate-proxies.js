export const meta = {
  name: 'p002-a2-generate-proxies',
  description: 'Generate TypeScript types and API proxy files for all 7 ABP modules from extracted swagger.json data',
  phases: [
    { title: 'Types', detail: 'Generate type definition files for all 7 modules' },
    { title: 'API Proxies', detail: 'Generate API proxy files for all 7 modules' },
    { title: 'Verify', detail: 'TypeScript check against existing code' },
  ],
}

// ============================================================
// Shared: Base types for api.ts and abp.ts
// ============================================================
phase('Types')

const MODULES = [
  {
    name: 'identity',
    prompt: "Create the file vue/src/types/identity.ts with COMPLETE TypeScript type definitions for ABP Identity module DTOs.\n" +
      "\n" +
      "## Types to create (exact swagger.json property names):\n" +
      "1. IdentityUserDto — id(string), creationTime(string, date-time), creatorId(string|null), lastModificationTime(string|null), lastModifierId(string|null), isDeleted(boolean), deleterId(string|null), deletionTime(string|null), lastPasswordChangeTime(string|null), tenantId(string|null), userName(string|null), name(string|null), surname(string|null), email(string|null), emailConfirmed(boolean), phoneNumber(string|null), phoneNumberConfirmed(boolean), isActive(boolean), lockoutEnabled(boolean), accessFailedCount(number), entityVersion(number), concurrencyStamp(string|null), extraProperties(Record<string,unknown>, readOnly), lockoutEnd(string|null)\n" +
      "2. IdentityUserCreateDto — userName(string, REQUIRED), name(string|null), surname(string|null), email(string, email, REQUIRED), phoneNumber(string|null), isActive(boolean), lockoutEnabled(boolean), roleNames(string[]|null), password(string, REQUIRED), extraProperties(Record<string,unknown>)\n" +
      "3. IdentityUserUpdateDto — userName(string, REQUIRED), name(string|null), surname(string|null), email(string, email, REQUIRED), phoneNumber(string|null), isActive(boolean), lockoutEnabled(boolean), roleNames(string[]|null), password(string|null), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "4. IdentityUserUpdateRolesDto — roleNames(string[], REQUIRED)\n" +
      "5. IdentityRoleDto — id(string), name(string|null), isDefault(boolean), isStatic(boolean), isPublic(boolean), creationTime(string), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "6. IdentityRoleCreateDto — name(string, REQUIRED), isDefault(boolean), isPublic(boolean), extraProperties(Record<string,unknown>)\n" +
      "7. IdentityRoleUpdateDto — name(string, REQUIRED), isDefault(boolean), isPublic(boolean), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "8. UserData — id(string), tenantId(string|null), userName(string|null), name(string|null), surname(string|null), email(string|null), emailConfirmed(boolean), phoneNumber(string|null), phoneNumberConfirmed(boolean), isActive(boolean), extraProperties(Record<string,unknown>)\n" +
      "\n" +
      "## Rules\n" +
      "- Use standard TypeScript interfaces\n" +
      "- Optional/nullable fields use `?:` or `| null`\n" +
      "- READ the existing vue/src/types/abp.ts and vue/src/types/api.ts for reference patterns\n" +
      "- Add JSDoc comment at top: @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖\n" +
      "- Export all interfaces\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
  {
    name: 'tenant',
    prompt: "Create the file vue/src/types/tenant.ts with TypeScript type definitions for ABP Tenant Management module.\n" +
      "\n" +
      "## Types (exact swagger property names):\n" +
      "1. TenantDto — id(string), name(string|null), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "2. TenantCreateDto — name(string, REQUIRED), adminEmailAddress(string, email, REQUIRED), adminPassword(string, REQUIRED), extraProperties(Record<string,unknown>)\n" +
      "3. TenantUpdateDto — name(string, REQUIRED), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "4. FindTenantResultDto — success(boolean), tenantId(string|null), name(string|null), normalizedName(string|null), isActive(boolean)\n" +
      "\n" +
      "## Rules\n" +
      "- Match existing code style in vue/src/types/abp.ts\n" +
      "- JSDoc: @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
  {
    name: 'account',
    prompt: "Create the file vue/src/types/account.ts with TypeScript type definitions for ABP Account module.\n" +
      "\n" +
      "## Types:\n" +
      "1. ProfileDto — userName(string|null), email(string|null), name(string|null), surname(string|null), phoneNumber(string|null), hasPassword(boolean), isExternal(boolean), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "2. UpdateProfileDto — userName(string|null), email(string|null), name(string|null), surname(string|null), phoneNumber(string|null), concurrencyStamp(string|null), extraProperties(Record<string,unknown>)\n" +
      "3. ChangePasswordInput — currentPassword(string|null), newPassword(string)\n" +
      "4. RegisterDto — userName(string), emailAddress(string, email), password(string), appName(string), extraProperties(Record<string,unknown>)\n" +
      "5. ResetPasswordDto — userId(string), resetToken(string), password(string)\n" +
      "6. SendPasswordResetCodeDto — email(string, email), appName(string), returnUrl(string|null), returnUrlHash(string|null)\n" +
      "7. VerifyPasswordResetTokenInput — userId(string), resetToken(string)\n" +
      "8. UserLoginInfo — userNameOrEmailAddress(string), password(string), rememberMe(boolean)\n" +
      "9. AbpLoginResult — result(LoginResultType), description(string|null, readOnly)\n" +
      "10. LoginResultType — enum: 1=Success, 2=InvalidUserNameOrPassword, 3=NotAllowed, 4=LockedOut, 5=RequiresTwoFactor\n" +
      "\n" +
      "## Rules\n" +
      "- Match existing code style\n" +
      "- JSDoc: @generated — 临时手写\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
  {
    name: 'permission',
    prompt: "Create the file vue/src/types/permission.ts with TypeScript type definitions for ABP Permission Management module.\n" +
      "\n" +
      "## Types:\n" +
      "1. GetPermissionListResultDto — entityDisplayName(string|null), groups(PermissionGroupDto[]|null)\n" +
      "2. PermissionGroupDto — name(string|null), displayName(string|null), displayNameKey(string|null), displayNameResource(string|null), permissions(PermissionGrantInfoDto[]|null)\n" +
      "3. PermissionGrantInfoDto — name(string|null), displayName(string|null), parentName(string|null), isGranted(boolean), isEditable(boolean), allowedProviders(string[]|null), grantedProviders(ProviderInfoDto[]|null)\n" +
      "4. ProviderInfoDto — providerName(string|null), providerKey(string|null)\n" +
      "5. UpdatePermissionDto — name(string|null), isGranted(boolean)\n" +
      "6. UpdatePermissionsDto — permissions(UpdatePermissionDto[]|null)\n" +
      "7. UpdateResourcePermissionsDto — providerName(string|null), providerKey(string|null), permissions(string[]|null)\n" +
      "8. GetResourcePermissionDefinitionListResultDto — permissions(ResourcePermissionDefinitionDto[]|null)\n" +
      "9. ResourcePermissionDefinitionDto — name(string|null), displayName(string|null)\n" +
      "10. GetResourcePermissionListResultDto — permissions(ResourcePermissionGrantInfoDto[]|null)\n" +
      "11. ResourcePermissionGrantInfoDto — providerName(string|null), providerNameDisplayName(string|null), providerDisplayName(string|null), providerKey(string|null), permissions(GrantedResourcePermissionDto[]|null)\n" +
      "12. GrantedResourcePermissionDto — name(string|null), displayName(string|null)\n" +
      "13. GetResourcePermissionWithProviderListResultDto — permissions(ResourcePermissionWithProdiverGrantInfoDto[]|null)\n" +
      "14. ResourcePermissionWithProdiverGrantInfoDto — name(string|null), displayName(string|null), isGranted(boolean), providers(string[]|null)\n" +
      "15. GetResourceProviderListResultDto — providers(ResourceProviderDto[]|null)\n" +
      "16. ResourceProviderDto — name(string|null), displayName(string|null)\n" +
      "17. SearchProviderKeyListResultDto — keys(SearchProviderKeyInfo[]|null)\n" +
      "18. SearchProviderKeyInfo — providerKey(string|null), providerDisplayName(string|null)\n" +
      "\n" +
      "## Rules: Match existing style, JSDoc @generated.\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
  {
    name: 'feature',
    prompt: "Create the file vue/src/types/feature.ts with TypeScript type definitions for ABP Feature Management module.\n" +
      "\n" +
      "## Types:\n" +
      "1. GetFeatureListResultDto — groups(FeatureGroupDto[]|null)\n" +
      "2. FeatureGroupDto — name(string|null), displayName(string|null), features(FeatureDto[]|null)\n" +
      "3. FeatureDto — name(string|null), displayName(string|null), parentName(string|null), description(string|null), value(string|null), depth(number), valueType(IStringValueType), provider(FeatureProviderDto|null)\n" +
      "4. FeatureProviderDto — name(string|null), key(string|null)\n" +
      "5. IStringValueType — name(string, readOnly), properties(Record<string,unknown>, readOnly), validator(IValueValidator)\n" +
      "6. IValueValidator — name(string, readOnly), properties(Record<string,unknown>, readOnly)\n" +
      "7. UpdateFeatureDto — name(string|null), value(string|null)\n" +
      "8. UpdateFeaturesDto — features(UpdateFeatureDto[]|null)\n" +
      "\n" +
      "## Rules: Match existing style, JSDoc @generated.\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
  {
    name: 'settings',
    prompt: "Create the file vue/src/types/settings.ts with TypeScript type definitions for ABP Setting Management module.\n" +
      "\n" +
      "## Types:\n" +
      "1. EmailSettingsDto — smtpHost(string|null), smtpPort(number), smtpUserName(string|null), smtpPassword(string|null), smtpDomain(string|null), smtpEnableSsl(boolean), smtpUseDefaultCredentials(boolean), defaultFromAddress(string|null), defaultFromDisplayName(string|null)\n" +
      "2. UpdateEmailSettingsDto — smtpHost(string|null), smtpPort(number), smtpUserName(string|null), smtpPassword(string|null), smtpDomain(string|null), smtpEnableSsl(boolean), smtpUseDefaultCredentials(boolean), defaultFromAddress(string), defaultFromDisplayName(string)\n" +
      "3. SendTestEmailInput — subject(string), body(string|null), senderEmailAddress(string), targetEmailAddress(string)\n" +
      "\n" +
      "## Rules: Match existing style, JSDoc @generated.\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
]

// Generate all type files in parallel
const typeResults = await parallel(
  MODULES.map(function(m) {
    return function() {
      return agent(m.prompt, {
        schema: { type: 'object', properties: { ok: { type: 'boolean' }, filesCreated: { type: 'array', items: { type: 'string' } } }, required: ['ok'] },
        label: 'types-' + m.name,
        phase: 'Types',
        effort: 'low',
      })
    }
  })
)

log('Types created: ' + typeResults.filter(Boolean).length + '/6 modules')

// ============================================================
// Phase: API Proxy files
// ============================================================
phase('API Proxies')

// Read the http.ts to understand the pattern
// Each proxy file imports httpClient and defines typed functions
// Pattern: import { httpClient } from './http'; import type { XXX } from '@/types/xxx';

const API_MODULES = [
  {
    name: 'identity-users',
    prompt: "Create the file vue/src/api/identity-users.ts — ABP Identity Users API proxy.\n" +
      "\n" +
      "## Pattern (follow exactly):\n" +
      "```ts\n" +
      "import { httpClient } from './http'\n" +
      "import type { PagedResultDto } from '@/types/api'\n" +
      "import type { IdentityUserDto, IdentityUserCreateDto, IdentityUserUpdateDto, IdentityUserUpdateRolesDto, IdentityRoleDto, UserData } from '@/types/identity'\n" +
      "import type { ListResultDto } from '@/types/api'\n" +
      "\n" +
      "// All functions are pure, exported, typed\n" +
      "const BASE = '/api/identity/users'\n" +
      "```\n" +
      "\n" +
      "## Functions (from swagger.json paths):\n" +
      "1. getUsers(params?: { filter?, sorting?, skipCount?, maxResultCount? }) → httpClient.get<PagedResultDto<IdentityUserDto>>(BASE, { params })\n" +
      "2. createUser(data: IdentityUserCreateDto) → httpClient.post<IdentityUserDto>(BASE, data)\n" +
      "3. getUser(id: string) → httpClient.get<IdentityUserDto>(`${BASE}/${id}`)\n" +
      "4. updateUser(id: string, data: IdentityUserUpdateDto) → httpClient.put<IdentityUserDto>(`${BASE}/${id}`, data)\n" +
      "5. deleteUser(id: string) → httpClient.delete(`${BASE}/${id}`)\n" +
      "6. getAssignableRoles() → httpClient.get<ListResultDto<IdentityRoleDto>>(`${BASE}/assignable-roles`)\n" +
      "7. getUserByEmail(email: string) → httpClient.get<IdentityUserDto>(`${BASE}/by-email/${email}`)\n" +
      "8. getUserByUsername(userName: string) → httpClient.get<IdentityUserDto>(`${BASE}/by-username/${userName}`)\n" +
      "9. getUserRoles(id: string) → httpClient.get<ListResultDto<IdentityRoleDto>>(`${BASE}/${id}/roles`)\n" +
      "10. updateUserRoles(id: string, data: IdentityUserUpdateRolesDto) → httpClient.put(`${BASE}/${id}/roles`, data)\n" +
      "11. lookupUser(id: string) → httpClient.get<UserData>(`${BASE}/lookup/${id}`)\n" +
      "12. lookupUserByUsername(userName: string) → httpClient.get<UserData>(`${BASE}/lookup/by-username/${userName}`)\n" +
      "13. searchUsers(params?: { filter?, sorting?, skipCount?, maxResultCount? }) → httpClient.get<ListResultDto<UserData>>(`${BASE}/lookup/search`, { params })\n" +
      "14. getUserLookupCount(params?: { filter? }) → httpClient.get<number>(`${BASE}/lookup/count`, { params })\n" +
      "\n" +
      "## Rules\n" +
      "- READ vue/src/api/http.ts first to understand the httpClient export\n" +
      "- JSDoc: @generated — 临时手写，后端可用时用 abp generate-proxy 覆盖\n" +
      "- Export all functions individually (NOT as default export)\n" +
      "Return JSON: { ok: boolean, filesCreated: string[] }"
  },
  {
    name: 'identity-roles',
    prompt: "Create vue/src/api/identity-roles.ts — ABP Identity Roles API proxy.\n" +
      "Pattern: import { httpClient } from './http'; import types from '@/types/identity' and '@/types/api'.\n" +
      "BASE = '/api/identity/roles'\n" +
      "Functions:\n" +
      "1. getRoles(params?) → GET {BASE} → PagedResultDto<IdentityRoleDto>\n" +
      "2. createRole(data: IdentityRoleCreateDto) → POST {BASE} → IdentityRoleDto\n" +
      "3. getAllRoles() → GET {BASE}/all → ListResultDto<IdentityRoleDto>\n" +
      "4. getRole(id: string) → GET {BASE}/{id} → IdentityRoleDto\n" +
      "5. updateRole(id: string, data: IdentityRoleUpdateDto) → PUT {BASE}/{id} → IdentityRoleDto\n" +
      "6. deleteRole(id: string) → DELETE {BASE}/{id} → void\n" +
      "JSDoc @generated. Export individually. Return JSON: { ok, filesCreated }."
  },
  {
    name: 'account',
    prompt: "Create vue/src/api/account.ts — ABP Account API proxy.\n" +
      "Import httpClient, types from '@/types/account', '@/types/identity'.\n" +
      "Functions:\n" +
      "1. register(data: RegisterDto) → POST /api/account/register → IdentityUserDto\n" +
      "2. sendPasswordResetCode(data: SendPasswordResetCodeDto) → POST /api/account/send-password-reset-code → void\n" +
      "3. verifyPasswordResetToken(data: VerifyPasswordResetTokenInput) → POST /api/account/verify-password-reset-token → void\n" +
      "4. resetPassword(data: ResetPasswordDto) → POST /api/account/reset-password → void\n" +
      "5. login(data: UserLoginInfo) → POST /api/account/login → AbpLoginResult\n" +
      "6. logout() → GET /api/account/logout → void\n" +
      "7. checkPassword(data: UserLoginInfo) → POST /api/account/check-password → AbpLoginResult\n" +
      "8. getProfile() → GET /api/account/my-profile → ProfileDto\n" +
      "9. updateProfile(data: UpdateProfileDto) → PUT /api/account/my-profile → ProfileDto\n" +
      "10. changePassword(data: ChangePasswordInput) → POST /api/account/my-profile/change-password → void\n" +
      "11. refreshDynamicClaims() → POST /api/account/dynamic-claims/refresh → void\n" +
      "JSDoc @generated. Export individually. Return JSON: { ok, filesCreated }."
  },
  {
    name: 'tenant',
    prompt: "Create vue/src/api/tenant.ts — ABP Tenant Management API proxy.\n" +
      "Import httpClient, types from '@/types/tenant', '@/types/api'.\n" +
      "BASE = '/api/multi-tenancy/tenants'\n" +
      "Functions:\n" +
      "1. getTenants(params?) → GET {BASE} → PagedResultDto<TenantDto>\n" +
      "2. createTenant(data: TenantCreateDto) → POST {BASE} → TenantDto\n" +
      "3. getTenant(id: string) → GET {BASE}/{id} → TenantDto\n" +
      "4. updateTenant(id: string, data: TenantUpdateDto) → PUT {BASE}/{id} → TenantDto\n" +
      "5. deleteTenant(id: string) → DELETE {BASE}/{id} → void\n" +
      "6. getDefaultConnectionString(id: string) → GET {BASE}/{id}/default-connection-string → string\n" +
      "7. updateDefaultConnectionString(id: string, defaultConnectionString?: string) → PUT {BASE}/{id}/default-connection-string with query param → void\n" +
      "8. deleteDefaultConnectionString(id: string) → DELETE {BASE}/{id}/default-connection-string → void\n" +
      "9. findTenantById(id: string) → GET /api/abp/multi-tenancy/tenants/by-id/{id} → FindTenantResultDto\n" +
      "10. findTenantByName(name: string) → GET /api/abp/multi-tenancy/tenants/by-name/{name} → FindTenantResultDto\n" +
      "JSDoc @generated. Export individually. Return JSON: { ok, filesCreated }."
  },
  {
    name: 'permission',
    prompt: "Create vue/src/api/permission.ts — ABP Permission Management API proxy.\n" +
      "Import httpClient, types from '@/types/permission'. BASE = '/api/permission-management/permissions'\n" +
      "Functions (all take providerName? and providerKey? as query params):\n" +
      "1. getPermissions(params?: { providerName?, providerKey? }) → GET {BASE} → GetPermissionListResultDto\n" +
      "2. updatePermissions(data: UpdatePermissionsDto, params?: { providerName?, providerKey? }) → PUT {BASE} → void\n" +
      "3. getPermissionsByGroup(params: { groupName?, providerName?, providerKey? }) → GET {BASE}/by-group → GetPermissionListResultDto\n" +
      "4. getResourcePermissions(params: { resourceName?, resourceKey? }) → GET {BASE}/resource → GetResourcePermissionListResultDto\n" +
      "5. updateResourcePermissions(data: UpdateResourcePermissionsDto, params: { resourceName?, resourceKey? }) → PUT {BASE}/resource → void\n" +
      "6. deleteResourcePermission(params: { resourceName?, resourceKey?, providerName?, providerKey? }) → DELETE {BASE}/resource → void\n" +
      "7. getResourcePermissionDefinitions(params?: { resourceName? }) → GET {BASE}/resource-definitions → GetResourcePermissionDefinitionListResultDto\n" +
      "8. getResourceProviders(params?: { resourceName? }) → GET {BASE}/resource-provider-key-lookup-services → GetResourceProviderListResultDto\n" +
      "9. getResourcePermissionsByProvider(params: { resourceName?, resourceKey?, providerName?, providerKey? }) → GET {BASE}/resource/by-provider → GetResourcePermissionWithProviderListResultDto\n" +
      "10. searchResourceProviderKeys(params: { resourceName?, serviceName?, filter?, page? }) → GET {BASE}/search-resource-provider-keys → SearchProviderKeyListResultDto\n" +
      "JSDoc @generated. Export individually. Return JSON: { ok, filesCreated }."
  },
  {
    name: 'feature',
    prompt: "Create vue/src/api/feature.ts — ABP Feature Management API proxy.\n" +
      "Import httpClient, types from '@/types/feature'. BASE = '/api/feature-management/features'\n" +
      "Functions:\n" +
      "1. getFeatures(params?: { providerName?, providerKey? }) → GET {BASE} → GetFeatureListResultDto\n" +
      "2. updateFeatures(data: UpdateFeaturesDto, params?: { providerName?, providerKey? }) → PUT {BASE} → void\n" +
      "3. deleteFeatures(params?: { providerName?, providerKey? }) → DELETE {BASE} → void\n" +
      "JSDoc @generated. Export individually. Return JSON: { ok, filesCreated }."
  },
  {
    name: 'settings',
    prompt: "Create vue/src/api/settings.ts — ABP Setting Management API proxy.\n" +
      "Import httpClient, types from '@/types/settings'.\n" +
      "Functions:\n" +
      "1. getEmailSettings() → GET /api/setting-management/emailing → EmailSettingsDto\n" +
      "2. updateEmailSettings(data: UpdateEmailSettingsDto) → POST /api/setting-management/emailing → void\n" +
      "3. sendTestEmail(data: SendTestEmailInput) → POST /api/setting-management/emailing/send-test-email → void\n" +
      "4. getTimezone() → GET /api/setting-management/timezone → string\n" +
      "5. updateTimezone(timezone?: string) → POST /api/setting-management/timezone with query param → void\n" +
      "6. getTimezones() → GET /api/setting-management/timezone/timezones → string[]\n" +
      "JSDoc @generated. Export individually. Return JSON: { ok, filesCreated }."
  },
]

// Generate all API proxy files in parallel
const apiResults = await parallel(
  API_MODULES.map(function(m) {
    return function() {
      return agent(m.prompt, {
        schema: { type: 'object', properties: { ok: { type: 'boolean' }, filesCreated: { type: 'array', items: { type: 'string' } } }, required: ['ok'] },
        label: 'api-' + m.name,
        phase: 'API Proxies',
        effort: 'low',
      })
    }
  })
)

log('API proxies created: ' + apiResults.filter(Boolean).length + '/7 modules')

// ============================================================
// Phase: Verify
// ============================================================
phase('Verify')

const verifyResult = await agent(
  "Verify the TypeScript build after all type and API proxy files are created.\n" +
  "1. Run: cd vue && npx vue-tsc -b\n" +
  "2. If there are errors, read each error file and fix the issues:\n" +
  "   - Missing imports\n" +
  "   - Type mismatches\n" +
  "   - Wrong property names\n" +
  "3. Re-run until clean\n" +
  "4. Run: npx vite build\n" +
  "5. Confirm dist/ output exists\n" +
  "Return JSON: { ok: boolean, typeCheckPassed: boolean, buildPassed: boolean, errors: string[] }",
  {
    schema: { type: 'object', properties: { ok: { type: 'boolean' }, typeCheckPassed: { type: 'boolean' }, buildPassed: { type: 'boolean' }, errors: { type: 'array', items: { type: 'string' } } }, required: ['ok'] },
    label: 'verify-build',
    phase: 'Verify',
  }
)

log('Verify result: ' + JSON.stringify(verifyResult))

const allTypesOk = typeResults.filter(function(r) { return r && r.ok }).length
const allApisOk = apiResults.filter(function(r) { return r && r.ok }).length

return {
  phase: 'A2',
  ok: verifyResult && verifyResult.ok,
  typesGenerated: allTypesOk + '/6',
  apisGenerated: allApisOk + '/7',
  typeCheckPassed: verifyResult ? verifyResult.typeCheckPassed : false,
  buildPassed: verifyResult ? verifyResult.buildPassed : false,
}
