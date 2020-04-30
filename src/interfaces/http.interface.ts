import {ServiceCode, TokenErrorType} from '@app/enums'
import {FastifyRequest} from 'fastify'
import {JwtPayload} from './jwt.interface'
import {IncomingMessage} from 'http'

/**
 * 在 validateDto 校验前端请求数据不合法时，返回的错误格式（部分）
 * @param 请求参数的字段名
 * @msg 错误信息
 */
export interface ParamsError {
  param: string
  msg: string
}

/**
 * 响应信息
 */
export type HttpMessage = string

/**
 * 响应错误
 */
export type HttpError = string | ParamsError[]

/**
 * 响应格式
 * @code 业务逻辑状态码
 * @message 响应信息
 * @error 错误信息
 * @result 结果主体
 * @debug 定位错误
 */
export type HttpResOptions = {
  code?: ServiceCode
  message: HttpMessage
  error: HttpError
  result?: unknown
  debug?: unknown
}

/**
 * 带页面的响应格式
 */
export interface HttpResultPaginate<T> {
  data: T
  pagination: {
    total: number // 总条数
    currentPage: number // 当前页数
    totalPage: number // 总页数
    pageSize: number // 每页多少条
  }
}

/**
 * 响应构造接口
 */
//export type HttpResBase = HttpMessage | HttpResOptions

/**
 * 响应报文格式
 */
export type HttpResSuccess<T> = HttpResOptions & {
  result: T | HttpResultPaginate<T>
}

/**
 * 中间件给请求附属了一个 user 属性，为 token 解码结果
 * 中间件给请求附属了一个 user 属性，为 token 解码出错的类型
 */
export interface RequestPlus {
  user?: JwtPayload
  tokenDecodeError?: TokenErrorType
}

/**
 * 最终 fastify 请求体的类型
 */
export type CustomRequest = FastifyRequest<RequestPlus & IncomingMessage>
