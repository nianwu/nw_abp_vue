/**
 * ABP Account 模块类型定义
 *
 * ⚠️ @generated — 临时手写。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此目录全部文件。
 */
export var LoginResultType;
(function (LoginResultType) {
    LoginResultType[LoginResultType["Success"] = 1] = "Success";
    LoginResultType[LoginResultType["InvalidUserNameOrPassword"] = 2] = "InvalidUserNameOrPassword";
    LoginResultType[LoginResultType["NotAllowed"] = 3] = "NotAllowed";
    LoginResultType[LoginResultType["LockedOut"] = 4] = "LockedOut";
    LoginResultType[LoginResultType["RequiresTwoFactor"] = 5] = "RequiresTwoFactor";
})(LoginResultType || (LoginResultType = {}));
