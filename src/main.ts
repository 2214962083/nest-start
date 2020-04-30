import {NestFactory, Reflector} from '@nestjs/core'
import {NestFastifyApplication, FastifyAdapter} from '@nestjs/platform-fastify'
import {Logger, ClassSerializerInterceptor, CacheInterceptor} from '@nestjs/common'
import {AppModule} from './app.module'
import {config} from '@app/config'
import {ValidateDto} from '@app/pipes/validate-dto.pipe'
import {HttpExceptionFilter} from '@app/filters/error.filter'
import {TransformInterceptor} from '@app/interceptors/transform.interceptor'
import {ErrorInterceptor} from '@app/interceptors/error.interceptor'
import {LogInterceptor} from '@app/interceptors/log.interceptor'
import {PermissionGuard} from '@app/guards/permission.guard'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  const reflector = app.get(Reflector)
  // api 前缀
  app.setGlobalPrefix('nest-api')
  // 校验前端的数据类型是否合法
  app.useGlobalPipes(new ValidateDto())
  // 路由权限校验
  app.useGlobalGuards(new PermissionGuard(reflector))
  // 全局拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(reflector),
    new ErrorInterceptor(reflector),
    new LogInterceptor(),
    new ClassSerializerInterceptor(reflector),
  )
  // 全局错误过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 跨域
  app.enableCors()

  Logger.log(`当前环境是： ${config.env}, 当前端口是：${config.port}`, 'bootstrap')

  await app.listen(config.port, '0.0.0.0')
}
bootstrap()
