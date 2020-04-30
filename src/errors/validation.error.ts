import {HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpMessage, HttpResOptions} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {HttpBaseError, HttpErrorArrayArgs, HttpErrorObjectArgs} from './base.error'

/**
 * 错误构造器，请求参数类型校验不合格
 * @remarks 400 --> 请求参数校验有问题
 * @example
 * ```ts
 * new HttpValidationError('错误信息', new Error(), ServiceCode.ERROR)
 *
 * new HttpValidationError({
 *  code: ServiceCode.ERROR,
 *  message: '错误的请求',
 *  error: new Error()
 * })
 * ```
 */
export class HttpValidationError extends HttpBaseError {
  constructor(...args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]) {
    const defaultRes: HttpResOptions = {
      code: ServiceCode.VALIDATE_FAIL,
      message: TEXT.HTTP_VALIDATION_ERROR_DEFAULT_MESSAGE,
      error: '',
    }
    super(defaultRes, HttpStatus.BAD_REQUEST, ...args)
  }
}
