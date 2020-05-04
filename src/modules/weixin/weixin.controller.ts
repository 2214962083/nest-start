import {Controller, Get, UnauthorizedException, HttpStatus, Post, Body, Put, Param, Delete, Query} from '@nestjs/common'
import {WeixinService} from './weixin.service'
import {ResProcessor} from '@app/decorators/http.decorator'
import {HttpUnauthorizedError} from '@app/errors/unauthorized.error'
import {guards} from '@app/decorators/guard.decorator'
import {WeixinUserEntity} from '@app/entities'
import {DeleteResult} from 'typeorm'
import {CreateWeixinUserDto, WeixinUserIdDto, UpdateWeixinUserDto} from './dto'
import {CommonController} from '@app/helper/common/common.controller'
import {SearchDto} from '@app/helper/common/common.dto'

@Controller('weixin-users')
export class WeixinController extends CommonController<WeixinUserEntity> {
  constructor(private readonly weixinService: WeixinService) {
    super()
  }

  @Get()
  @ResProcessor.handle('搜索微信用户')
  async search(@Query() searchDto: SearchDto) {
    return this.weixinService.search(searchDto)
  }

  @Get(':weixinUserId')
  @ResProcessor.handle('根据id获取单个微信用户')
  async findById(@Param() weixinUserIdDto: WeixinUserIdDto) {
    const {weixinUserId} = weixinUserIdDto
    return this.weixinService.findByProperty({
      propertyName: 'id',
      propertyValue: weixinUserId,
      relations: ['user'],
    })
  }

  @Post()
  @ResProcessor.handle('创建微信用户')
  async create(@Body() createWeixinUserDto: CreateWeixinUserDto) {
    return this.weixinService.create(createWeixinUserDto)
  }

  @Put(':weixinUserId')
  @ResProcessor.handle('修改微信用户')
  async update(@Param() weixinUserIdDto: WeixinUserIdDto, @Body() updateWeixinUserDto: UpdateWeixinUserDto) {
    const {weixinUserId} = weixinUserIdDto
    return this.weixinService.update(weixinUserId, updateWeixinUserDto)
  }

  @Delete(':weixinUserId')
  @ResProcessor.handle('删除微信用户')
  async delete(@Param() weixinUserIdDto: WeixinUserIdDto): Promise<DeleteResult> {
    const {weixinUserId} = weixinUserIdDto
    return this.weixinService.delete(weixinUserId)
  }
}
