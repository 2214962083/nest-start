import {verify, sign, VerifyErrors} from 'jsonwebtoken'
import {pbkdf2Sync, randomBytes} from 'crypto'
import {config} from '@app/config'
import {TokenErrorType} from '@app/enums'
import {Injectable} from '@nestjs/common'
import {JwtPayload} from '@app/interfaces'
import {RedisService} from '@app/helper/cache/cache.service'
import {RoleService} from '@app/modules/role/role.service'
import {
  LoginWithVerificationCodeDto,
  LoginWithPasswordDto,
  RegisterWithPasswordDto,
  RegisterWithVerificationCodeDto,
} from './dto'
import {isNil, merge} from 'lodash'
import {InjectRepository} from '@nestjs/typeorm'
import {UserEntity} from '@app/entities'
import {Repository, FindOneOptions} from 'typeorm'
import {UserService} from '@app/modules/user/user.service'
import {HttpBadRequestError} from '@app/errors/bad-request.error'
import {HttpNotImplementedError} from '@app/errors/not-implemented'
import * as META from '@app/constants/meta.constant'
import {RegisterDto, SendCodeDto} from './dto/index'
import {uniqueNamesGenerator, adjectives, colors, animals} from 'unique-names-generator'
import {ModuleRef} from '@nestjs/core'
import {CreateUserDto} from '../user/dto/create-user.dto'

