import {HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpResOptions} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {HttpBaseError, HttpErrorArrayArgs, HttpErrorObjectArgs} from './base.error'

/**
 * 错误构造器，内部实现错误的请求
 * @remarks 501 --> 内部实现错误
 * @example
 * ```ts
 * new HttpNotImplementedError('错误信息', new Error(), ServiceCode.ERROR)
 *
 * new HttpNotImplementedError({
 *  code: ServiceCode.ERROR,
 *  message: '错误的请求',
 *  error: new Error()
 * })
 * ```
 */
export class HttpNotImplementedError extends HttpBaseError {
  constructor(...args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]) {
    const defaultRes: HttpResOptions = {
      code: ServiceCode.ERROR,
      message: TEXT.HTTP_NOT_IMPLEMENTED_ERROR_DEFAULT_MESSAGE,
      error: '',
    }
    super(defaultRes, HttpStatus.NOT_IMPLEMENTED, ...args)
  }
}
