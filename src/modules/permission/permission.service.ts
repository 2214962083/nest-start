import {Injectable} from '@nestjs/common'
import {Permission} from '@app/enums'
import {PermissionEntity} from '@app/entities'
import {Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {CreatePermissionDto, UpdatePermissionDto} from './dto'
import {isNil} from 'lodash'
import {CommonService} from '@app/helper/common/common.service'
import {RedisService} from '@app/helper/cache/cache.service'

@Injectable()
export class PermissionService extends CommonService<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    public readonly permissionRepository: Repository<PermissionEntity>,
    public readonly redisService: RedisService,
  ) {
    super(permissionRepository, redisService)
  }

  /**
   * 创建权限
   * @param createPermissionDto 创建权限所用到的数据
   * @returns 权限实体
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<PermissionEntity> {
    const {name, permission, description} = createPermissionDto
    const permissionEntiy: PermissionEntity = await this.permissionRepository.create({
      name,
      permission,
      roles: [],
      description,
    })
    return await this.permissionRepository.save(permissionEntiy)
  }

  /**
   * 更新权限
   * @param permissionId 权限id
   * @param updatePermissionDto 更新权限所需数据
   */
  async update(permissionId: number, updatePermissionDto: UpdatePermissionDto) {
    const {name, permission, description} = updatePermissionDto
    const permissionEntity: PermissionEntity = await this.permissionRepository.findOne(permissionId)
    if (!isNil(name)) permissionEntity.name = name
    if (!isNil(permission)) permissionEntity.permission = permission
    if (!isNil(description)) permissionEntity.description = description
    return await this.permissionRepository.save(permissionEntity)
  }
}
