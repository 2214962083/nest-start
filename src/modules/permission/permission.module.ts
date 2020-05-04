import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {PermissionEntity} from '@app/entities'
import {PermissionController} from './permission.controller'
import {PermissionService} from './permission.service'
import {RedisModule} from '@app/helper/cache/cache.module'

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity]), RedisModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
