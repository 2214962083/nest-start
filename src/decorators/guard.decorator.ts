import {SetMetadata} from '@nestjs/common'
import {Permission} from '@app/enums'
import * as META from '@app/constants/meta.constant'

/**
 * 路由权限守卫
 * @remarks 实现方法在 `@app/guards/permission.guard.ts`
 * @example ```@guard(Permission.HOTEL_MANAGE_BASE, Permission.HOTEL_RECORD)```
 */
export const guards = (...permissions: Permission[]) =>
  SetMetadata(META.GUARD_PERMISSIONS, permissions.concat(Permission.ROOT))
