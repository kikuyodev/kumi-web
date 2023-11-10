export enum Permissions {    
    MANAGE_ACCOUNTS = 1 << 0,
    MANAGE_GROUPS = 1 << 1,
    MANAGE_CHARTS = 1 << 2,
    MODERATE_ACCOUNTS = 1 << 3,
    MODERATE_CHARTS = 1 << 3,
    NOMINATE_CHARTS = 1 << 4,
    DISQUALIFY_CHARTS = 1 << 5,
}

export class PermissionsUtils {
    static hasPermission(permissions: number, permission: Permissions): boolean {
        return (permissions & permission) === permission;
    }
}