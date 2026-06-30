const toggleType = { name: 'ToggleStringValueType', properties: {}, validator: { name: 'NULL', properties: {} } };
const freeTextType = { name: 'FreeTextStringValueType', properties: {}, validator: { name: 'NULL', properties: {} } };
const selectionType = { name: 'SelectionStringValueType', properties: {}, validator: { name: 'NULL', properties: {} } };
const featureTree = [
    {
        name: 'Identity',
        displayName: '身份功能',
        features: [
            {
                name: 'Abp.Identity.TwoFactor',
                displayName: '双因素认证',
                parentName: null,
                description: '启用双因素认证功能',
                value: 'true',
                depth: 0,
                valueType: toggleType,
                provider: null,
            },
            {
                name: 'Abp.Identity.MaxUserCount',
                displayName: '最大用户数',
                parentName: null,
                description: '允许创建的最大用户数量',
                value: '100',
                depth: 0,
                valueType: freeTextType,
                provider: null,
            },
            {
                name: 'Abp.Identity.PasswordComplexity',
                displayName: '密码复杂度',
                parentName: null,
                description: '密码复杂度要求',
                value: 'Standard',
                depth: 0,
                valueType: selectionType,
                provider: null,
            },
        ],
    },
    {
        name: 'TenantManagement',
        displayName: '租户功能',
        features: [
            {
                name: 'Abp.TenantManagement.AllowSelfRegistration',
                displayName: '允许自助注册租户',
                parentName: null,
                description: '允许用户自行注册租户',
                value: 'false',
                depth: 0,
                valueType: toggleType,
                provider: null,
            },
        ],
    },
];
export function mockGetFeatures() {
    return { groups: featureTree };
}
