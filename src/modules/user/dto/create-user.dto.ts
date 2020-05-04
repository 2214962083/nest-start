import {IsNotEmpty, Length, IsOptional, IsArray, IsNumber, IsEmail} from 'class-validator'
import {Type} from 'class-transformer'

export class CreateUserDto {
  @IsNotEmpty({message: '用户名不能为空'})
  @Length(2, 30, {message: '用户名长度在2字符以上，30字符以内'})
  readonly user: string

  @IsNotEmpty({message: '密码不能为空'})
  @Length(8, 30, {message: '密码长度在8字符以上，30字符以内'})
  readonly password: string

  @IsOptional()
  @IsNotEmpty({message: '用户手机号不能为空'})
  @Length(1, 30, {message: '用户手机号长度在1字符以上，30字符以内'})
  readonly tel?: string

  @IsOptional()
  @IsNotEmpty({message: '用户邮箱号不能为空'})
  @IsEmail({}, {message: '用户邮箱格式不正确'})
  @Length(1, 60, {message: '用户邮箱号长度在1字符以上，60字符以内'})
  readonly email?: string

  @IsOptional()
  @IsNotEmpty({message: '角色 id 列表不能为空'})
  @IsArray({message: '角色 id 列表必须为数组类型'})
  readonly roleIds?: number[]
}
