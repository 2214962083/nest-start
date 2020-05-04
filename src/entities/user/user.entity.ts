import {Entity, Column, ManyToMany, OneToOne, JoinTable, OneToMany} from 'typeorm'
import {BaseEntity} from '../base.entity'
import {RoleEntity} from './role.entity'
import {WeixinUserEntity} from './weixin-user.entity'
import {Exclude} from 'class-transformer'

/**
 * 用户账号存储表
 */
@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
    length: 128,
    comment: '用户名',
  })
  user: string

  @Exclude()
  @Column({
    length: 128,
    nullable: false,
    comment: '算法加密后的用户密码',
  })
  hashPassword: string

  @Exclude()
  @Column({
    length: 128,
    nullable: false,
    comment: '参与密码加密运算的值',
  })
  salt: string

  @Column({
    length: 50,
    nullable: true,
    comment: '用户手机号码',
  })
  tel?: string

  @Column({
    length: 60,
    nullable: true,
    comment: '用户邮箱号',
  })
  email?: string

  @ManyToMany(
    () => RoleEntity,
    roleEntity => roleEntity.users,
  )
  @JoinTable({
    name: 'user_with_role',
    joinColumns: [
      {
        name: 'userId',
        referencedColumnName: 'id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'roleId',
        referencedColumnName: 'id',
      },
    ],
  })
  roles: RoleEntity[]

  @OneToOne(
    () => WeixinUserEntity,
    weixinUserEntity => weixinUserEntity.user,
  )
  weixin?: WeixinUserEntity
}