@Injectable()
export class AuthService {
  private tokenSecret: string = config.tokenSecrect
  private tokenTime: string | number = config.toekenTime
  private userService: UserService

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    public readonly moduleRef: ModuleRef,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, {strict: false})
  }

  /**
   * 多方式登录
   */
  async login(loginDto: LoginWithVerificationCodeDto | LoginWithPasswordDto): Promise<UserEntity> {
    let userEntity: UserEntity
    const isLoginWithVerificationCodeDto = (value: any): value is LoginWithVerificationCodeDto =>
      !isNil(value.verificationCode)

    if (isLoginWithVerificationCodeDto(loginDto)) {
      // 根据验证码登录
      userEntity = await this.loginWithVrificationCode(loginDto)
    } else {
      // 根据密码登录
      userEntity = await this.loginWithPassword(loginDto)
    }

    if (isNil(userEntity)) throw new HttpBadRequestError('未找到该用户')

    // 登录成功
    const roles = userEntity.roles.map(role => role.role)
    const token = await this.createToken({
      userId: userEntity.id,
      roles,
      permissions: await this.roleService.findPermissionsByRoles(roles),
    })
    return merge(userEntity, {token})
  }

  /**
   * 使用密码登录
   * 第一项填：手机号/邮箱号/用户名
   * 第二项填：密码
   */
  async loginWithPassword(loginDto: LoginWithPasswordDto): Promise<UserEntity> {
    const {tel, email, user, password} = loginDto
    const finduserOptions: FindOneOptions<UserEntity> = {relations: ['roles', 'weixin']}
    if (isNil(tel) && isNil(user) && isNil(email)) throw new HttpBadRequestError('用户名/手机号/邮箱 不能为空')
    if (!isNil(tel)) merge(finduserOptions, {where: {tel}})
    if (!isNil(email)) merge(finduserOptions, {where: {email}})
    if (!isNil(user)) merge(finduserOptions, {where: {user}})

    const userEntity: UserEntity = await this.userRepository.findOne(finduserOptions)
    if (isNil(userEntity)) throw new HttpNotImplementedError('用户名/手机号/邮箱 错误')
    if (userEntity.hashPassword !== this.encryptPassword(userEntity.salt, password))
      throw new HttpBadRequestError('用户密码错误')
    return userEntity
  }

  /**
   * 使用验证码登录
   * 第一项填：手机号/邮箱
   * 第二项填：验证码
   */
  async loginWithVrificationCode(loginDto: LoginWithVerificationCodeDto): Promise<UserEntity> {
    const {tel, email, verificationCode} = loginDto
    let _verificationCode: unknown
    if (!isNil(email)) {
      _verificationCode = await this.redisService.get(`${META.REDIS_VERIFICATION_CODE}${email}`)
    }
    if (!isNil(tel)) {
      _verificationCode = await this.redisService.get(`${META.REDIS_VERIFICATION_CODE}${tel}`)
    }
    if (Number(_verificationCode) !== Number(verificationCode)) throw new HttpBadRequestError('验证码错误')
    const userEntity: UserEntity = await this.userRepository.findOne({
      relations: ['roles', 'weixin'],
      where: {
        tel,
      },
    })
    if (isNil(userEntity)) throw new HttpBadRequestError('用户手机号/邮箱 不正确')
    return userEntity
  }

  /**
   * 多方式注册
   */
  async register(registerDto: RegisterDto): Promise<UserEntity> {
    let userEntity: UserEntity
    const {tel, email, user, password, verificationCode} = registerDto
    const valueIsRegisterWithPasswordDto = (value: any): value is RegisterWithPasswordDto =>
      !isNil(value.user) && !isNil(value.password)
    const valueIsRegisterWithVerificationCode = (value: any): value is RegisterWithVerificationCodeDto =>
      (!isNil(value.tel) || !isNil(value.email)) && !isNil(value.verificationCode)

    // 检查手机号
    if (!isNil(tel)) {
      userEntity = await this.userService.findByProperty({
        propertyName: 'tel',
        propertyValue: tel,
      })
      if (!isNil(userEntity)) throw new HttpBadRequestError('该手机号已注册')
    }

    // 检查邮箱号
    if (!isNil(email)) {
      userEntity = await this.userService.findByProperty({
        propertyName: 'email',
        propertyValue: email,
      })
      if (!isNil(userEntity)) throw new HttpBadRequestError('该邮箱号已注册')
    }

    // 检查用户名
    if (!isNil(user)) {
      userEntity = await this.userService.findByProperty({
        propertyName: 'user',
        propertyValue: user,
      })
      if (!isNil(userEntity)) throw new HttpBadRequestError('该用户名已注册')
    }
    if (valueIsRegisterWithPasswordDto(registerDto)) {
      // 注册方式一：只需用户名和密码
      userEntity = await this.registerWithPassword(registerDto)
    }
    if (valueIsRegisterWithVerificationCode(registerDto)) {
      // 注册方式二：手机/邮箱 和 验证码
      userEntity = await this.registerWithVerificationCode(registerDto)
    }

    if (isNil(userEntity)) throw new HttpBadRequestError('资料填写错漏')

    // 注册成功
    const roles = userEntity.roles.map(role => role.role)
    const token = await this.createToken({
      userId: userEntity.id,
      roles,
      permissions: await this.roleService.findPermissionsByRoles(roles),
    })
    return merge(userEntity, {token})
  }

  /**
   * 注册方式一
   * 第一项填：用户名
   * 第二项填：密码
   */
  async registerWithPassword(registerDto: RegisterWithPasswordDto): Promise<UserEntity> {
    const {user, password} = registerDto
    return this.userService.create({
      user,
      password,
    })
  }

  /**
   * 注册方式二
   * 第一项填：手机号/邮箱号
   * 第二项：验证码
   * 第三项填：密码（可选）
   * 第四项填：用户名（可选）
   */
  async registerWithVerificationCode(registerDto: RegisterWithVerificationCodeDto): Promise<UserEntity> {
    const {tel, email, verificationCode, password, user} = registerDto
    if (isNil(tel) && isNil(email)) throw new HttpBadRequestError('邮箱/手机号 不能为空')
    if (isNil(verificationCode)) throw new HttpBadRequestError('验证码不能为空')
    let createUserDto: CreateUserDto = {
      user:
        user ||
        uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: '-',
          length: 2,
        }),
      password:
        password ||
        uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: '_',
          length: 2,
        }),
    }
    let _verificationCode: unknown
    if (!isNil(tel)) {
      createUserDto = {...createUserDto, tel}
      _verificationCode = await this.redisService.get(`${META.REDIS_VERIFICATION_CODE}${tel}`)
    }
    if (!isNil(email)) {
      createUserDto = {...createUserDto, email}
      _verificationCode = await this.redisService.get(`${META.REDIS_VERIFICATION_CODE}${email}`)
    }
    if (Number(_verificationCode) !== Number(verificationCode)) throw new HttpBadRequestError('验证码错误')
    return this.userService.create(createUserDto)
  }

  /**
   * 发送验证码
   */
  async sendCode(sendCodeDto: SendCodeDto) {
    const {tel, email} = sendCodeDto

    if (isNil(tel) && isNil(email)) throw new HttpBadRequestError('手机号/邮箱号 至少得填一个')

    // 随便生成一个 6 位数字验证码
    const verificationCode = new Array(6)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join('')

    // 发给手机的验证码
    if (!isNil(tel)) {
      await this.redisService.setex(`${META.REDIS_VERIFICATION_CODE}${tel}`, verificationCode, 600)
    }

    // 发给邮箱的验证码
    if (!isNil(email)) {
      await this.redisService.setex(`${META.REDIS_VERIFICATION_CODE}${email}`, verificationCode, 600)
    }
  }

  /**
   * 解析token
   * @param token token 值
   * @returns 解密出的数据
   * @description 解密总管理后台的 token
   */
  async decodeToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      if (!token) return reject(TokenErrorType.TOKEN_IS_NULL)

      verify(token, this.tokenSecret, async (err: VerifyErrors, decodeData: JwtPayload) => {
        if (err) return reject(err.name as TokenErrorType)
        const {roles} = decodeData
        decodeData.permissions = await this.roleService.findPermissionsByRoles(roles)
        return resolve(decodeData as JwtPayload)
      })
    })
  }

  /**
   * 生成token
   * @param info 需要加密的内容
   * @returns token 值
   * @description 加密内容并生成总管理后台的 token
   */
  async createToken(info: JwtPayload): Promise<string> {
    return sign(info, this.tokenSecret, {
      expiresIn: this.tokenTime,
    })
  }

  /**
   * 生成盐
   * @returns 返回随机的 16 位 base64 值
   */
  createSalt(): string {
    return randomBytes(16).toString('base64')
  }

  /**
   * 加密密码为哈希值
   * @param salt 盐
   * @param password 需要加密的密码
   * @returns 哈希值
   */
  encryptPassword(salt: string, password: string): string {
    const _salt = new Buffer(salt, 'base64')
    return pbkdf2Sync(password, _salt, 1000, 64, 'sha1').toString('base64')
  }
}
