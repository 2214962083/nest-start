import {Permission} from '@app/enums'

/**
 * token加解密信息
 * @userId 用户id
 * @roles 用户角色
 * @permissions 用户权限（不参与加解密，解密后查询得到）
 */
export interface JwtPayload {
  userId: number
  roles: string[]
  permissions?: Permission[]
}
