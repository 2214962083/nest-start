import {IsNotEmpty, Length, IsOptional, IsEnum} from 'class-validator'
import {Permission} from '@app/enums'

export class CreatePermissionDto {
  @IsNotEmpty({message: '权限名称不能为空'})
  @Length(2, 30, {message: '权限名称长度在2字符以上，30字符以内'})
  readonly name: string

  @IsNotEmpty({message: '权限代码不能为空'})
  @Length(2, 30, {message: '权限代码长度在2字符以上，30字符以内'})
  @IsEnum(Permission, {message: '权限代码不合法，请询问开发者'})
  readonly permission: Permission

  @IsOptional()
  @Length(0, 50, {message: '权限描述长度在50字符以内'})
  readonly description?: string
}
