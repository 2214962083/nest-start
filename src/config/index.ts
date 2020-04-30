import {merge} from 'lodash'
import {development} from './development'
import {test} from './test'
import {production} from './production'
import {Enviornment} from '@app/enums'

const environment: Enviornment = (process.env.NODE_ENV as Enviornment) || Enviornment.development
const environments = {
  [Enviornment.development]: development,
  [Enviornment.test]: test,
  [Enviornment.production]: production,
}
const {mysql} = environments[environment].db

// 基础配置：
const basic = {
  // 获取当前的工作环境
  env: process.env.NODE_ENV || Enviornment.development,
  // 端口
  port: 9119,
  // token 加密参数
  tokenSecrect: 'sadkasasdzxc',
  // token 有效期
  toekenTime: '1d',
  // typeorm 配置
  typeorm: {
    type: 'mysql',
    host: mysql.host,
    port: mysql.port,
    username: mysql.user,
    password: mysql.password,
    database: mysql.database,
    entities: mysql.entities,
    synchronize: true,
  },
}

export const config = merge(basic, environments[environment])
