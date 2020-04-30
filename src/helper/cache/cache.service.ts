import {Injectable, Logger, CACHE_MANAGER, Inject} from '@nestjs/common'
import {config} from '@app/config'
import {isString} from 'lodash'
import {RedisClient} from 'redis'

/**
 * redis 操作相关服务
 */
@Injectable()
export class RedisService {
  /**
   * 配置 redis
   */
  private readonly cache

  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    this.cache = cacheManager
    this.redisClient.on('error', err => {
      Logger.error(`redis出错：${err}`, 'RedisService', 'RedisService')
    })
  }

  private get redisClient(): RedisClient {
    return this.cache.store.getClient()
  }

  /**
   * redis 客户端是否可用
   */
  private get checkClientAvaliable(): boolean {
    return this.redisClient.connected
  }

  /**
   * 将数据断言为 object
   * @params data 要断言的数据
   * @returns boolean
   */
  private isNotString = <T>(data: string | object | T): data is object => !isString(data)

  /**
   *  向 redis 存储的 `string` | `object` 值
   * @remarks 无过期时间
   * @param key 键
   * @param value 值
   * @returns 异步返回操作执行是否成功
   */
  public set<T>(key: string, value: string | object | T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isNotString<T>(value)) value = JSON.stringify(value)
      this.redisClient.set(key, value as string, err => {
        err ? reject(err) : resolve(true)
      })
    })
  }

  /**
   * 从 redis 中取值
   * @param key
   * @returns 返回从 redis 读到的数据
   */
  get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, data: string | T) => {
        if (err) reject(err)
        else {
          try {
            let result: T = JSON.parse(data as string)
            resolve(result)
          } catch (err) {
            resolve(data as T)
          }
        }
      })
    })
  }

  /**
   * 从 redis 删除某个记录
   * @remarks 通过设置过时时间为 1ms 实现
   * @param key 键
   * @returns 异步返回操作执行是否成功
   */
  delete(key: string): Promise<boolean> {
    return this.psetex(key, '', 1)
  }

  /**
   * 向 redis 存储数据（单位：毫秒）
   * @param key 键
   * @param value 值
   * @param milliseconds 过期时间，单位：毫秒
   * @returns 异步返回操作执行是否成功
   */
  psetex<T>(key: string, value: string | object | T, milliseconds: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isNotString<T>(value)) value = JSON.stringify(value)
      this.redisClient.psetex(key, milliseconds, value as string, (err, data) => {
        err ? reject(err) : resolve(true)
      })
    })
  }

  /**
   * 向 redis 存储数据（单位：秒）
   * @param key 键
   * @param value 值
   * @param seconds 过期时间，单位：秒
   * @returns 异步返回操作执行是否成功
   */
  setex<T>(key: string, value: string | object | T, seconds: number): Promise<boolean> {
    if (this.isNotString<T>(value)) value = JSON.stringify(value)
    return new Promise((resolve, reject) => {
      this.redisClient.setex(key, seconds, value as string, (err, data) => {
        err ? reject(err) : resolve(true)
      })
    })
  }
}
