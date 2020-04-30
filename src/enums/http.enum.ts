/*
 * @file: 请求响应相关枚举
 * @Author: YangJinMing
 * @create: 2019-11-04 16:39:40
 * @update: 2020-03-17 16:56:58
 * @editor: Do not edit
 */

/**
 * 业务逻辑状态码 (作 restful api status 的补充描述)
 */
export enum ServiceCode {
  /**
   * 操作成功
   */
  SUCCESS = 0,

  /**
   * 操作失败
   */
  ERROR = 1,

  /**
   * 请求参数校验不合法
   */
  VALIDATE_FAIL = 3,

  /**
   * token 解析错误
   */
  TOKEN_DECODE_ERROR = 4,

  /**
   * token 未到激活时间
   */
  TOKEN_NOT_ACTIVE_ERROR = 5,

  /**
   * token 过期
   */
  TOKEN_TIME_OUT_ERROR = 6,
}

/**
 * token错误类型
 */
export enum TokenErrorType {
  /**
   * token 为空
   */
  TOKEN_IS_NULL = 'TokenIsNull',
  /**
   * token 解析错误
   */
  DECODE_ERROR = 'JsonWebTokenError',

  /**
   * token 未到激活时间
   */
  NOT_ACTIVE_ERROR = 'NotBeforeError',

  /**
   * token 过期
   */
  TOKEN_TIME_OUT_ERROR = 'TokenExpiredError',
}

/**
 * 排序枚举
 */
export enum Sort {
  /**
   * 顺序
   */
  ASC = 'ASC',

  /**
   * 降序
   */
  DESC = 'DESC',
}
