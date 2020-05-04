import {join} from 'path'

// 生产环境的配置
export const production = {
  db: {
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'nest_123456',
      database: 'nest_data',
      entities: [join(__dirname, '../', '**', '**.entity.{ts,js}')],
    },
    redis: {
      host: 'localhost',
      port: 6379,
      password: 'nest_123456',
      db: 1,
    },
  },
}
