// 开发环境的配置
export const development = {
  db: {
    mysql: {
      host: '',
      port: 3306,
      user: '',
      password: '',
      database: '',
      entities: ['src/**/**.entity{.ts,.js}'],
    },
    redis: {
      host: 'localhost',
      port: 6379,
      password: '',
      db: 1,
    },
  },
}
