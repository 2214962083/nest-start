/**
 * 权限枚举，具有 root 权限的无视一切
 */
export enum Permission {
  ROOT = 'root',
  NORMAL = 'normal',
  ROLE_MANAGER = 'role_manager',
  PERMISSION_MANAGER = 'permission_manager',
}
