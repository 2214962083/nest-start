import {Module, MiddlewareConsumer, RequestMethod, NestModule} from '@nestjs/common'
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {config} from '@app/config'
import {RoleModule} from '@app/modules/role/role.module'
import {DecodeTokenMiddleWare} from '@app/middlewares/decodeToken.middleware'
import {AuthModule} from '@app/modules/auth/auth.module'
import {PermissionModule} from '@app/modules/permission/permission.module'
import {RedisModule} from '@app/helper/cache/cache.module'
import {UserModule} from '@app/modules/user/user.module'

console.log(config.typeorm)
@Module({
  imports: [
    TypeOrmModule.forRoot(config.typeorm as TypeOrmModuleOptions),
    RedisModule,
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecodeTokenMiddleWare).forRoutes({
      path: '(.*)',
      method: RequestMethod.ALL,
    })
  }
}
