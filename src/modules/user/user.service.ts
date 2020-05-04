import {Injectable} from '@nestjs/common'
import {UserEntity, RoleEntity, WeixinUserEntity} from '@app/entities'
import {RedisService} from '@app/helper/cache/cache.service'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CreateUserDto, UpdateUserDto} from './dto'
import {RoleService} from '@app/modules/role/role.service'
import {merge, isNil} from 'lodash'
import {AuthService} from '@app/modules/auth/auth.service'
import {WeixinService} from '@app/modules/weixin/weixin.service'
import {ModuleRef} from '@nestjs/core'
import {CommonService} from '@app/helper/common/common.service'

@Injectable()
export class UserService extends CommonService<UserEntity> {
  /**
   * 循环依赖不起作用，被迫手动引入
   */
  private weixinService: WeixinService
  private authService: AuthService
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    public readonly moduleRef: ModuleRef,
    public readonly redisService: RedisService,
    public readonly roleService: RoleService,
  ) {
    super(userRepository, redisService)
    this.searchRelations = ['roles', 'hotels', 'weixin']
  }

  onModuleInit() {
    this.weixinService = this.moduleRef.get(WeixinService, {strict: false})
    this.authService = this.moduleRef.get(AuthService, {strict: false})
  }

  /**
   * 创建用户
   * @param createUserDto 创建用户所用到的数据
   * @returns 用户实体
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {user, password, tel, email, roleIds} = createUserDto
    const roleEntities: RoleEntity[] = await this.roleService.findByPropertyArray({
      propertyName: 'id',
      propertyValues: roleIds,
    })
    const salt = this.authService.createSalt()
    const hashPassword = this.authService.encryptPassword(salt, password)
    const userEntity: UserEntity = await this.userRepository.create({
      user,
      hashPassword,
      salt,
      roles: roleEntities,
    })
    if (!isNil(tel)) userEntity.tel = tel
    if (!isNil(email)) userEntity.email = email
    return await this.userRepository.save(userEntity)
  }

  /**
   * 更新用户
   * @param userId 用户id
   * @param updateUserDto 更新用户所需数据
   */
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const {user, password, tel, email, roleIds, openid} = updateUserDto
    const userEntity: UserEntity = await this.userRepository.findOne(userId)
    if (!isNil(user)) userEntity.user = user
    if (!isNil(tel)) userEntity.tel = tel
    if (!isNil(email)) userEntity.email = email
    if (!isNil(password)) {
      const salt = this.authService.createSalt()
      const hashPassword = this.authService.encryptPassword(salt, password)
      merge(userEntity, {salt, hashPassword})
    }
    if (!isNil(roleIds) && roleIds.length > 0) {
      const roleEntities: RoleEntity[] = await this.roleService.findByPropertyArray({
        propertyName: 'id',
        propertyValues: roleIds,
      })
      userEntity.roles = roleEntities
    }
    if (!isNil(openid)) {
      const weixinUserEntity: WeixinUserEntity = await this.weixinService.findByProperty({
        propertyName: 'openid',
        propertyValue: openid,
      })
      userEntity.weixin = weixinUserEntity
    }
    return await this.userRepository.save(userEntity)
  }
}
