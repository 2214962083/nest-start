import {HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpResOptions} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {HttpBaseError, HttpErrorArrayArgs, HttpErrorObjectArgs} from './base.error'

/**
 * 错误构造器，不正确的请求
 * @remarks 400 --> 请求不合法
 * @example
 * ```ts
 * new HttpBadRequestError('错误信息', new Error(), ServiceCode.ERROR)
 *
 * new HttpBadRequestError({
 *  code: ServiceCode.ERROR,
 *  message: '错误的请求',
 *  error: new Error()
 * })
 * ```
 */
export class HttpBadRequestError extends HttpBaseError {
  constructor(...args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]) {
    const defaultRes: HttpResOptions = {
      code: ServiceCode.ERROR,
      message: TEXT.HTTP_BAD_REQUEST_ERROR_DEFAULT_MESSAGE,
      error: '',
    }
    super(defaultRes, HttpStatus.BAD_REQUEST, ...args)
  }
}
