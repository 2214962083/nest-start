import {IsNotEmpty, Length, IsOptional, IsNumber, IsEnum} from 'class-validator'
import {Language, Gender} from '@app/enums'

export class UpdateWeixinUserDto {
  @IsOptional()
  @IsNotEmpty({message: '用户 id 不能为空'})
  @IsNumber({allowInfinity: false, allowNaN: false}, {message: '用户 id 必须为数字'})
  readonly userId?: number

  @IsOptional()
  @IsNotEmpty({message: 'openid 不能为空'})
  @Length(2, 100, {message: 'openid 长度在2字符以上，100字符以内'})
  readonly openid?: string

  @IsOptional()
  @IsNotEmpty({message: '昵称不能为空'})
  @Length(1, 30, {message: '昵称长度在1字符以上，30字符以内'})
  readonly nickname?: string

  @IsOptional()
  @IsNotEmpty({message: '头像地址不能为空'})
  @Length(4, 120, {message: '头像地址长度在4字符以上，120字符以内'})
  readonly avatar?: string

  @IsOptional()
  @IsNotEmpty({message: '性别不能为空'})
  @IsEnum(Gender, {message: '性别值不合法'})
  readonly gender?: Gender

  @IsOptional()
  @IsNotEmpty({message: '国家名称不能为空'})
  @Length(2, 30, {message: '国家名称长度在2字符以上，30字符以内'})
  readonly country?: string

  @IsOptional()
  @IsNotEmpty({message: '省份名称不能为空'})
  @Length(1, 30, {message: '省份名称长度在1字符以上，30字符以内'})
  readonly province?: string

  @IsOptional()
  @IsNotEmpty({message: '城市名称不能为空'})
  @Length(1, 30, {message: '城市名称长度在1字符以上，30字符以内'})
  readonly city?: string

  @IsOptional()
  @IsNotEmpty({message: '语言不能为空'})
  @IsEnum(Language, {message: '语言值不合法'})
  readonly language?: Language
}
