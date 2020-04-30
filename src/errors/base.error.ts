import {HttpException, HttpStatus} from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'
import {HttpMessage, HttpResOptions} from '@app/interfaces'
import {ServiceCode} from '@app/enums'
import {isNil, merge} from 'lodash'
import {isObject} from 'util'
import {ParamsError} from '@app/interfaces'

export type HttpErrorArrayArgs = [HttpMessage, (Error | string | ParamsError[])?, ServiceCode?]
export type HttpErrorObjectArgs = {
  code?: ServiceCode
  message?: HttpMessage
  error?: Error | string | ParamsError[]
}

/**
 * 基础错误构造器
 */
export class HttpBaseError extends HttpException {
  constructor(
    defaultRes: HttpResOptions,
    defaultStatus: HttpStatus,
    ...args: HttpErrorArrayArgs | [HttpErrorObjectArgs] | never[]
  ) {
    const valueIsHttpErrorArrayArgs = (value: unknown[]): value is HttpErrorArrayArgs => !isObject(value[0])

    let res: HttpResOptions
    if (valueIsHttpErrorArrayArgs(args)) {
      res = {
        code: !isNil(args[2]) ? args[2] : defaultRes.code,
        message: !isNil(args[0]) ? args[0] : defaultRes.message,
        error: !isNil(args[1]) ? (args[1] as Error).message || (args[1] as string | ParamsError[]) : defaultRes.error,
      }
    } else {
      res = merge(
        {},
        {
          code: ServiceCode.ERROR,
          message: TEXT.HTTP_BASE_ERROR_DEFAULT_MESSAGE,
          error: '',
        },
        defaultRes,
        res,
      )
    }
    super(res, defaultStatus || HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
