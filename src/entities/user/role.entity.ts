import {Entity, Column, ManyToMany, JoinTable} from 'typeorm'
import {BaseEntity} from '../base.entity'
import {UserEntity} from './user.entity'
import {PermissionEntity} from './permission.entity'

/**
 * 角色存储表
 */
@Entity({
  name: 'role',
})
export class RoleEntity extends BaseEntity {
  @Column({
    unique: true,
    length: 128,
    comment: '角色名称',
  })
  name: string

  @Column({
    unique: true,
    length: 128,
    comment: '角色代码',
  })
  role: string

  @ManyToMany(
    () => UserEntity,
    userEntity => userEntity.roles,
  )
  users?: UserEntity[]

  @ManyToMany(
    () => PermissionEntity,
    permissionEntity => permissionEntity.roles,
  )
  @JoinTable({
    name: 'role_with_permission',
    joinColumns: [
      {
        name: 'roleId',
        referencedColumnName: 'id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'permissionId',
        referencedColumnName: 'id',
      },
    ],
  })
  permissions: PermissionEntity[]

  @Column({
    type: 'text',
    nullable: true,
    comment: '角色描述',
  })
  description?: string
}
