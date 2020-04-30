import {Injectable, NestInterceptor, CallHandler, ExecutionContext, HttpStatus, Logger, Catch} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {HttpCustomError} from '@app/errors/custom.error'
import {ServiceCode} from '@app/enums'
import {HttpResOptions, HttpMessage} from '@app/interfaces'
import {isEmpty} from 'lodash'
import * as META from '@app/constants/meta.constant'

/**
 * dto 校验出错的错误格式
 */
interface ValidateError {
  response: HttpResOptions
  status: HttpStatus
  message: HttpMessage
  HttpValidationError?: string
}

/**
 * sql 出错的错误格式
 */
interface SqlError {
  message: string
  code: string
  errno: number
  sqlMessage: string
  sqlState: string
  index: number
  sql: string
  name: string
  query: string
  parameters: string[]
  QueryFaildError?: string
}

export type CatchError = ValidateError | SqlError

const valueIsValidateError = (value: any): value is ValidateError => !isEmpty(value.response)

/**
 * 对 controller 响应流里的错误进行捕获
 * @remarks 错误拦截器, 负责拦截 controller 处装饰器定义的响应
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const target = context.getHandler()
    const statusCode = this.reflector.get<HttpStatus>(META.HTTP_DECORATOR_ERROR_STATUS, target)
    const message = this.reflector.get<HttpMessage>(META.HTTP_DECORATOR_ERROR_MESSAGE, target)
    const code = ServiceCode.ERROR
    if (!message) return next.handle()
    return next.handle().pipe(
      catchError((error: CatchError) => {
        Logger.debug(`${message} ${JSON.stringify(error, null, 4)}`, 'ErrorInterceptor')
        return throwError(
          new HttpCustomError(
            {
              code,
              message: message + (valueIsValidateError(error) ? `, ${error.response.message}` : ''),
              error: valueIsValidateError(error) ? error.response.error : error.message,
            },
            statusCode || (valueIsValidateError(error) && error.status) || HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        )
      }),
    )
  }
}
