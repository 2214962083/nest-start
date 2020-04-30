import {Injectable, NestInterceptor, CallHandler, ExecutionContext, Logger} from '@nestjs/common'
import {Observable} from 'rxjs'
import {HttpResSuccess, HttpMessage} from '@app/interfaces'
import {Reflector} from '@nestjs/core'
import {map} from 'rxjs/operators'
import {ServiceCode} from '@app/enums'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'

/**
 * 从装饰器生成响应数据
 * @remarks 此处的错误不用处理，因为有 `@app/interceptors/error.interceptor.ts` 拦截
 * 转换响应数据格式，此处仅处理非错误类响应
 * 要配合 @app/decorator/http.decorator.ts 定义
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, HttpResSuccess<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<HttpResSuccess<T>> {
    const target = context.getHandler()
    const code = ServiceCode.SUCCESS
    const message =
      this.reflector.get<HttpMessage>(META.HTTP_DECORATOR_SUCCESS_MESSAGE, target) ||
      TEXT.HTTP_DECORATOR_DEFAULT_SUCCESS_MESSAGE
    return next.handle().pipe(
      map((data: any) => {
        Logger.log(`${message} ${JSON.stringify(data, null, 4)}`, 'TransformInterceptor')
        const result = data
        const response: HttpResSuccess<T> = {
          code,
          message,
          error: '',
          result,
        }
        return response
      }),
    )
  }
}
