import {IsNotEmpty, Length, IsOptional} from 'class-validator'
import {Permission} from '@app/enums'

export class UpdatePermissionDto {
  @IsOptional()
  @IsNotEmpty({message: '权限名称不能为空'})
  @Length(2, 30, {message: '权限名称长度在2字符以上，30字符以内'})
  readonly name?: string

  @IsOptional()
  @IsNotEmpty({message: '权限代码不能为空'})
  @Length(2, 30, {message: '权限代码长度在2字符以上，30字符以内'})
  readonly permission?: Permission

  @IsOptional()
  @Length(0, 50, {message: '权限描述长度在50字符以内'})
  readonly description?: string
}
