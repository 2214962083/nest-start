import {Module, forwardRef} from '@nestjs/common'
import {WeixinController} from './weixin.controller'
import {WeixinService} from './weixin.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {WeixinUserEntity} from '@app/entities'
import {RedisModule} from '@app/helper/cache/cache.module'
import {UserModule} from '@app/modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([WeixinUserEntity]), RedisModule, forwardRef(() => UserModule)],
  controllers: [WeixinController],
  providers: [WeixinService],
  exports: [WeixinService],
})
export class WeixinModule {}
