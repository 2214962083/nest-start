import {HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpMessage, HttpResOptions} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {HttpBaseError, HttpErrorArrayArgs, HttpErrorObjectArgs} from './base.error'

/**
 * 错误构造器，权限验证失败
 * @remarks 401 --> 未授权/未登录/权限验证失败
 * @example
 * ```ts
 * new HttpUnauthorizedError('错误信息', new Error(), ServiceCode.ERROR)
 *
 * new HttpUnauthorizedError({
 *  code: ServiceCode.ERROR,
 *  message: '错误的请求',
 *  error: new Error()
 * })
 * ```
 */
export class HttpUnauthorizedError extends HttpBaseError {
  constructor(...args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]) {
    const defaultRes: HttpResOptions = {
      code: ServiceCode.ERROR,
      message: TEXT.HTTP_UNAUTHORIZED_ERROR_DEFAULT_MESSAGE,
      error: '',
    }
    super(defaultRes, HttpStatus.UNAUTHORIZED, ...args)
  }
}
