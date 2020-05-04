import {Module, forwardRef} from '@nestjs/common'
import {UserController} from './user.controller'
import {UserService} from './user.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserEntity} from '@app/entities'
import {RedisModule} from '@app/helper/cache/cache.module'
import {AuthModule} from '@app/modules/auth/auth.module'
import {RoleModule} from '@app/modules/role/role.module'
import {WeixinModule} from '@app/modules/weixin/weixin.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisModule,
    RoleModule,
    forwardRef(() => AuthModule),
    forwardRef(() => WeixinModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
