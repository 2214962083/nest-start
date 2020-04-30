import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common'
import {Observable} from 'rxjs'
import {Permission, TokenErrorType, ServiceCode} from '@app/enums'
import * as META from '@app/constants/meta.constant'
import {HttpUnauthorizedError} from '@app/errors/unauthorized.error'
import {Reflector} from '@nestjs/core'
import {intersection} from 'lodash'
import {HttpForbiddenError} from '@app/errors/forbidden.error'
import {CustomRequest} from '@app/interfaces'
import {isEmpty} from 'lodash'

/**
 * 路由守卫
 * @remarks 使用方法参考 @app/decorators/guard.decorator.ts
 */
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //debugger
    const req: CustomRequest = context.switchToHttp().getRequest<CustomRequest>()

    /**
     * 在这里打印来源日志，好处是避免 guard 抛出异常不走 interceptor
     */
    const content = req.raw.method + '->' + req.raw.url
    Logger.log(`路由验证请求：${content}`, 'DecodeTokenMiddleWare')

    return new Promise<boolean>((resolve, reject) => {
      const token = req.headers[META.USER_TOKEN]
      // 中间件传来的 token 解析
      const {user, tokenDecodeError} = req.raw
      // controller 处标注的权限
      const needPermissions: Permission[] = this.reflector.get<Permission[]>(
        META.GUARD_PERMISSIONS,
        context.getHandler(),
      )
      // 如果此 api 不用权限，则放行
      if (isEmpty(needPermissions)) return resolve(true)

      Logger.debug(`路由守卫解析出权限：${needPermissions}`, 'PermissionGuard')
      Logger.debug(`路由守卫收到token信息：${user}`, 'PermissionGuard')
      Logger.debug(`路由守卫收到token错误码为：${tokenDecodeError}`, 'PermissionGuard')

      if (!token) throw new HttpUnauthorizedError('token 不能为空')
      if (tokenDecodeError) {
        switch (tokenDecodeError) {
          case TokenErrorType.DECODE_ERROR:
            throw new HttpUnauthorizedError({
              code: ServiceCode.TOKEN_DECODE_ERROR,
              message: 'token 解析错误，请重新登录',
              error: tokenDecodeError,
            })
            break
          case TokenErrorType.NOT_ACTIVE_ERROR:
            throw new HttpUnauthorizedError({
              code: ServiceCode.TOKEN_NOT_ACTIVE_ERROR,
              message: 'token 未到激活时间，你是不是穿越了',
              error: tokenDecodeError,
            })
            break
          case TokenErrorType.TOKEN_TIME_OUT_ERROR:
            throw new HttpUnauthorizedError({
              code: ServiceCode.TOKEN_TIME_OUT_ERROR,
              message: 'token 过期了，请重新登录',
              error: tokenDecodeError,
            })
            break
          default:
            throw new HttpUnauthorizedError()
            break
        }
      }
      if (!user || !user.permissions) throw new HttpUnauthorizedError()
      // 该用户具有的角色权限
      const {permissions} = user
      // 判断用户的角色权限是否和 controller 标注处有交集
      if (intersection(needPermissions, permissions).length === 0) throw new HttpForbiddenError()
      return resolve(true)
    })
  }
}
