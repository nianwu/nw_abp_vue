/** 将 ABP 验证错误数组转为字段名索引的 Map */
function mapValidationErrors(errors) {
    const map = {};
    if (!errors)
        return map;
    for (const e of errors) {
        const msg = e.message || 'Validation error';
        if (e.members && e.members.length > 0) {
            for (const member of e.members) {
                if (!map[member])
                    map[member] = [];
                map[member].push(msg);
            }
        }
        else {
            if (!map['_general'])
                map['_general'] = [];
            map['_general'].push(msg);
        }
    }
    return map;
}
/** 从 axios 响应中提取 ABP 业务错误 */
export function parseAbpError(error) {
    const e = error;
    const info = e.abpError || e.response?.data;
    if (!info)
        return null;
    return {
        code: info.code,
        message: info.message,
        details: info.details,
        fieldErrors: mapValidationErrors(info.validationErrors),
    };
}
