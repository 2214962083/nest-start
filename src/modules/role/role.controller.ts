import {Controller, Get, UnauthorizedException, HttpStatus, Post, Body, Put, Param, Delete, Query} from '@nestjs/common'
import {RoleService} from './role.service'
import {ResProcessor} from '@app/decorators/http.decorator'
import {HttpUnauthorizedError} from '@app/errors/unauthorized.error'
import {guards} from '@app/decorators/guard.decorator'
import {RoleEntity} from '@app/entities'
import {CreateRoleDto, RoleIdDto, UpdateRoleDto} from './dto'
import {CommonController} from '@app/helper/common/common.controller'
import {SearchDto} from '@app/helper/common/common.dto'

@Controller('roles')
export class RoleController extends CommonController<RoleEntity> {
  constructor(private readonly roleService: RoleService) {
    super()
  }

  @Get()
  @ResProcessor.handle('搜索角色')
  async search(@Query() searchDto: SearchDto) {
    return this.roleService.search(searchDto)
  }

  @Get(':roleId')
  @ResProcessor.handle('根据 id 获取单个角色')
  async findById(@Param() roleIdDto: RoleIdDto) {
    const {roleId} = roleIdDto
    return this.roleService.findByProperty({
      propertyName: 'id',
      propertyValue: roleId,
      relations: ['permissions'],
    })
  }

  @Post()
  @ResProcessor.handle('创建角色')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Put(':roleId')
  @ResProcessor.handle('修改角色')
  async update(@Param() roleIdDto: RoleIdDto, @Body() updateRoleDto: UpdateRoleDto) {
    const {roleId} = roleIdDto
    return this.roleService.update(roleId, updateRoleDto)
  }

  @Delete(':roleId')
  @ResProcessor.handle('删除角色')
  async delete(@Param() roleIdDto: RoleIdDto) {
    const {roleId} = roleIdDto
    return this.roleService.delete(roleId)
  }
}
