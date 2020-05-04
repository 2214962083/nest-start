import {Module, forwardRef} from '@nestjs/common'
import {RoleModule} from '@app/modules/role/role.module'
import {AuthService} from './auth.service'
import {AuthController} from './auth.controller'
import {RedisModule} from '@app/helper/cache/cache.module'
import {UserModule} from '@app/modules/user/user.module'
import {UserEntity} from '@app/entities'
import {TypeOrmModule} from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule, RedisModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
