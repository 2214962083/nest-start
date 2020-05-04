import {Injectable} from '@nestjs/common'
import {RoleEntity, PermissionEntity} from '@app/entities'
import {RedisService} from '@app/helper/cache/cache.service'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CreateRoleDto, UpdateRoleDto} from './dto'
import {Permission} from '@app/enums'
import {PermissionService} from '@app/modules/permission/permission.service'
import {isNil} from 'lodash'
import {CommonService} from '@app/helper/common/common.service'

@Injectable()
export class RoleService extends CommonService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    public readonly roleRepository: Repository<RoleEntity>,
    public readonly redisService: RedisService,
    public readonly permissionService: PermissionService,
  ) {
    super(roleRepository, redisService)
    this.searchRelations = ['permissions']
  }

  /**
   * 创建角色
   * @param createRoleDto 创建角色所用到的数据
   * @returns 角色实体
   */
  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const {name, role, permissions, description} = createRoleDto
    const permissionEntities: PermissionEntity[] = await this.permissionService.findByPropertyArray({
      propertyName: 'permission',
      propertyValues: permissions,
    })
    const roleEntity: RoleEntity = await this.roleRepository.create({
      name,
      role,
      permissions: permissionEntities,
      description,
    })
    return await this.roleRepository.save(roleEntity)
  }

  /**
   * 更新角色
   * @param roleId 角色id
   * @param updateRoleDto 更新角色所需数据
   */
  async update(roleId: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const {name, role, permissions, description} = updateRoleDto
    //debugger
    const roleEntity: RoleEntity = await this.roleRepository.findOne(roleId)
    if (!isNil(name)) roleEntity.name = name
    if (!isNil(role)) roleEntity.role = role
    if (!isNil(description)) roleEntity.description = description
    if (!isNil(permissions)) {
      const permissionEntities: PermissionEntity[] = await this.permissionService.findByPropertyArray({
        propertyName: 'permission',
        propertyValues: permissions,
      })
      roleEntity.permissions = permissionEntities
    }
    return await this.roleRepository.save(roleEntity)
  }

  /**
   * 根据角色查找权限
   * @param roles 角色数组
   * @returns 权限列表
   */
  async findPermissionsByRoles(roles: string[]): Promise<Permission[]> {
    let permissions: Permission[] = []
    for (const role of roles) {
      let roleEntity: RoleEntity = await this.redisService.get<RoleEntity>(role)
      if (roleEntity === null) {
        roleEntity = await this.roleRepository.findOne({
          where: {
            role,
          },
          relations: ['permissions'],
        })
        this.redisService.setex(role, roleEntity, 24 * 60 * 60)
      }
      for (const permissionEntity of roleEntity.permissions) {
        if (permissionEntity && permissionEntity.permission && !permissions.includes(permissionEntity.permission)) {
          permissions.push(permissionEntity.permission)
        }
      }
    }
    return permissions
  }
}
