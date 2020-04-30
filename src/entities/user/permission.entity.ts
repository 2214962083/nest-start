import {Entity, Column, ManyToMany} from 'typeorm'
import {Permission} from '@app/enums'
import {BaseEntity} from '../base.entity'
import {RoleEntity} from './role.entity'

/**
 * 权限存储表
 */
@Entity({
  name: 'permission',
})
export class PermissionEntity extends BaseEntity {
  @Column({
    unique: true,
    length: 128,
    comment: '权限名称',
  })
  name: string

  @Column({
    unique: true,
    type: 'enum',
    enum: Permission,
    nullable: false,
    comment: '权限标识',
  })
  permission: Permission

  @ManyToMany(
    () => RoleEntity,
    roleEntity => roleEntity.permissions,
  )
  roles?: RoleEntity[]

  @Column({
    type: 'text',
    nullable: true,
    comment: '权限描述',
  })
  description?: string
}
