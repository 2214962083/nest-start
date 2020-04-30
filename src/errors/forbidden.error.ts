import {HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpResOptions} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {HttpBaseError, HttpErrorArrayArgs, HttpErrorObjectArgs} from './base.error'

/**
 * 错误构造器，权限不足
 * @remarks 403 --> 无权限/权限不足
 * @example
 * ```ts
 * new HttpForbiddenError('错误信息', new Error(), ServiceCode.ERROR)
 *
 * new HttpForbiddenError({
 *  code: ServiceCode.ERROR,
 *  message: '错误的请求',
 *  error: new Error()
 * })
 * ```
 */
export class HttpForbiddenError extends HttpBaseError {
  constructor(...args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]) {
    const defaultRes: HttpResOptions = {
      code: ServiceCode.ERROR,
      message: TEXT.HTTP_FORBIDDEN_ERROR_DEFAULT_MESSAGE,
      error: '',
    }
    super(defaultRes, HttpStatus.FORBIDDEN, ...args)
  }
}
