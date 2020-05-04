import {Controller, Get, Post, Body, Put, Param, Delete, Query} from '@nestjs/common'
import {AuthService} from './auth.service'
import {ResProcessor} from '@app/decorators/http.decorator'
import {guards} from '@app/decorators/guard.decorator'
import {LoginWithVerificationCodeDto, LoginWithPasswordDto, RegisterDto, SendCodeDto} from './dto'
import {Permission} from '@app/enums'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ResProcessor.handle('登录')
  async login(@Body() loginDto: LoginWithVerificationCodeDto | LoginWithPasswordDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  @ResProcessor.handle('注册')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('send-code')
  @ResProcessor.handle('发送验证码')
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto)
  }

  @Get('test')
  @guards(Permission.NORMAL)
  @ResProcessor.handle('测试权限校验')
  async testPErmission() {
    return '你通过了权限校验'
  }
}
