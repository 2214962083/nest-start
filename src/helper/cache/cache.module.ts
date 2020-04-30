import {Module, CacheModule} from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import {RedisService} from './cache.service'
import {config} from '@app/config'

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: config.db.redis.host,
      port: config.db.redis.port,
      db: config.db.redis.db,
      ttl: 5,
      auth_pass: config.db.redis.password,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
