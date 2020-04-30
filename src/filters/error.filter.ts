import {Catch, HttpException, ExceptionFilter, ArgumentsHost, HttpStatus, Logger} from '@nestjs/common'
import {HttpMessage, HttpResOptions} from '@app/interfaces'
import {FastifyReply} from 'fastify'
import {isNil} from 'lodash'
import {ServiceCode} from '@app/enums'
import {config} from '@app/config'
import {Enviornment} from '@app/enums'
import {ParamsError} from '@app/interfaces'

/**
 * 全局异常过滤器
 * @remarks 全局错误重包装, 可以在此重新封装响应的 error 格式, 也可以做些日志记录之类的
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // 断言某值是 HttpException 类型
  private valueIsHttpException = (value: any): value is HttpException => value && value instanceof HttpException

  catch(exception: HttpException | Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    // const request = ctx.getRequest()
    const response: FastifyReply<HttpResOptions> = ctx.getResponse()
    const status = (this.valueIsHttpException(exception) && exception.getStatus()) || HttpStatus.INTERNAL_SERVER_ERROR

    // 原始错误体
    const errRes: HttpResOptions | string =
      (this.valueIsHttpException(exception) && (exception.getResponse() as HttpResOptions)) ||
      exception.message ||
      exception ||
      ''

    // 业务错误码
    const code: ServiceCode = isNil((errRes as HttpResOptions).code)
      ? ServiceCode.ERROR
      : (errRes as HttpResOptions).code

    // 错误 message
    const errMessage = isNil((errRes as HttpResOptions).message)
      ? (errRes as HttpMessage)
      : (errRes as HttpResOptions).message

    // 具体错误
    const error = isNil((errRes as HttpResOptions).error)
      ? (errRes as string | ParamsError[])
      : (errRes as HttpResOptions).error

    // 最终响应的错误体
    const data: HttpResOptions = {
      code: code || ServiceCode.ERROR,
      message: errMessage,
      error,
      debug: exception.stack || null,
    }

    // 非开发环境就删调 debug 属性，该属性详细存着 第xxx行出错提示
    if (config.env !== Enviornment.development) delete data.debug

    // 对 404 资源进行特殊处理
    // if (status === HttpStatus.NOT_FOUND) {
    //   data.error = '资源不存在'
    //   data.message = `接口${request.method} -> ${request.url} 无效`
    // }

    // 打印错误日志
    Logger.error(`异常过滤器：${JSON.stringify(errRes, null, 4)}`, 'HttpExceptionFilter', 'HttpExceptionFilter')

    // 丢给前端
    return response.code(status).send(data)
  }
}
