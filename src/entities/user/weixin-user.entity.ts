import {Entity, Column, OneToOne, JoinColumn} from 'typeorm'
import {Gender, Language} from '@app/enums'
import {BaseEntity} from '../base.entity'
import {UserEntity} from './user.entity'

/**
 * 微信用户信息存储表
 */
@Entity({
  name: 'weixin_user',
})
export class WeixinUserEntity extends BaseEntity {
  @OneToOne(
    () => UserEntity,
    userEntity => userEntity.weixin,
    {cascade: true},
  )
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user?: UserEntity

  @Column({
    length: 128,
    nullable: true,
    comment: '用户昵称',
  })
  nickname: string

  @Column({
    type: 'text',
    nullable: true,
    comment: '用户头像',
  })
  avatar: string

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNKNOWN,
    comment: '用户性别，0为未知，1为男，2为女',
  })
  gender: Gender

  @Column({
    length: 128,
    nullable: true,
    comment: '用户所在国家',
  })
  country: string

  @Column({
    length: 128,
    nullable: true,
    comment: '用户所在省份',
  })
  province: string

  @Column({
    length: 128,
    nullable: true,
    comment: '用户所在城市',
  })
  city: string

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.ZH_CN,
    comment: '用户语言',
  })
  language: Language

  @Column({
    length: 128,
    comment: '微信授权的 openid',
  })
  openid: string
}
