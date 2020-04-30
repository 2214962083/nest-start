import {SetMetadata, HttpStatus} from '@nestjs/common'
import {HttpMessage} from '@app/interfaces'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'
import {isObject} from 'lodash'

/**
 * 生成装饰器的配置
 */
interface BuildDecoratorOptions {
  errorStatus?: HttpStatus
  errorMessage?: HttpMessage
  successMessage?: HttpMessage
}

/**
 * 常用构建响应装饰器的配置
 */
export interface IHandleOptions {
  errorStatus?: HttpStatus
  message?: HttpMessage
}
/**
 * 常用构建响应装饰器的配置，允许简写为字符串
 */
export type THandleOptions = HttpMessage | IHandleOptions

/**
 * http 响应装饰器
 */
class HttpProcessor {
  /**
   * 断言某个值是 IHandleOptions 类型
   * @param value 要判断的值
   * @returns boolean
   */
  private isIHandleOptions = (value: THandleOptions): value is IHandleOptions => isObject(value)
  constructor() {}

  /**
   * 同时构造成功和错误响应的装饰器，懒人专用
   * @param options 常用构建响应装饰器的配置，允许简写为字符串
   * @example ```@ResProcessor.handle('获取xx数据')```
   * @example ```@ResProcessor.handle({message: '获取xx数据', errorStatus: HttpStatus.NOT_FOUND})```
   */
  handle(options: THandleOptions) {
    const message: HttpMessage = this.isIHandleOptions(options) ? options.message : options
    const errorMessage: HttpMessage = message + TEXT.HTTP_RESPONSE_ERROR_SUFFIX
    const successMessage: HttpMessage = message + TEXT.HTTP_RESPONSE_SUCCESS_SUFFIX
    const errorStatus: HttpStatus = this.isIHandleOptions(options) ? options.errorStatus : null
    return this.buildHttpDecorator({errorStatus, successMessage, errorMessage})
  }

  /**
   * 根据信息构造装饰器
   * @param options 生成装饰器的配置
   * @returns MethodDecorator 方法装饰器
   * @remarks 其实就是把传入的信息保存到执行上下文的 reflector 里
   */
  buildHttpDecorator(options: BuildDecoratorOptions): MethodDecorator {
    const decoratorMeta = {
      successMessage: META.HTTP_DECORATOR_SUCCESS_MESSAGE,
      errorMessage: META.HTTP_DECORATOR_ERROR_MESSAGE,
      errorStatus: META.HTTP_DECORATOR_ERROR_STATUS,
    }
    return (target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      Object.keys(options).forEach(key => {
        options[key] && SetMetadata(decoratorMeta[key], options[key])(descriptor.value)
      })
    }
  }

  /**
   * 构造响应成功体的装饰器，对响应失败不处理
   * @param message 响应成功信息
   * @example ```@ResProcessor.success('获取xx数据成功')```
   */
  success(message: HttpMessage) {
    this.buildHttpDecorator({successMessage: message})
  }

  /**
   * 构造响应错误体的装饰器，对响应成功不处理
   * @param message 响应错误信息
   * @param statusCode 响应错误码
   * @example ```@ResProcessor.error('获取xx数据失败', HttpStatus.NOT_FOUND)```
   */
  error(message: HttpMessage, statusCode: HttpStatus) {
    this.buildHttpDecorator({errorMessage: message, errorStatus: statusCode})
  }
}

/**
 * http 响应装饰器
 * @example ```@ResProcessor.handle('获取xx数据')```
 * @example ```@ResProcessor.handle({message: '获取xx数据', errorStatus: HttpStatus.NOT_FOUND})```
 * @example ```@ResProcessor.success('获取xx数据成功')```
 * @example ```@ResProcessor.error('获取xx数据失败', HttpStatus.NOT_FOUND)```
 */
export const ResProcessor = new HttpProcessor()
