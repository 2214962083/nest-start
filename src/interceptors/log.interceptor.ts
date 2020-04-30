import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger} from '@nestjs/common'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {CustomRequest} from '@app/interfaces'

/**
 * 全局日志，在控制台显示每条请求响应
 * @remarks 在 `@app/main.ts` 全局使用, 用于拦截全局请求，并打印日志
 */
@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const ctx = context.switchToHttp()
    const request: CustomRequest = ctx.getRequest()
    // const response = ctx.getResponse()
    const content = request.raw.method + '->' + request.raw.url
    Logger.log(`+++ 日志记录请求：${content}`, 'LogInterceptor')
    const now = Date.now()
    return next
      .handle()
      .pipe(tap(() => Logger.log(`+++ 日志记录请求：${content} ${Date.now() - now}ms`, 'LogInterceptor')))
  }
}
