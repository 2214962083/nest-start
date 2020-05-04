import {IsNotEmpty, Length, IsOptional, IsEnum, IsArray} from 'class-validator'
import {Permission} from '@app/enums'

export class CreateRoleDto {
  @IsNotEmpty({message: '角色名称不能为空'})
  @Length(2, 30, {message: '角色名称长度在2字符以上，30字符以内'})
  readonly name: string

  @IsNotEmpty({message: '角色代码不能为空'})
  @Length(2, 30, {message: '角色代码长度在2字符以上，30字符以内'})
  readonly role: string

  @IsNotEmpty({message: '权限代码列表不能为空'})
  @IsArray({message: '权限代码列表必须为数组类型'})
  @IsEnum(Permission, {message: '权限代码列表只能添加已存在的权限代码', each: true})
  readonly permissions: Permission[]

  @IsOptional()
  @Length(0, 50, {message: '角色描述长度在50字符以内'})
  readonly description?: string
}
