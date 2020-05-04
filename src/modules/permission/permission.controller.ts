import {Controller, Get, Post, Body, Put, Delete, Param, Query} from '@nestjs/common'
import {ResProcessor} from '@app/decorators/http.decorator'
import {PermissionService} from './permission.service'
import {PermissionEntity} from '@app/entities'
import {CreatePermissionDto, UpdatePermissionDto, PermissionIdDto} from './dto'
import {CommonController} from '@app/helper/common/common.controller'
import {SearchDto} from '@app/helper/common/common.dto'

@Controller('permissions')
export class PermissionController extends CommonController<PermissionEntity> {
  constructor(private readonly permissionService: PermissionService) {
    super()
  }

  @Get()
  @ResProcessor.handle('搜索权限')
  async search(@Query() searchDto: SearchDto) {
    return this.permissionService.search(searchDto)
  }

  @Get(':permissionId')
  @ResProcessor.handle('根据 id 获取单个权限')
  async findById(@Param() permissionIdDto: PermissionIdDto) {
    const {permissionId} = permissionIdDto
    return this.permissionService.findByProperty({
      propertyName: 'id',
      propertyValue: permissionId,
    })
  }

  @Post()
  @ResProcessor.handle('创建权限')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto)
  }

  @Put(':permissionId')
  @ResProcessor.handle('修改权限')
  async update(@Param() permissionIdDto: PermissionIdDto, @Body() updatePermissionDto: UpdatePermissionDto) {
    const {permissionId} = permissionIdDto
    return this.permissionService.update(permissionId, updatePermissionDto)
  }

  @Delete(':permissionId')
  @ResProcessor.handle('删除权限')
  async delete(@Param() permissionIdDto: PermissionIdDto) {
    const {permissionId} = permissionIdDto
    return this.permissionService.delete(permissionId)
  }
}
