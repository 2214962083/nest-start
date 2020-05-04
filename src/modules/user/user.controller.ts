import {Controller, Get, UnauthorizedException, HttpStatus, Post, Body, Put, Param, Delete, Query} from '@nestjs/common'
import {UserService} from './user.service'
import {ResProcessor} from '@app/decorators/http.decorator'
import {HttpUnauthorizedError} from '@app/errors/unauthorized.error'
import {guards} from '@app/decorators/guard.decorator'
import {UserEntity} from '@app/entities'
import {DeleteResult} from 'typeorm'
import {CreateUserDto, UserIdDto, UpdateUserDto} from './dto'
import {CommonController} from '@app/helper/common/common.controller'
import {SearchDto} from '@app/helper/common/common.dto'

@Controller('users')
export class UserController extends CommonController<UserEntity> {
  constructor(private readonly userService: UserService) {
    super()
  }

  @Get()
  @ResProcessor.handle('搜索用户')
  async search(@Query() searchDto: SearchDto) {
    return this.userService.search(searchDto)
  }

  @Get(':userId')
  @ResProcessor.handle('根据id获取单个用户')
  async findById(@Param() userIdDto: UserIdDto) {
    const {userId} = userIdDto
    return this.userService.findByProperty({
      propertyName: 'id',
      propertyValue: userId,
      relations: ['roles', 'hotels', 'weixin', 'logs'],
    })
  }

  @Post()
  @ResProcessor.handle('创建用户')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto)
  }

  @Put(':userId')
  @ResProcessor.handle('修改用户')
  async update(@Param() userIdDto: UserIdDto, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const {userId} = userIdDto
    return this.userService.update(userId, updateUserDto)
  }

  @Delete(':userId')
  @ResProcessor.handle('删除用户')
  async delete(@Param() userIdDto: UserIdDto): Promise<DeleteResult> {
    const {userId} = userIdDto
    return this.userService.delete(userId)
  }
}
