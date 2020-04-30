import {HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpResOptions, HttpMessage, ParamsError} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {HttpBaseError, HttpErrorArrayArgs, HttpErrorObjectArgs} from './base.error'
import {isObject, isNil} from 'lodash'

export type HttpCustomErrorArrayArgs = [HttpMessage, (Error | string | ParamsError[])?, ServiceCode?, HttpStatus?]

/**
 * 自定义错误构造器
 * @remarks 默认 500 --> 服务器出错
 * @example
 * ```ts
 * new HttpCustomError('错误信息', new Error(), ServiceCode.ERROR, 403)
 *
 * new HttpCustomError({
 *  code: ServiceCode.ERROR,
 *  message: '错误的请求',
 *  error: new Error()
 * }, 403)
 * ```
 */
export class HttpCustomError extends HttpBaseError {
  constructor(...args: HttpCustomErrorArrayArgs | [HttpErrorObjectArgs, HttpStatus] | never[]) {
    const valueIsHttpCustomErrorArrayArgs = (value: unknown[]): value is HttpCustomErrorArrayArgs => !isObject(value[0])

    let statusCode: HttpStatus
    let _args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]
    const defaultStatusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR

    if (valueIsHttpCustomErrorArrayArgs(args)) {
      statusCode = !isNil(args[3]) ? args[3] : defaultStatusCode
      _args = args.slice(0, args.length >= 3 ? 3 : args.length) as HttpErrorArrayArgs
    } else {
      statusCode = !isNil(args[1]) ? args[1] : defaultStatusCode
      _args = [args[0]]
    }

    const defaultRes: HttpResOptions = {
      code: ServiceCode.ERROR,
      message: TEXT.HTTP_BAD_REQUEST_ERROR_DEFAULT_MESSAGE,
      error: '',
    }
    super(defaultRes, statusCode, ..._args)
  }
}
