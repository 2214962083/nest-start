import {Module} from '@nestjs/common'
import {RoleController} from './role.controller'
import {RoleService} from './role.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {RoleEntity} from '@app/entities'
import {RedisModule} from '@app/helper/cache/cache.module'
import {PermissionModule} from '@app/modules/permission/permission.module'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), RedisModule, PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
