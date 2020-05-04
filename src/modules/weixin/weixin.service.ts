import {Injectable} from '@nestjs/common'
import {UserEntity, WeixinUserEntity} from '@app/entities'
import {RedisService} from '@app/helper/cache/cache.service'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CreateWeixinUserDto, UpdateWeixinUserDto} from './dto'
import {isNil} from 'lodash'
import {UserService} from '@app/modules/user/user.service'
import {ModuleRef} from '@nestjs/core'
import {CommonService} from '@app/helper/common/common.service'

@Injectable()
export class WeixinService extends CommonService<WeixinUserEntity> {
  private userService: UserService

  constructor(
    @InjectRepository(WeixinUserEntity)
    public readonly weixinUserRepository: Repository<WeixinUserEntity>,
    public readonly moduleRef: ModuleRef,
    public readonly redisService: RedisService,
  ) {
    super(weixinUserRepository, redisService)
    this.searchRelations = ['user']
  }

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, {strict: false})
  }

  /**
   * 创建微信用户
   * @param createWeixinUserDto 创建微信用户所用到的数据
   * @returns 微信用户实体
   */
  async create(createWeixinUserDto: CreateWeixinUserDto): Promise<WeixinUserEntity> {
    const {userId, openid, nickname, avatar, gender, country, province, city, language} = createWeixinUserDto
    const weixinUserEntity: WeixinUserEntity = this.weixinUserRepository.create({
      openid,
      nickname,
      avatar,
    })
    if (!isNil(gender)) weixinUserEntity.gender = gender
    if (!isNil(country)) weixinUserEntity.country = country
    if (!isNil(province)) weixinUserEntity.province = province
    if (!isNil(city)) weixinUserEntity.city = city
    if (!isNil(language)) weixinUserEntity.language = language
    if (!isNil(userId)) {
      const userEntity: UserEntity = await this.userService.findByProperty({
        propertyName: 'id',
        propertyValue: userId,
      })
      weixinUserEntity.user = userEntity
    }
    return await this.weixinUserRepository.save(weixinUserEntity)
  }

  /**
   * 更新微信用户
   * @param weixinUserId 微信用户id
   * @param updateWeixinUserDto 更新微信用户所需数据
   */
  async update(weixinUserId: number, updateWeixinUserDto: UpdateWeixinUserDto): Promise<WeixinUserEntity> {
    const {userId, openid, nickname, avatar, gender, country, province, city, language} = updateWeixinUserDto
    const weixinUserEntity: WeixinUserEntity = await this.weixinUserRepository.findOne(weixinUserId)
    if (!isNil(openid)) weixinUserEntity.openid = openid
    if (!isNil(nickname)) weixinUserEntity.nickname = nickname
    if (!isNil(avatar)) weixinUserEntity.avatar = avatar
    if (!isNil(gender)) weixinUserEntity.gender = gender
    if (!isNil(country)) weixinUserEntity.country = country
    if (!isNil(province)) weixinUserEntity.province = province
    if (!isNil(city)) weixinUserEntity.city = city
    if (!isNil(language)) weixinUserEntity.language = language
    if (!isNil(userId)) {
      const userEntity: UserEntity = await this.userService.findByProperty({
        propertyName: 'id',
        propertyValue: userId,
      })
      weixinUserEntity.user = userEntity
    }
    return await this.weixinUserRepository.save(weixinUserEntity)
  }
}
