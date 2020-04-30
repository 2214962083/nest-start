import {Injectable, NestMiddleware, Logger} from '@nestjs/common'
import {AuthService} from '@app/modules/auth/auth.service'
import * as META from '@app/constants/meta.constant'
import {CustomRequest} from '@app/interfaces'
import {TokenErrorType} from '@app/enums'

@Injectable()
export class DecodeTokenMiddleWare implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  use(req: CustomRequest['raw'], res: Response, next: Function) {
    debugger
    const token = req.headers[META.USER_TOKEN]
    console.log('\n\n\n')
    if (!token) return next()
    Logger.debug(`中间件解析token：${token}`, 'DecodeTokenMiddleWare')

    this.authService
      .decodeToken(token as string)
      .then(data => {
        Logger.debug(`token解析中间件解析成功: ${JSON.stringify(data, null, 4)}`, 'DecodeTokenMiddleWare')
        req.user = data
        next()
      })
      .catch((err: TokenErrorType) => {
        Logger.debug(`token解析中间件出错: ${err}`, 'DecodeTokenMiddleWare')
        req.tokenDecodeError = err
        next()
      })
  }
}
